class XcGm2dPosition {
  x;
  y;

  constructor({x = 0.0, y = 0.0} = {}) {
    this.x = x;
    this.y = y;
  }

  static get origin() {
    return new XcGm2dPosition();
  }

  static fromArray({array}) {
    return new XcGm2dPosition({x: array[0], y: array[1]});
  }

  static fromJSON({json}) {
    return new XcGm2dPosition({x: json.x, y: json.y});
  }

  static add({position, vector}) {
    return new XcGm2dPosition({x: position.x + vector.x, y: position.y + vector.y});
  }

  static subtract({position, positionOrVector}) {
    return new XcGm2dVector({
      x: position.x - positionOrVector.x,
      y: position.y - positionOrVector.y,
    });
  }

  static multiply({position, scale}) {
    return new XcGm2dVector({x: position.x * scale, y: position.y * scale});
  }

  static divide({position, scale}) {
    return new XcGm2dVector({x: position.x / scale, y: position.y / scale});
  }

  static fromThreeVector3({threeVector3}) {
    const pos = new XcGm2dPosition({x: threeVector3.x, y: threeVector3.y});
    return pos;
  }

  toThreeVector2() {
    return new THREE.Vector2(this.x, this.y);
  }

  toString() {
    return `${this.x.toPrecision(2)}, ${this.y.toPrecision(2)}}`;
  }

  toArray() {
    return [this.x, this.y];
  };

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  clone() {
    return new XcGm2dPosition({x: this.x, y: this.y});
  }

  copy({position}) {
    this.x = position.x;
    this.y = position.y;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract({positionOrVector}) {
    this.x -= positionOrVector.x;
    this.y -= positionOrVector.y;
  }

  multiply({scale}) {
    this.x *= scale;
    this.y *= scale;
  }

  divide({scale}) {
    this.x /= scale;
    this.y /= scale;
  }

  toVector() {
    return new XcGm2dVector({x: this.x, y: this.y});
  }

  set({x, y}) {
    this.x = x;
    this.y = y;
  }

  setToSum({position, vector}) {
    this.x = position.x + vector.x;
    this.y = position.y + vector.y;
  }

  setToProduct({matrix, position}) {
    const newPosition = new XcGm2dPosition();
    for (let i = 0; i < 2; i += 1) {
      newPosition.x += matrix.entry[0][i] * position[i];
      newPosition.y += matrix.entry[1][i] * position[i];
    }

    newPosition.x += matrix.entry[0][2];
    newPosition.y += matrix.entry[1][2];

    this.x = newPosition.x;
    this.y = newPosition.y;
  }

  transform({matrix}) {
    const newPosition = new XcGm2dPosition();
    newPosition.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2];
    newPosition.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2];

    this.x = newPosition.x;
    this.y = newPosition.y;
  }

  rotateBy({angle, center}) {
    const matrix = XcGm2dMatrix.rotationMatrix({angle, center});
    this.transform({matrix});
  }

  mirror({plane}) {
    // TODO
  }

  project({plane, vector}) {
    // TODO
  }

  orthoProject({plane}) {
    // TODO
  }

  distanceToPosition({position}) {
    return Math.sqrt((this.x - position.x) * (this.x - position.x) + (this.y - position.y) * (this.y - position.y));
  }

  isEqualTo({position}) {
    if ((Math.abs(position.x - this.x) <= XcGmContext.gTol.linearPrecision)
      && (Math.abs(position.y - this.y) <= XcGmContext.gTol.linearPrecision)) {
      return true;
    } else {
      return false;
    }
  }
}
