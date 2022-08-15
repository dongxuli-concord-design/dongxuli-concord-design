class XcGm3DVector {
  x;
  y;
  z;
  #MIN_LENGTH = 1 / 64;

  constructor({x = 0.0, y = 0.0, z = 0.0} = {}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get identity() {
    return new XcGm3DVector({x: 0.0, y: 0.0, z: 0.0});
  }

  static get xAxis() {
    return new XcGm3DVector({x: 1.0, y: 0.0, z: 0.0});
  }

  static get yAxis() {
    return new XcGm3DVector({x: 0.0, y: 1.0, z: 0.0});
  }

  static get zAxis() {
    return new XcGm3DVector({x: 0.0, y: 0.0, z: 1.0});
  }

  static fromArray({array}) {
    return new XcGm3DVector({x: array[0], y: array[1], z: array[2]});
  }

  static fromJSON({json}) {
    return new XcGm3DVector({x: json.x, y: json.y, z: json.z});
  }

  static fromThreeVector3({threeVector3}) {
    let vec = new XcGm3DVector({x: threeVector3.x, y: threeVector3.y, z: threeVector3.z});
    return vec;
  }

  toThreeVector3() {
    let threeVec = new THREE.Vector3(this.x, this.y, this.z);
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
    return new XcGm3DVector({x: this.x, y: this.y, z: this.z});
  }

  assignFrom({vector}) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  subtract({vector}) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  multiply({scale}) {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
    return this;
  }

  divide({scale}) {
    this.x /= scale;
    this.y /= scale;
    this.z /= scale;
    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  static addition({vector1, vector2}) {
    return new XcGm3DVector({x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z});
  }

  static subtraction({vector1, vector2}) {
    return new XcGm3DVector({x: vector1.x - vector2.x, y: vector1.y - vector2.y, z: vector1.z - vector2.z});
  }

  static multiplication({vector, scale}) {
    return new XcGm3DVector({x: vector.x * scale, y: vector.y * scale, z: vector.z * scale});
  }

  static division({vector, scale}) {
    return new XcGm3DVector({x: vector.x / scale, y: vector.y / scale, z: vector.z / scale});
  }

  negation() {
    return new XcGm3DVector({x: -this.x, y: -this.y, z: -this.z});
  }

  lengthSqrd() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  dotProduct({vector}) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  set({x, y, z}) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setToProduct({matrix, vector}) {
    let newVector = XcGm3DVector();
    for (let i = 0; i < 3; i++) {
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

    return this;
  }

  transformBy({matrix}) {
    let vecReturn = new XcGm3DVector();
    vecReturn.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2] * this.z;
    vecReturn.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2] * this.z;
    vecReturn.z = matrix.entry[2][0] * this.x + matrix.entry[2][1] * this.y + matrix.entry[2][2] * this.z;

    this.x = vecReturn.x;
    this.y = vecReturn.y;
    this.z = vecReturn.z;

    return this;
  }

  rotateBy({angle, axis}) {
    // TODO
  }

  mirror({plane}) {
    // TODO
  }

  perpVector() {
    let newVector = new XcGm3DVector();
    if (Math.abs(this.x) < XcGm3DVector.#MIN_LENGTH && Math.abs(this.y) < XcGm3DVector.#MIN_LENGTH) {
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
    let angle = this.dotProduct({vector}) / (this.length() * vector.length());
    return Math.acos(THREE.Math.clamp(angle, -1, 1));
  }

  rotationAngleTo({vector, axis}) {
    // TODO
    let angle = this.angleTo({vector});
    let tmpVec = this.crossProduct({vector});
    let dtProduct = tmpVec.dotProduct({vector: axis});
    if (dtProduct < 0) {
      angle = (Math.PI * 2) - angle;
    }
    return angle;
  }

  normal({tolerance = XcGmContext.gTol} = {}) {
    let vecLength;
    let normalizedVector = new XcGm3DVector();
    normalizedVector.x = this.x;
    normalizedVector.y = this.y;
    normalizedVector.z = this.z;

    vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (vecLength >= tolerance.anglePrecision) {
      normalizedVector.x /= vecLength;
      normalizedVector.y /= vecLength;
      normalizedVector.z /= vecLength;
    }

    return normalizedVector;
  }

  normalize({tolerance = XcGmContext.gTol} = {}) {
    let vecLength = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (vecLength >= tolerance.anglePrecision) {
      this.x /= vecLength;
      this.y /= vecLength;
      this.z /= vecLength;
    }

    return this;
  }

  length() {
    let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return len;
  }

  isUnitLength({tolerance = XcGmContext.gTol} = {}) {
    if (Math.abs(this.length() - 1) < tolerance.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isZeroLength({tolerance = XcGmContext.gTol} = {}) {
    let threshold = tolerance.linearPrecision;

    if (this.lengthSqrd() < threshold * threshold) {
      return true;
    } else {
      return false;
    }
  }

  isParallelTo({vector, tolerance = XcGmContext.gTol}) {
    let len1 = this.length();
    let len2 = vector.length();

    if ((len1 < tolerance.anglePrecision) || (len2 < tolerance.anglePrecision)) {
      return false;
    }

    if (Math.abs(Math.abs(this.dotProduct({vector})) / (len1 * len2) - 1) < tolerance.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isCodirectionalTo({vector, tolerance = XcGmContext.gTol}) {
    let len1 = this.length();
    let len2 = vector.length();
    if ((len1 < tolerance.anglePrecision) || (len2 < tolerance.anglePrecision)) {
      return false;
    }

    let dist = ((vector.x / len2 - this.x / len1) * (vector.x / len2 - this.x / len1)
      + (vector.y / len2 - this.y / len1) * (vector.y / len2 - this.y / len1)
      + (vector.z / len2 - this.z / len1) * (vector.z / len2 - this.z / len1));

    if (dist < tolerance.anglePrecision * tolerance.anglePrecision) {
      return true;
    } else {
      return false;
    }
  }

  isPerpendicularTo({vector, tolerance = XcGmContext.gTol}) {
    let len1 = this.length();
    let len2 = vector.length();

    if ((len1 < tolerance.anglePrecision) || (len2 < tolerance.anglePrecision)) {
      return false;
    }

    if (Math.abs((this.x * vector.x + this.y * vector.y + this.z * vector.z) / (len1 * len2)) > tolerance.anglePrecision) {
      return false;
    } else {
      return true;
    }
  }

  isEqualTo({vector, tolerance = XcGmContext.gTol}) {
    if ((Math.abs(this.x - vector.x) < tolerance.anglePrecision)
      && (Math.abs(this.y - vector.y) < tolerance.anglePrecision)
      && (Math.abs(this.z - vector.z) < tolerance.anglePrecision)) {
      return true;
    } else {
      return false;
    }
  }

  crossProduct({vector}) {
    let newVector = new XcGm3DVector();
    newVector.x = this.y * vector.z - this.z * vector.y;
    newVector.y = this.z * vector.x - this.x * vector.z;
    newVector.z = this.x * vector.y - this.y * vector.x;

    return newVector;
  }

  project({plane, projectDirection, tolerance = XcGmContext.gTol}) {

  }

  orthoProject({plane, projectDirection, tolerance = XcGmContext.gTol}) {

  }
}
