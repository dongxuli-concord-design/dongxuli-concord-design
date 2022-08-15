class XcGm3DPosition {
  x;
  y;
  z;

  constructor({x = 0.0, y = 0.0, z = 0.0} = {}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get origin() {
    return new XcGm3DPosition();
  }

  static addition({position, vector}) {
    return new XcGm3DPosition({x: position.x + vector.x, y: position.y + vector.y, z: position.z + vector.z});
  }

  static subtraction({position, positionOrVector}) {
    return new XcGm3DVector({
      x: position.x - positionOrVector.x,
      y: position.y - positionOrVector.y,
      z: position.z - positionOrVector.z
    });
  }

  static multiplication({position, scale}) {
    return new XcGm3DVector({x: position.x * scale, y: position.y * scale, z: position.z * scale});
  }

  static division({position, scale}) {
    return new XcGm3DVector({x: position.x / scale, y: position.y / scale, z: position.z / scale});
  }

  static fromArray({array}) {
    return new XcGm3DPosition({x: array[0], y: array[1], z: array[2]});
  }

  static fromJSON({json}) {
    return new XcGm3DPosition({x: json.x, y: json.y, z: json.z});
  }

  static fromThreeVector3({threeVector3}) {
    let pos = new XcGm3DPosition({x: threeVector3.x, y: threeVector3.y, z: threeVector3.z});
    return pos;
  }

  toThreeVector3() {
    return new THREE.Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `${this.x.toPrecision(2)}, ${this.y.toPrecision(2)}, ${this.z.toPrecision(2)}`;
  }

  toArray() {
    return [this.x, this.y, this.z];
  };

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  clone() {
    return new XcGm3DPosition({x: this.x, y: this.y, z: this.z});
  }

  assignFrom({position}) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    return this;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  subtract({positionOrVector}) {
    this.x -= positionOrVector.x;
    this.y -= positionOrVector.y;
    this.z -= positionOrVector.z;
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

  asVector() {
    return new XcGm3DVector({x: this.x, y: this.y, z: this.z});
  }

  set({x, y, z}) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setToSum({position, vector}) {
    this.x = position.x + vector.x;
    this.y = position.y + vector.y;
    this.z = position.z + vector.z;
    return this;
  }

  setToProduct({matrix, position}) {
    let newPosition = new XcGm3DPosition();
    for (let i = 0; i < 3; i++) {
      newPosition.x += matrix.entry[0][i] * position[i];
      newPosition.y += matrix.entry[1][i] * position[i];
      newPosition.z += matrix.entry[2][i] * position[i];
    }

    newPosition.x += matrix.entry[0][3];
    newPosition.y += matrix.entry[1][3];
    newPosition.z += matrix.entry[2][3];

    this.x = newPosition.x;
    this.y = newPosition.y;
    this.z = newPosition.z;

    return this;
  }

  transformBy({matrix}) {
    let newPosition = new XcGm3DPosition();
    newPosition.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2] * this.z + matrix.entry[0][3];
    newPosition.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2] * this.z + matrix.entry[1][3];
    newPosition.z = matrix.entry[2][0] * this.x + matrix.entry[2][1] * this.y + matrix.entry[2][2] * this.z + matrix.entry[2][3];

    this.x = newPosition.x;
    this.y = newPosition.y;
    this.z = newPosition.z;

    return this;
  }

  rotateBy({angle, axis}) {
    // TODO
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
    return Math.sqrt((this.x - position.x) * (this.x - position.x) + (this.y - position.y) * (this.y - position.y) + (this.z - position.z) * (this.z - position.z));
  }

  isEqualTo({position, tolerance = XcGmContext.gTol}) {
    if ((Math.abs(position.x - this.x) <= tolerance.linearPrecision)
      && (Math.abs(position.y - this.y) <= tolerance.linearPrecision)
      && (Math.abs(position.z - this.z) <= tolerance.linearPrecision)) {
      return true;
    } else {
      return false;
    }
  }
}
