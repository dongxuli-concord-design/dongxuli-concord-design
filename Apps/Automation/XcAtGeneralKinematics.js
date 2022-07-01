class XcAtGeneralKinematics {
  #geometryDefinition;
  #jointCoordinateSystem;

  constructor(geometryDefinition, jointCoordinateSystem) {
    this.#geometryDefinition = geometryDefinition;
    this.#jointCoordinateSystem = jointCoordinateSystem;
  }

  forwardKinematics(angles)
  {
    const zeroPoint = new XcGm3dPosition({x: 0.0, y: 0.0, z: 0.0});
    const jointAngles = [...angles];

    // assuming all types are revolute
    let joints = this.#geometryDefinition;
    if (jointAngles.length < joints.length){
      jointAngles.push(0.0);
    }

    // overall transform from TCP to base coordinates
    const finalMatrix=new XcGm3dMatrix();
    const arrayMatrix = [];

    for (let index = 0; index < joints.length; ++index) {
      const joint = this.#geometryDefinition[index];
      const position = new XcGm3dPosition({x: joint.location[0], y: joint.location[1], z: joint.location[2]});
      const direction = new XcGm3dVector({x: joint.direction[0], y: joint.direction[1], z: joint.direction[2]});
      const axis = new XcGm3dAxis({position,direction});
      const translationMatrix = XcGm3dMatrix.translationMatrix({vector: position});
      const rotationMatrix = XcGm3dMatrix.rotationMatrix({angle: jointAngles[index]* Math.PI / 180., axis});
      //let jointMatrix = XcGm3dMatrix.multiply({matrix1: translationMatrix, matrix2: rotationMatrix});
      arrayMatrix.push(rotationMatrix);

      //let jointMatrix = new XcGm3dMatrix();
      if (index === 0) {
        const matrix0 = this.#jointCoordinateSystem[index].toMatrix();
        matrix0.multiply({matrix: rotationMatrix});
        finalMatrix.multiply({matrix: matrix0});
      }
      else {
        const matrix1 = this.#jointCoordinateSystem[index-1].toMatrix();
        const matrix2 = this.#jointCoordinateSystem[index].toMatrix();
        const inverseMatrix1= matrix1.inverse();
        let jointMatrix = XcGm3dMatrix.multiply({matrix1: inverseMatrix1, matrix2: rotationMatrix});
        jointMatrix.multiply({matrix: matrix2});
        finalMatrix.multiply({matrix: jointMatrix});
      }
    }
    return [finalMatrix, arrayMatrix];
  }

  // Prototype: Monte-Carlo annealing
  // Input:       targetMat - the target TCP position/orientation in the global frame
  // Input:       definition - the definiton of the robot, need to be consistent with forwardKinematics()
  // Input:       currentAngles - the current motor angles
  // Returns:     optimized robot parameters to reach the target TCP
  IK(targetMatrix, currentAngles) {
    let targetMat = targetMatrix.toThreeMatrix4();
    let target = this.#getPositionOrientation(targetMat);
    let N = this.#geometryDefinition.length;

    // the parameters to optimize
    let angles = [...currentAngles];
    if (angles.length < N){
      angles.push(0.0);
    }

    // the maximum step sizes for parameter adjustment. The step sizes will be adjusted automatically during optimization
    let steps = new Array(N).fill(1.);

    // initial error: the optimization objective function
    let err = this.#ds2(angles, target);
    for (let i = 0; i < 40000; i++) {
      //debugger;
      // choose a random parameter to adjust
      let j = Math.floor(Math.random() * (N-1));
      let oldAngle = angles[j];

      // Randomly adjust the parameter within the step size
      angles[j] += steps[j] * Math.random();
      angles[j] = this.#clamp(angles[j], this.#geometryDefinition[j]);

      // The new objective value for adjusted parameter
      let errNew = this.#ds2(angles, target);
      if (errNew > err) {

        // The error is now larger: try to move to the opposite direction
        angles[j] = 2. * oldAngle - angles[j];
        angles[j] = this.#clamp(angles[j], this.#geometryDefinition[j]);

        // The new objective value
        errNew = this.#ds2(angles, target);
        if (errNew > err) {
          // The error is larger in both directions: reduce the step size
          steps[j] *= 0.9;
          angles[j] = oldAngle;
          continue;
        }
        else{
          // make the opposite direction the default
          steps[j] = - steps[j];
        }
      }

      // A better position is found
      err = errNew;

      // Convergence condition
      if (err < 1e-10) {
        return angles;
      }
    }

    // Maximum number of steps without reaching the convergence condition
    return angles;
  }

  // Get translation and orientation from a Matrix4
  #getPositionOrientation(mat4) {
    let ret = [];
    let pos = new THREE.Vector3();
    pos.setFromMatrixPosition(mat4);

    let xAxis = new THREE.Vector3();
    let yAxis = new THREE.Vector3();
    let zAxis = new THREE.Vector3();
    mat4.extractBasis(xAxis, yAxis, zAxis);

    return [pos, xAxis, yAxis, zAxis];
  }

// Error function: squared distance from the target position to the current position by angles
  #ds2(angles, target) {
    const [finalMatrix, arrayMatrix] = this.forwardKinematics(angles);
    let mat = finalMatrix.toThreeMatrix4();;
    let poses = this.#getPositionOrientation(mat);

    // TODO: weights for position and orientation differences
    let error = 0.;
    for (let i = 0; i < poses.length; i++) {
      poses[i].sub(target[i]);
      error += poses[i].lengthSq();
    }
    return error;
  }

// clamp the parameters to its range
  #clamp(angle, joint) {
    angle = Math.max(angle, joint.minValue);
    angle = Math.min(angle, joint.maxValue);
    return angle;
  }
}

