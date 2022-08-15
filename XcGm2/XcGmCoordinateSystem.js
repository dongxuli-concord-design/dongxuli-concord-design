class XcGmCoordinateSystem {
  origin;
  zAxis;
  xAxis;

  constructor({
                origin = new XcGm3DPosition({x: 0, y: 0, z: 0}),
                zAxis = new XcGm3DVector({x: 0, y: 0, z: 1}),
                xAxis = new XcGm3DVector({x: 1, y: 0, z: 0})
              } = {}) {
    this.origin = origin;
    this.zAxis = zAxis;
    this.xAxis = xAxis;
  }

  static fromJSON({json}) {
    let coordinateSystem = new XcGmCoordinateSystem();
    coordinateSystem.origin = XcGm3DPosition.fromJSON({json: json.origin});
    coordinateSystem.zAxis = XcGm3DVector.fromJSON({json: json.zAxis});
    coordinateSystem.xAxis = XcGm3DVector.fromJSON({json: json.xAxis});
    return coordinateSystem;
  }

  toJSON() {
    return {
      origin: this.origin.toJSON(),
      zAxis: this.zAxis.toJSON(),
      xAxis: this.xAxis.toJSON()
    }
  }
}
