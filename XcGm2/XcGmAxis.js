class XcGmAxis {
  position;
  direction;

  constructor({
                position = new XcGm3DPosition({x: 0, y: 0, z: 0}),
                direction = new XcGm3DVector({x: 0, y: 0, z: 1})
              } = {}) {
    this.position = position;
    this.direction = direction;
  }

  toJSON() {
    return {
      position: this.position.toJSON(),
      direction: this.direction.toJSON()
    }
  };

  fromJSON({json}) {
    let axis = new XcGmAxis();
    axis.position = XcGm3DPosition.fromJSON({json: json.position});
    axis.direction = XcGm3DVector.fromJSON({json: json.direction});

    return axis;
  }
}
