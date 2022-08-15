class XcGm2DVector {
  x;
  y;

  constructor({x = 0.0, y = 0.0} = {}) {
    this.x = x;
    this.y = y;
  }

  static fromArray({array}) {
    return new XcGm3DVector({x: array[0], y: array[1]});
  }

  static fromJSON({json}) {
    return new XcGm3DVector({x: json.x, y: json.y});
  }

  static fromThreeVector3({threeVector3}) {
    let vec = new XcGm3DVector({x: threeVector3.x, y: threeVector3.y});
    return vec;
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
    return new XcGm3DVector({x: this.x, y: this.y});
  }

  assignFrom({src}) {
    this.x = src.x;
    this.y = src.y;
    return this;
  }
}
