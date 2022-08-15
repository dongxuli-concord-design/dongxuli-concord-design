class XcGm2DPosition {
  x;
  y;

  constructor({x = 0.0, y = 0.0} = {}) {
    this.x = x;
    this.y = y;
  }

  static fromArray({array}) {
    return new XcGm3DPosition({x: array[0], y: array[1]});
  }

  static fromJSON({json}) {
    return new XcGm3DPosition({x: json.x, y: json.y});
  }

  static fromThreeVector3({threeVector3}) {
    let pos = new XcGm3DPosition({x: threeVector3.x, y: threeVector3.y});
    return pos;
  }

  toThreeVector3() {
    return new THREE.Vector3(this.x, this.y);
  }

  toString() {
    return `${this.x.toPrecision(2)}, ${this.y.toPrecision(2)}`;
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
    return new XcGm3DPosition({x: this.x, y: this.y});
  }

  assignFrom({position}) {
    this.x = position.x;
    this.y = position.y;
    return this;
  }
}
