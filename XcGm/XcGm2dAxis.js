class XcGm2dAxis {
  position;
  direction;

  constructor({
                position = new XcGm2dPosition({x: 0, y: 0, z: 0}),
                direction = new XcGm2dVector({x: 0, y: 0, z: 1})
              } = {}) {
    this.position = position;
    this.direction = direction;
  }

  static fromJSON({json}) {
    let axis = new XcGm2dAxis();
    axis.position = XcGm2dPosition.fromJSON({json: json.position});
    axis.direction = XcGm2dVector.fromJSON({json: json.direction});

    return axis;
  }

  toJSON() {
    return {
      position: this.position.toJSON(),
      direction: this.direction.toJSON()
    }
  };

  clone() {
    return new XcGm2dAxis({
      position: this.position.clone(),
      direction: this.direction.clone(),
    });
  }

  transform({matrix}) {
    this.position.transform({matrix});
    this.direction.transform({matrix});
  }
}
