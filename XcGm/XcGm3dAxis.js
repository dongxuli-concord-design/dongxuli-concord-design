class XcGm3dAxis {
  position;
  direction;

  constructor({
                position = new XcGm3dPosition({x: 0, y: 0, z: 0}),
                direction = new XcGm3dVector({x: 0, y: 0, z: 1})
              } = {}) {
    this.position = position;
    this.direction = direction;
  }

  static fromJSON({json}) {
    const axis = new XcGm3dAxis();
    axis.position = XcGm3dPosition.fromJSON({json: json.position});
    axis.direction = XcGm3dVector.fromJSON({json: json.direction});

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
