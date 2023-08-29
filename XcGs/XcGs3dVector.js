class XcGs3dVector {
  x;
  y;
  z;

  static #MIN_LENGTH = 1 / 64;

  constructor({x = 0.0, y = 0.0, z = 0.0} = {}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get identity() {
    return new XcGs3dVector({x: 0.0, y: 0.0, z: 0.0});
  }

  static get xAxisDirection() {
    return new XcGs3dVector({x: 1.0, y: 0.0, z: 0.0});
  }

  static get yAxisDirection() {
    return new XcGs3dVector({x: 0.0, y: 1.0, z: 0.0});
  }

  static get zAxisDirection() {
    return new XcGs3dVector({x: 0.0, y: 0.0, z: 1.0});
  }

  static fromArray({array}) {
    return new XcGs3dVector({x: array[0], y: array[1], z: array[2]});
  }
  
  static fromJSON({json}) {
    return new XcGs3dVector({x: json.x, y: json.y, z: json.z});
  }

  static add({vector1, vector2}) {
    return new XcGs3dVector({x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z});
  }

  static subtract({vector1, vector2}) {
    return new XcGs3dVector({x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z});
  }

  static multiply({vector, scale}) {
    return new XcGs3dVector({x: vector.x * scale, y: vector.y * scale, z: vector.z * scale});
  }

  static divide({vector, scale}) {
    return new XcGs3dVector({x: vector.x / scale, y: vector.y / scale, z: vector.z / scale});
  }

  toString() {
    return `${this.x.toPrecision(2)}, ${this.y.toPrecision(2)}, ${this.z.toPrecision(2)}`;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  clone() {
    return new XcGs3dVector({x: this.x, y: this.y, z: this.z});
  }

  copy({vector}) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  subtract({vector}) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
  }

  multiply({scale}) {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
  }

  divide({scale}) {
    this.x /= scale;
    this.y /= scale;
    this.z /= scale;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  negation() {
    return new XcGs3dVector({x: -this.x, y: -this.y, z: -this.z});
  }

  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  dotProduct({vector}) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  set({x, y, z}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setToProduct({matrix, vector}) {
    const newVector = XcGs3dVector();
    for (let i = 0; i < 3; i += 1) {
      newVector.x += matrix.entry[0][i] * vector[i];
      newVector.y += matrix.entry[1][i] * vector[i];
      newVector.z += matrix.entry[2][i] * vector[i];
    }

    newVector.x += matrix.entry[0][3];
    newVector.y += matrix.entry[1][3];
    newVector.z += matrix.entry[2][3];

    this.x = newVector.x;
    this.y = newVector.y;
    this.z = newVector.z;
  }

  transform({matrix}) {
    const vecReturn = new XcGs3dVector();
    vecReturn.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2] * this.z;
    vecReturn.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2] * this.z;
    vecReturn.z = matrix.entry[2][0] * this.x + matrix.entry[2][1] * this.y + matrix.entry[2][2] * this.z;

    this.x = vecReturn.x;
    this.y = vecReturn.y;
    this.z = vecReturn.z;
  }

  rotateBy({angle, axis}) {
    let quaterion = XcGsQuaternion.fromAxisAngle({angle, axisVector: axis.direction});
    this.transform({matrix: quaterion.matrix});
  }

  /**
   * @description find a perpendicular vector of the current vector. If the current vector is the zero vector, the zero vector is returned.
   * The current vector is not changed.
   * @returns {XcGs3dVector} a unit perpendicular vector, if the current vector is not the zero vector. Otherwise, the zero vector is returned
   */
  get perpendicularVector() {

    // Find a perpendicular vector from the null space of QR decomposition
    // Treating the current vector as a matrix of a single column.
    // After QR decomposition, the 3rd column of the Q matrix is in the null space

    // Find Householder reflection of the column vector

    // Choose a sign to avoid rounding errors due to catastrophic cancellation
    const sign = this.x > 0 ? 1 : -1;

    // The normal direction of the mirror
    const v = new XcGs3dVector({x: this.x + sign * this.length, y: this.y, z: this.z});

    // The 3rd column of the Q-matrix. The vector is not unitized, with an extra factor of -tau = - |v|^2/2
    const nullVector = new XcGs3dVector({x: v.x * v.z, y: v.y * v.z, z: v.z * v.z - v.lengthSquared() / 2});

    return nullVector.normal;
  }

  angleTo({vector}) {
    if ((this.length < XcGsContext.gTol.linearPrecision) || (vector.length < XcGsContext.gTol.linearPrecision)) {
      return Math.PI;
    } else {
      // for vectors a,b: the length of the cross product is |a| |b| \sin \theta
      // the dotProduct is |a| |b| \cos \theta
      const crossLength = this.crossProduct({vector}).length;
      const dotValue = this.dotProduct({vector});
      return Math.atan2(crossLength, dotValue);
    }
  }

  rotationAngleTo({vector, axis}) {
    const angle = this.angleTo({vector});
    const tmpVec = this.crossProduct({vector});
    const dotProduct = tmpVec.dotProduct({vector: axis});
    if (dotProduct < 0) {
      return (Math.PI * 2) - angle;
    } else {
      return angle;
    }
  }

  get normal() {
    const normalizedVector = new XcGs3dVector();
    normalizedVector.x = this.x;
    normalizedVector.y = this.y;
    normalizedVector.z = this.z;

    const vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (vecLength >= XcGsContext.gTol.anglePrecision) {
      normalizedVector.x /= vecLength;
      normalizedVector.y /= vecLength;
      normalizedVector.z /= vecLength;

      return normalizedVector;
    } else {
      return normalizedVector;
    }
  }

  normalize() {
    const vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (vecLength >= XcGsContext.gTol.anglePrecision) {
      this.x /= vecLength;
      this.y /= vecLength;
      this.z /= vecLength;
    }
  }

  get length() {
    const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return len;
  }

  isUnitLength() {
    return Math.abs(this.length - 1) < XcGsContext.gTol.anglePrecision
  }

  isZeroLength() {
    const threshold = XcGsContext.gTol.linearPrecision;
    return this.lengthSquared() < threshold * threshold;
  }

  isParallelTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;

    if ((len1 < XcGsContext.gTol.anglePrecision) || (len2 < XcGsContext.gTol.anglePrecision)) {
      return false;
    } else {
      return Math.abs(Math.abs(this.dotProduct({vector})) / (len1 * len2) - 1) < XcGsContext.gTol.anglePrecision;
    }
  }

  isCodirectionalTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;
    if ((len1 < XcGsContext.gTol.anglePrecision) || (len2 < XcGsContext.gTol.anglePrecision)) {
      return false;
    } else {
      const dist = ((vector.x / len2 - this.x / len1) * (vector.x / len2 - this.x / len1)
        + (vector.y / len2 - this.y / len1) * (vector.y / len2 - this.y / len1)
        + (vector.z / len2 - this.z / len1) * (vector.z / len2 - this.z / len1));

      return dist < XcGsContext.gTol.anglePrecision * XcGsContext.gTol.anglePrecision;
    }
  }

  isPerpendicularTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;

    if ((len1 < XcGsContext.gTol.anglePrecision) || (len2 < XcGsContext.gTol.anglePrecision)) {
      return false;
    } else {
      return Math.abs((this.x * vector.x + this.y * vector.y + this.z * vector.z) / (len1 * len2)) > XcGsContext.gTol.anglePrecision;
    }
  }

  isEqualTo({vector}) {
    return (Math.abs(this.x - vector.x) < XcGsContext.gTol.anglePrecision)
      && (Math.abs(this.y - vector.y) < XcGsContext.gTol.anglePrecision)
      && (Math.abs(this.z - vector.z) < XcGsContext.gTol.anglePrecision);
  }

  crossProduct({vector}) {
    const newVector = new XcGs3dVector();
    newVector.x = this.y * vector.z - this.z * vector.y;
    newVector.y = this.z * vector.x - this.x * vector.z;
    newVector.z = this.x * vector.y - this.y * vector.x;

    return newVector;
  }
}
