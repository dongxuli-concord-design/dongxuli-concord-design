class XcGmQuaternion {
  //TODO

  w;
  x;
  y;
  z;

  /**
   * Construct a quaternion.
   *
   * @param {*} the components of the quaternion to construct. The default is the unit.
   */
  constructor({w = 1, x = 0, y = 0, z = 0} = {}) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Internal usage for stable calculation of quaternion components from a pure rotation matrix
  static #sarabandi({matrixEntry, index}) {
    const sarabandiArray = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
    ];
    const sign = sarabandiArray[index];
    const trace = sign[0] * matrixEntry[0][0] + sign[1] * matrixEntry[1][1] + sign[2] * matrixEntry[2][2];
    if (trace > 0)
      return 0.5 * Math.sqrt(1 + trace);

    const skew = new XcGm3dVector({
      x: matrixEntry[1][2] - sign[0] * matrixEntry[2][1],
      y: matrixEntry[0][2] - sign[1] * matrixEntry[2][0],
      z: matrixEntry[0][1] - sign[2] * matrixEntry[1][0],
    });
    return 0.5 * Math.sqrt(skew.lengthSquared() / (3 - trace))
  }

  /**
   * Convert a rotation matrix to a unit quaternion
   * Assuming the input matrix is a pure rotation matrix:
   * any perspective factor or translation vector is ignored
   *
   * @param {matrix} a rotation matrix
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

  /**
   * The inverse quaternion for a unit quaternion
   */
  get conjugate() {
    return new XcGmQuaternion({w: this.w, x: -this.x, y: -this.y, z: -this.z});
  }

  /**
   * Hamliton product. The multiplication order puts the current quaternion on the left
   *
   * @param {qRight} the quaternion on the right
   */
  multiply({qRight}) {
    return {
      w: this.w * qRight.w - this.x * qRight.x - this.y * qRight.y - this.z * qRight.z,
      x: this.w * qRight.x + this.x * qRight.w + this.y * qRight.z - this.z * qRight.y,
      y: this.w * qRight.y + this.y * qRight.w + this.z * qRight.x - this.x * qRight.z,
      z: this.w * qRight.z + this.z * qRight.w + this.x * qRight.y - this.y * qRight.x
    };
  }

  /**
   * Normalize the current quaternion. If the normal is zero within tolerance, no-op.
   */
  normalize() {
    const normal = Math.sqrt(this.lengthSquared);
    if (normal <= new XcGmPrecision().linearPrecision)
      return;

    this.w /= normal;
    this.x /= normal;
    this.y /= normal;
    this.z /= normal;
  }

  /**
   * A normalized quaternion from the current. The current is not changed
   */
  get normal() {
    const unitQ = {...this};
    unitQ.normalize();
    return unitQ;
  }

  /**
   * The Squared length
   */
  get lengthSquared() {
    return this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * The power function, assuming unit quaternions
   * @param {exponent} the exponent
   */
  pow({exponent}) {
    // assuming to be unit, lengthSquared=1.
    const n = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    // TODO: handle floating point tolerance
    if (n < XcGmContext.gTol.linearPrecision)
      return {...this};

    const oldAngle = Math.atan2(n, this.w);
    const newAngle = exponent * oldAngle;
    const axisFactor = Math.sin(newAngle) / n;
    return new XcGmQuaternion({w: Math.cos(newAngle), x: this.x * axisFactor, y: this.y * axisFactor, z: this.z * axisFactor});
  }

  /**
   * linear interpolation of two rotation quaterions:
   * q0 to q1, with parameter t: q0 * (q0' * q1)^t, q0' being the conjugate: q0' = 1/q0 for unit quaternions;
   * t=0, the result is q0;
   * t=1, the result is q1;
   * otherwise, the result is a linear interpolation
   * @param {target} the target unit quaternion for linear interpolation from the current
   * @param {exponent} the interpolation parameter. If the parameter is 0, the interpolation result is the current quaterion.
   * If the parameter is 1, the result is the target quaternion
   */
  lerpTo({target, exponent}) {
    const qn = this.conjugate;
    const factor = qn.multiply({qRight: target});
    const power = factor.pow({exponent});
    return this.multiply({qRight: power}).normal;
  }

  /**
   * Conversion from the current quaternion to its corresponding rotation matrix
   */
  get matrix() {
    // the quaternion could be non-unit due to rounding errors
    const s = 2. / this.lengthSquared();
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
}
