class XcGm3dVector {
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
    return new XcGm3dVector({x: 0.0, y: 0.0, z: 0.0});
  }

  static get xAxisDirection() {
    return new XcGm3dVector({x: 1.0, y: 0.0, z: 0.0});
  }

  static get yAxisDirection() {
    return new XcGm3dVector({x: 0.0, y: 1.0, z: 0.0});
  }

  static get zAxisDirection() {
    return new XcGm3dVector({x: 0.0, y: 0.0, z: 1.0});
  }

  static fromArray({array}) {
    return new XcGm3dVector({x: array[0], y: array[1], z: array[2]});
  }

  static fromJSON({json}) {
    return new XcGm3dVector({x: json.x, y: json.y, z: json.z});
  }

  static fromThreeVector3({threeVector3}) {
    const vec = new XcGm3dVector({x: threeVector3.x, y: threeVector3.y, z: threeVector3.z});
    return vec;
  }

  static add({vector1, vector2}) {
    return new XcGm3dVector({x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z});
  }

  static subtract({vector1, vector2}) {
    return new XcGm3dVector({x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z});
  }

  static multiply({vector, scale}) {
    return new XcGm3dVector({x: vector.x * scale, y: vector.y * scale, z: vector.z * scale});
  }

  static divide({vector, scale}) {
    return new XcGm3dVector({x: vector.x / scale, y: vector.y / scale, z: vector.z / scale});
  }

  toThreeVector3() {
    const threeVec = new THREE.Vector3(this.x, this.y, this.z);
    return threeVec;
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
    return new XcGm3dVector({x: this.x, y: this.y, z: this.z});
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
    return new XcGm3dVector({x: -this.x, y: -this.y, z: -this.z});
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
    const newVector = XcGm3dVector();
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
    const vecReturn = new XcGm3dVector();
    vecReturn.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2] * this.z;
    vecReturn.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2] * this.z;
    vecReturn.z = matrix.entry[2][0] * this.x + matrix.entry[2][1] * this.y + matrix.entry[2][2] * this.z;

    this.x = vecReturn.x;
    this.y = vecReturn.y;
    this.z = vecReturn.z;
  }

  rotateBy({angle, axis}) {
    // TODO
  }

  mirror({plane}) {
    // TODO
  }

  get perpendicularVector() {
    const newVector = new XcGm3dVector();
    if (Math.abs(this.x) < XcGm3dVector.#MIN_LENGTH && Math.abs(this.y) < XcGm3dVector.#MIN_LENGTH) {
      newVector.x = this.z;
      newVector.y = 0.0;
      newVector.z = -this.x;
    } else {
      newVector.x = -this.y;
      newVector.y = this.x;
      newVector.z = 0.0;
    }

    newVector.normalize();
    return newVector;
  }

  angleTo({vector}) {
    if (this.length < XcGmContext.gTol.linearPrecision) {
      return Math.PI;
    }

    if (vector.length < XcGmContext.gTol.linearPrecision) {
      return Math.PI;
    }

    // for vectors a,b: the length of the cross product is |a| |b| \sin \theta
    // the dotProduct is |a| |b| \cos \theta
    const crossLength = this.crossProduct({vector}).length;
    const dotValue = this.dotProduct({value});
    return Math.atan2(crossLength, dotValue);
  }

  rotationAngleTo({vector, axis}) {
    let angle = this.angleTo({vector});
    const tmpVec = this.crossProduct({vector});
    const dotProduct = tmpVec.dotProduct({vector: axis});
    if (dotProduct < 0) {
      angle = (Math.PI * 2) - angle;
    }
    return angle;
  }

  get normal() {
    const normalizedVector = new XcGm3dVector();
    normalizedVector.x = this.x;
    normalizedVector.y = this.y;
    normalizedVector.z = this.z;

    const vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (vecLength >= XcGmContext.gTol.anglePrecision) {
      normalizedVector.x /= vecLength;
      normalizedVector.y /= vecLength;
      normalizedVector.z /= vecLength;
    }

    return normalizedVector;
  }

  normalize() {
    const vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (vecLength >= XcGmContext.gTol.anglePrecision) {
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
    if (Math.abs(this.length - 1) < XcGmContext.gTol.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isZeroLength() {
    const threshold = XcGmContext.gTol.linearPrecision;

    if (this.lengthSquared() < threshold * threshold) {
      return true;
    } else {
      return false;
    }
  }

  isParallelTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;

    if ((len1 < XcGmContext.gTol.anglePrecision) || (len2 < XcGmContext.gTol.anglePrecision)) {
      return false;
    }

    if (Math.abs(Math.abs(this.dotProduct({vector})) / (len1 * len2) - 1) < XcGmContext.gTol.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isCodirectionalTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;
    if ((len1 < XcGmContext.gTol.anglePrecision) || (len2 < XcGmContext.gTol.anglePrecision)) {
      return false;
    }

    const dist = ((vector.x / len2 - this.x / len1) * (vector.x / len2 - this.x / len1)
      + (vector.y / len2 - this.y / len1) * (vector.y / len2 - this.y / len1)
      + (vector.z / len2 - this.z / len1) * (vector.z / len2 - this.z / len1));

    if (dist < XcGmContext.gTol.anglePrecision * XcGmContext.gTol.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isPerpendicularTo({vector}) {
    const len1 = this.length;
    const len2 = vector.length;

    if ((len1 < XcGmContext.gTol.anglePrecision) || (len2 < XcGmContext.gTol.anglePrecision)) {
      return false;
    }

    if (Math.abs((this.x * vector.x + this.y * vector.y + this.z * vector.z) / (len1 * len2)) > XcGmContext.gTol.anglePrecision) {
      return false;
    } else {
      return true;
    }
  }

  isEqualTo({vector}) {
    if ((Math.abs(this.x - vector.x) < XcGmContext.gTol.anglePrecision)
      && (Math.abs(this.y - vector.y) < XcGmContext.gTol.anglePrecision)
      && (Math.abs(this.z - vector.z) < XcGmContext.gTol.anglePrecision)) {
      return true;
    } else {
      return false;
    }
  }

  crossProduct({vector}) {
    const newVector = new XcGm3dVector();
    newVector.x = this.y * vector.z - this.z * vector.y;
    newVector.y = this.z * vector.x - this.x * vector.z;
    newVector.z = this.x * vector.y - this.y * vector.x;

    return newVector;
  }

  project({plane, projectDirection}) {

  }

  orthoProject({plane, projectDirection}) {

  }
}
