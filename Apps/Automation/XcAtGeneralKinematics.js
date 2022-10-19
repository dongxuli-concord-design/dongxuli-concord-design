class XcAtGeneralKinematics {
  // The max convergence error requirement: the convergence error is defined as the sum of squared
  // distance between the current and target, and the distances are for TCP positions and unified TCP orientation direction vectors.
  static COVERGENCE_LIMIT = 1e-8;

  // Maximum steps of iterations: if this number of steps is reached before convergence,
  // increase this number to troubleshoot. If convergence is reached with a larger number of steps,
  // the robot model is complex for this simple IK algorithm.
  // If convergence is not reached with an increased number of steps, this  algorithm fails, and
  // a new algorithm is required.
  static MAX_IK_STEPS = 40000;

  // Step length scales by this factor, if the alignment error doesn't reduce by the current step length
  static ANNEALING_FACTOR = 0.95;

  #geometryDefinition;
  #jointCoordinateSystem;

  constructor({geometryDefinition, jointCoordinateSystem}) {
    this.#geometryDefinition = geometryDefinition;
    this.#jointCoordinateSystem = jointCoordinateSystem;
  }

  forwardKinematics({angles}) {
    const zeroPoint = new XcGm3dPosition( {
      x: 0.0,
      y: 0.0,
      z: 0.0
    });
    const jointAngles = [...angles];

    // assuming all types are rotary
    // TODO: the client must supply correct parameters. Any errors should be captured ASAP
    const joints = this.#geometryDefinition;
    if (jointAngles.length < joints.length) {
      jointAngles.push(0.0);
    }

    // overall transform from TCP to base coordinates
    const finalMatrix = new XcGm3dMatrix();
    const arrayMatrix = [];

    for (let index = 0; index < joints.length; ++index) {
      const joint = this.#geometryDefinition[index];
      const position = new XcGm3dPosition({x: joint.location[0], y: joint.location[1], z: joint.location[2]});
      const direction = new XcGm3dVector({x: joint.direction[0], y: joint.direction[1], z: joint.direction[2]});
      const axis = new XcGm3dAxis({position, direction});
      const translationMatrix = XcGm3dMatrix.translationMatrix({vector: position});
      const rotationMatrix = XcGm3dMatrix.rotationMatrix({angle: jointAngles[index] * Math.PI / 180., axis});
      arrayMatrix.push(rotationMatrix);

      if (index === 0) {
        const matrix0 = this.#jointCoordinateSystem[index].toMatrix();
        matrix0.multiply({matrix: rotationMatrix});
        finalMatrix.multiply({matrix: matrix0});
      } else {
        const matrix1 = this.#jointCoordinateSystem[index - 1].toMatrix();
        const matrix2 = this.#jointCoordinateSystem[index].toMatrix();
        const inverseMatrix1 = matrix1.inverse();
        const jointMatrix = XcGm3dMatrix.multiply({matrix1: inverseMatrix1, matrix2: rotationMatrix});
        jointMatrix.multiply({matrix: matrix2});
        finalMatrix.multiply({matrix: jointMatrix});
      }
    }
    return {finalMatrix, arrayMatrix};
  }

  // Prototype: Monte-Carlo annealing
  // Input:       targetMat - the target TCP position/orientation in the global frame
  // Input:       definition - the definiton of the robot, need to be consistent with forwardKinematics()
  // Input:       currentAngles - the current motor angles
  // Returns:     optimized robot parameters to reach the target TCP
  IK({targetMatrix, currentAngles}) {
    const targetMat = targetMatrix.toThreeMatrix4();
    const target = this.#getPositionOrientation({matrix: targetMat});
    const N = this.#geometryDefinition.length;

    // the parameters to optimize
    const angles = [...currentAngles];
    if (angles.length < N) {
      angles.push(0.0);
    }

    // the maximum step sizes for parameter adjustment. The step sizes will be adjusted automatically during optimization
    const steps = new Array(N).fill(10.);
    // the steps of over maximum step size, to avoid to reduce the step size quickly.
    const oversteps = new Array(N).fill(0);

    // initial error: the optimization objective function
    let err = this.#getAlignmentErrorSquared({angles, target});
    for (let i = 0; i < XcAtGeneralKinematics.MAX_IK_STEPS; i++) {
      // choose a random parameter to adjust
      let j = Math.floor(Math.random() * (N - 1));
      const oldAngle = angles[j];

      // Randomly adjust the parameter within the step size
      angles[j] += steps[j] * Math.random();
      angles[j] = this.#clampParameter({angle: angles[j], joint: this.#geometryDefinition[j]});

      // The new objective value for adjusted parameter
      let errNew = this.#getAlignmentErrorSquared({angles, target});
      if (errNew > err) {

        // The error is now larger: try to move to the opposite direction
        angles[j] = 2. * oldAngle - angles[j];
        angles[j] = this.#clampParameter({angle: angles[j], joint: this.#geometryDefinition[j]});

        // The new objective value
        errNew = this.#getAlignmentErrorSquared({angles, target});
        if (errNew > err) {
          if (oversteps[j] >= 1) {
            oversteps[j] = 0;
            //The error is larger in both directions: reduce the step size
            steps[j] *= ANNEALING_FACTOR;
          } else {
            oversteps[j] += 1;
          }

          angles[j] = oldAngle;
          continue;
        } else {
          // make the opposite direction the default
          steps[j] = - steps[j];
        }
      }

      // A better position is found
      err = errNew;

      // Convergence condition
      if (err < XcAtGeneralKinematics.COVERGENCE_LIMIT) {
        return angles;
      }
    }

    // Maximum number of steps without reaching the convergence condition
    return angles;
  }

  // Get translation and orientation from a Matrix4
  #getPositionOrientation({matrix}) {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(matrix);

    const xVector = new THREE.Vector3();
    const yVector = new THREE.Vector3();
    const zVector = new THREE.Vector3();
    mat4.extractBasis(xVector, yVector, zVector);

    return {position, xVector, yVector, zVector};
  }

  // Error function: squared distance from the target position to the current position by angles
  #getAlignmentErrorSquared({angles, target}) {
    const {finalMatrix} = this.forwardKinematics({angles});
    const matrix = finalMatrix.toThreeMatrix4();;
    const poses = this.#getPositionOrientation({matrix});

    // TODO: weights for position and orientation differences
    let error = 0.;
    for (const vector in target) {
      poses[vector].sub(target[vector]);
      error += poses[vector].lengthSq();
    }
    return error;
  }

  // clamp the parameters to its range
  #clampParameter({angle, joint}) {
    const clampedMin = Math.max(angle, joint.minValue);
    const clampedMinMax = Math.min(clampedMin, joint.maxValue);
    return clampedMinMax;
  }
}
