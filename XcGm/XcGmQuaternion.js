/**
 * The rotation quaternion class
 */
class XcGmQuaternion {
  //TODO

  w;
  x;
  y;
  z;

  /**
   * @description Construct a quaternion.
   *
   * @param {*} {w,x,y,z} components of the quaternion to construct. The default is the unit.
   */
  constructor({w = 1, x = 0, y = 0, z = 0} = {}) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * @description The current XcGm3dVector is considered row vectors.
   * The XcGm3dMatrix by column-major: matrixEntry[0] is the first column, etc.
   * This function returns the rotation axis direction according to this convention.
   * @param {*} {param0, index}: the rotation matrix data and index.
   * The index indicates the current quaternion component. 0, 1, 2, 3 means w, x, y z, respectively.
   * @returns {number} the skew values to indicate the sign of quaternion components
   */
  static #sarabandiSkew({matrixEntry, index}) {
    if (index === 1) {
      return matrixEntry[2][1] - matrixEntry[1][2];
    } else if (index === 2) {
      return matrixEntry[0][2] - matrixEntry[2][0];
    } else if (index === 3) {
      return matrixEntry[1][0] - matrixEntry[0][1];
    } else {
      XcGmAssert({assertion: false, message: 'Invalid index'});
    }
  }

  static #sarabandiSign({matrixEntry, index}) {
    if (index === 0) {
      return 1;
    } else {
      return Math.sign(this.#sarabandiSkew({matrixEntry, index}));
    }
  }

  /**
   * @description Sarabandi's algorithm to find the square of each quaternion component
   * @param {*} {param0, index}: the rotation matrix data and index.
   * @returns {number} the square of components
   */
  static #sarabandiQ2({matrixEntry, index}) {
    const sarabandiArray = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
    ];
    const sign = sarabandiArray[index];
    const trace = sign[0] * matrixEntry[0][0] + sign[1] * matrixEntry[1][1] + sign[2] * matrixEntry[2][2];

    if (trace > 0) {
      return (1 + trace) / 4;
    } else {
      const skew = new XcGm3dVector({
        x: matrixEntry[1][2] - sign[0] * matrixEntry[2][1],
        y: matrixEntry[0][2] - sign[1] * matrixEntry[2][0],
        z: matrixEntry[0][1] - sign[2] * matrixEntry[1][0],
      });
      return skew.lengthSquared() / (4 * (3 - trace));
    }
  }

  // Internal usage for stable calculation of quaternion components from a pure rotation matrix
  static #sarabandi({matrixEntry, index}) {
    // The sign of components
    const qSign = this.#sarabandiSign({matrixEntry, index});

    return qSign * Math.sqrt(this.#sarabandiQ2({matrixEntry, index}));
  }

  /**
   * @description Convert a rotation matrix to a unit quaternion
   * Assuming the input matrix is a pure rotation matrix:
   * any perspective factor or translation vector is ignored
   *
   * @param {matrix} matrix a rotation matrix, assumed to be a pure rotation matrix.
   * @returns {XcGmQuaternion} the rotation quaternion from a rotation matrix
   */
  static fromRotationMatrix({matrix}) {
    const matrixEntry = matrix.entry;
    // Sarabandi algorithm
    const w = this.#sarabandi({matrixEntry, index: 0});
    const x = this.#sarabandi({matrixEntry, index: 1});
    const y = this.#sarabandi({matrixEntry, index: 2});
    const z = this.#sarabandi({matrixEntry, index: 3});
    return new XcGmQuaternion({w, x, y, z});
  }

  clone() {
    //TODO
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  copy({quaternion}) {
    //TODO
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  /**
   * @description The inverse quaternion for a unit quaternion
   * @returns the conjugate of the current quaternion
   */
  get conjugate() {
    return new XcGmQuaternion({w: this.w, x: -this.x, y: -this.y, z: -this.z});
  }

  /**
   * @description Hamliton product. The multiplication order puts the current quaternion on the left
   *
   * @param {qRight} qRight the quaternion on the right
   * @returns {XcGmQuaternion} the Hamilton product
   */
  multiply({qRight}) {
    return new XcGmQuaternion({
      w: this.w * qRight.w - this.x * qRight.x - this.y * qRight.y - this.z * qRight.z,
      x: this.w * qRight.x + this.x * qRight.w + this.y * qRight.z - this.z * qRight.y,
      y: this.w * qRight.y + this.y * qRight.w + this.z * qRight.x - this.x * qRight.z,
      z: this.w * qRight.z + this.z * qRight.w + this.x * qRight.y - this.y * qRight.x
    });
  }

  /**
   * @description Normalize the current quaternion. If the normal is zero within tolerance, no-op.
   * @returns {XcGmQuaternion} the current quaternion after being normalized
   */
  normalize() {
    const normal = Math.sqrt(this.lengthSquared);
    if (normal < new XcGmPrecision().linearPrecision) {
      return this;
    } else {
      this.w /= normal;
      this.x /= normal;
      this.y /= normal;
      this.z /= normal;

      return this;
    }
  }

  /**
   * @description A normalized quaternion from the current. The current is not changed
   * @returns {XcGmQuaternion} the normalized quaternion of the current quaternion
   */
  get normal() {
    const unitQ = new XcGmQuaternion({w: this.w, x: this.x, y: this.y, z: this.z});
    unitQ.normalize();
    return unitQ;
  }

  /**
   * @description The Squared length
   * @returns {number} the squared length
   */
  get lengthSquared() {
    return this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * @description The power function, assuming unit quaternions
   * @param exponent the exponent
   * @returns {XcGmQuaternion} quaternion power
   */
  pow({exponent}) {
    // assuming to be unit, lengthSquared=1.
    const n = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    // TODO: handle floating point tolerance
    if (n < XcGmContext.gTol.linearPrecision) {
      return new XcGmQuaternion({w: this.w, x: this.x, y: this.y, z: this.z});
    } else {
      const oldAngle = Math.atan2(n, this.w);
      const newAngle = exponent * oldAngle;
      const axisFactor = Math.sin(newAngle) / n;
      return new XcGmQuaternion({w: Math.cos(newAngle), x: this.x * axisFactor, y: this.y * axisFactor, z: this.z * axisFactor});
    }
  }

  /**
   * @description linear interpolation of two rotation quaterions:
   * q0 to q1, with parameter t: q0 * (q0' * q1)^t, q0' being the conjugate: q0' = 1/q0 for unit quaternions;
   * t=0, the result is q0;
   * t=1, the result is q1;
   * otherwise, the result is a linear interpolation
   * @param target the target unit quaternion for linear interpolation from the current
   * @param exponent the interpolation parameter. If the parameter is 0, the interpolation result is the current quaterion.
   * If the parameter is 1, the result is the target quaternion
   */
  lerpTo({target, exponent}) {
    const qn = this.conjugate;
    const factor = qn.multiply({qRight: target});
    const power = factor.pow({exponent});
    return this.multiply({qRight: power}).normal;
  }

  /**
   * @description Conversion from the current quaternion to its corresponding rotation matrix
   * @returns {XcGm3dMatrix} a rotation matrix
   */
  get matrix() {
    // the quaternion could be non-unit due to rounding errors
    const s = 2 / this.lengthSquared;
    const bs = this.x * s;
    const cs = this.y * s;
    const ds = this.z * s;

    const ab = this.w * bs;
    const ac = this.w * cs;
    const ad = this.w * ds;

    const bb = this.x * bs;
    const bc = this.x * cs;
    const bd = this.x * ds;

    const cc = this.y * cs;
    const cd = this.y * ds;

    const dd = this.z * ds;

    const array = [1 - cc - dd, bc - ad, bd + ac, 0, bc + ad, 1 - bb - dd, cd - ab, 0, bd - ac, cd + ab, 1 - bb - cc, 0, 0, 0, 0, 1];
    return XcGm3dMatrix.fromArray({array});
  }

  static fromAxisAngle({axisVector, angle}) {
    const v = {...axisVector};
    v.normalize();
    v.multiply({scale: Math.sin(angle/2)});
    return new XcGmQuaternion({w: Math.cos(angle/2), x: v.x, y: v.y, z: v.z});
  }

  /**
   * @description find the rotation to rotate a vector to another. If the two vectors are exactly on opposite directions or one vector is zero, the rotation axis
   * is up to implementation. The rotation is well defined in all other cases.
   * @param fromVector the vector to rotate from
   * @param toVector the vector to rotate to
   * @returns {XcGmQuaternion} a rotation to rotate the fromVector to the toVector.
   */
  static fromTwoVectors({fromVector, toVector}) {
    let rotation = new XcGmQuaternion();

    const vector0 = fromVector.normal;
    const vector1 = toVector.normal;

    // zero rotation, if one input vector is zero
    if (vector0.isZeroLength() || vector1.isZeroLength()) {
      return rotation;
    } else {
      let innerProduct = vector0.dotProduct({vector: vector1});

      if (innerProduct < (-1 + XcGmContext.gTol.linearPrecision)) {
        // if the two input vectors are approximately opposite of each other, find the rotation axis as
        // a common perpendicular direction.

        // Protection against rounding errors
        innerProduct = Math.max(innerProduct, -1);

        const axis = XcGm3dVector.sharedPerpendicularVector({vector0, vector1});

        // \cos^2(\theta/2)
        const w2 = (1 + innerProduct) / 2;
        rotation.w = Math.sqrt(w2);
        // s= \sin(\theta/2)

        const s = Math.sqrt(1 - w2);
        rotation.x = axis.x * s;
        rotation.y = axis.y * s;
        rotation.z = axis.z * s;

        // normalize to protect from rounding errors
        return rotation.normal;
      } else {
        // otherwise, find the rotation axis by cross product.
        // cross= \sin(\theta) \vec{A}, with \vec{A} the unit vector of the rotation axis
        const cross = vector0.crossProduct({vector: vector1});

        // s= 2 \cos(\theta/2)
        const s = Math.sqrt(2 * (1 + innerProduct));
        rotation.w = s / 2;

        // \sin(\theta)/(2\cos(\theta/2)) = \sin(\theta/2)
        rotation.x = cross.x / s;
        rotation.y = cross.y / s;
        rotation.z = cross.z / s;

        // normalize to protect from rounding errors
        return rotation.normal;
      }
    }
  }
}
