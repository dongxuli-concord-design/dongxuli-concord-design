class XcGm2dVector {
  x;
  y;

  static #MIN_LENGTH = 1 / 64;

  constructor({x = 0.0, y = 0.0} = {}) {
    this.x = x;
    this.y = y;
  }

  static get identity() {
    return new XcGm2dVector({x: 0.0, y: 0.0});
  }

  static get xAxisDirection() {
    return new XcGm2dVector({x: 1.0, y: 0.0});
  }

  static get yAxisDirection() {
    return new XcGm2dVector({x: 0.0, y: 1.0});
  }

  static get zAxisDirection() {
    return new XcGm2dVector({x: 0.0, y: 0.0});
  }

  static fromArray({array}) {
    return new XcGm2dVector({x: array[0], y: array[1]});
  }

  static fromJSON({json}) {
    return new XcGm2dVector({x: json.x, y: json.y});
  }

  static fromThreeVector2({threeVector2}) {
    const vec = new XcGm2dVector({x: threeVector2.x, y: threeVector2.y});
    return vec;
  }

  static add({vector1, vector2}) {
    return new XcGm2dVector({x: vector1.x + vector2.x, y: vector1.y + vector2.y});
  }

  static subtract({vector1, vector2}) {
    return new XcGm2dVector({x: vector1.x - vector2.x, y: vector1.y - vector2.y});
  }

  static multiply({vector, scale}) {
    return new XcGm2dVector({x: vector.x * scale, y: vector.y * scale});
  }

  static divide({vector, scale}) {
    return new XcGm2dVector({x: vector.x / scale, y: vector.y / scale});
  }

  toThreeVector2() {
    const threeVec = new THREE.Vector2(this.x, this.y);
    return threeVec;
  }

  toString() {
    return `${this.x.toPrecision(2)}, ${this.y.toPrecision(2)}}`;
  }

  toArray() {
    return [this.x, this.y];
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  clone() {
    return new XcGm2dVector({x: this.x, y: this.y});
  }

  copy({vector}) {
    this.x = vector.x;
    this.y = vector.y;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract({vector}) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply({scale}) {
    this.x *= scale;
    this.y *= scale;
  }

  divide({scale}) {
    this.x /= scale;
    this.y /= scale;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
  }

  negation() {
    return new XcGm2dVector({x: -this.x, y: -this.y});
  }

  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  dotProduct({vector}) {
    return this.x * vector.x + this.y * vector.y;
  }

  set({x, y, z}) {
    this.x = x;
    this.y = y;
  }

  setToProduct({matrix, vector}) {
    const newVector = XcGm2dVector();
    for (let i = 0; i < 2; i += 1) {
      newVector.x += matrix.entry[0][i] * vector[i];
      newVector.y += matrix.entry[1][i] * vector[i];
    }

    newVector.x += matrix.entry[0][3];
    newVector.y += matrix.entry[1][3];

    this.x = newVector.x;
    this.y = newVector.y;
  }

  transform({matrix}) {
    const vecReturn = new XcGm2dVector();
    vecReturn.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y;
    vecReturn.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y;

    this.x = vecReturn.x;
    this.y = vecReturn.y;
  }

  rotate({angle}) {
    const matrix = XcGm2dMatrix.rotationMatrix({angle});
    this.transform({matrix});
  }

  mirror({plane}) {
    // TODO
  }

  get perpendicularVector() {
    new XcGm2dVector({x: -this.y, y: this.x});
  }

  angleTo({vector}) {
    if ((this.length < XcGmContext.gTol.linearPrecision) || (vector.length < XcGmContext.gTol.linearPrecision)) {
      return Math.PI;
    } else {
      const dot = this.dotProduct({vector});
      const cross = this.x * vector.y - this.y * vector.x;
      return Math.atan2(cross, dot);
    }
  }

  rotationAngleTo({vector, axis}) {
    const angle = this.angleTo({vector});
    const tmpVec = this.crossProduct({vector});
    const dotProduct = tmpVec.dotProduct({vector: axis});
    return  (dotProduct >= 0) ? angle : 2 * Math.PI - angle;
  }

  get normal() {
    const normalizedVector = new XcGm2dVector();
    normalizedVector.x = this.x;
    normalizedVector.y = this.y;

    const vecLength = this.length;
    if (vecLength >= XcGmContext.gTol.anglePrecision) {
      normalizedVector.x /= vecLength;
      normalizedVector.y /= vecLength;

      return normalizedVector;
    } else {
      return normalizedVector;
    }
  }

  normalize() {
    const vecLength = this.length;

    if (vecLength >= XcGmContext.gTol.anglePrecision) {
      this.x /= vecLength;
      this.y /= vecLength;
    }
  }

  get length() {
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    return len;
  }

  isUnitLength() {
    return Math.abs(this.length - 1) < XcGmContext.gTol.anglePrecision;
  }

  isZeroLength() {
    const threshold = XcGmContext.gTol.linearPrecision;

    return this.lengthSquared() < threshold * threshold;
  }

  isParallelTo({vector}) {
    const threshold = XcGmContext.gTol.linearPrecision;
    const notZero = a => a.length >= threshold;

    return notZero(this)
    && notZero(vector)
    && Math.abs(Math.remainder(this.angleTo({vector}), Math.PI)) < XcGmContext.gTol.anglePrecision;
  }

  isCodirectionalTo({vector}) {
    // TODO
  }

  isPerpendicularTo({vector}) {
    // TODO
  }

  isEqualTo({vector}) {
    return Math.abs(this.x - vector.x) < XcGmContext.gTol.anglePrecision
        && Math.abs(this.y - vector.y) < XcGmContext.gTol.anglePrecision;
  }

  crossProduct({vector}) {
    // TODO
  }

  project({plane, projectDirection}) {
    // TODO
  }

  orthoProject({plane, projectDirection}) {
    // TODO
  }
}
