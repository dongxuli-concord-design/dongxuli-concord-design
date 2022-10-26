class XcGm3dPosition {
  x;
  y;
  z;

  constructor({x = 0.0, y = 0.0, z = 0.0} = {}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get origin() {
    return new XcGm3dPosition();
  }

  static fromArray({array}) {
    return new XcGm3dPosition({x: array[0], y: array[1], z: array[2]});
  }

  static fromJSON({json}) {
    return new XcGm3dPosition({x: json.x, y: json.y, z: json.z});
  }

  static add({position, vector}) {
    return new XcGm3dPosition({x: position.x + vector.x, y: position.y + vector.y, z: position.z + vector.z});
  }

  static subtract({position, positionOrVector}) {
    return new XcGm3dVector({
      x: position.x - positionOrVector.x,
      y: position.y - positionOrVector.y,
      z: position.z - positionOrVector.z
    });
  }

  static multiply({position, scale}) {
    return new XcGm3dVector({x: position.x * scale, y: position.y * scale, z: position.z * scale});
  }

  static divide({position, scale}) {
    return new XcGm3dVector({x: position.x / scale, y: position.y / scale, z: position.z / scale});
  }

  static fromThreeVector3({threeVector3}) {
    const pos = new XcGm3dPosition({x: threeVector3.x, y: threeVector3.y, z: threeVector3.z});
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
    return new XcGm3dPosition({x: this.x, y: this.y, z: this.z});
  }

  copy({position}) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
  }

  add({vector}) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  subtract({positionOrVector}) {
    this.x -= positionOrVector.x;
    this.y -= positionOrVector.y;
    this.z -= positionOrVector.z;
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

  toVector() {
    return new XcGm3dVector({x: this.x, y: this.y, z: this.z});
  }

  set({x, y, z}) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setToSum({position, vector}) {
    this.x = position.x + vector.x;
    this.y = position.y + vector.y;
    this.z = position.z + vector.z;
  }

  setToProduct({matrix, position}) {
    const newPosition = new XcGm3dPosition();
    for (let i = 0; i < 3; i += 1) {
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
  }

  transform({matrix}) {
    const newPosition = new XcGm3dPosition();
    newPosition.x = matrix.entry[0][0] * this.x + matrix.entry[0][1] * this.y + matrix.entry[0][2] * this.z + matrix.entry[0][3];
    newPosition.y = matrix.entry[1][0] * this.x + matrix.entry[1][1] * this.y + matrix.entry[1][2] * this.z + matrix.entry[1][3];
    newPosition.z = matrix.entry[2][0] * this.x + matrix.entry[2][1] * this.y + matrix.entry[2][2] * this.z + matrix.entry[2][3];

    this.x = newPosition.x;
    this.y = newPosition.y;
    this.z = newPosition.z;
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

  isEqualTo({position}) {
    if ((Math.abs(position.x - this.x) <= XcGmContext.gTol.linearPrecision)
      && (Math.abs(position.y - this.y) <= XcGmContext.gTol.linearPrecision)
      && (Math.abs(position.z - this.z) <= XcGmContext.gTol.linearPrecision)) {
      return true;
    } else {
      return false;
    }
  }
}
