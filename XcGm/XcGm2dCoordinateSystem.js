class XcGm2dCoordinateSystem {
  origin;
  xAxisDirection;

  constructor({
                origin = new XcGm2dPosition({x: 0, y: 0}),
                xAxisDirection = new XcGm2dVector({x: 1, y: 0})
              } = {}) {
    this.origin = origin;
    this.xAxisDirection = xAxisDirection;
  }

  static fromMatrix({matrix}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  static fromJSON({json}) {
    const coordinateSystem = new XcGm2dCoordinateSystem();
    coordinateSystem.origin = XcGm2dPosition.fromJSON({json: json.origin});
    coordinateSystem.xAxisDirection = XcGm2dVector.fromJSON({json: json.xAxisDirection});
    return coordinateSystem;
  }

  clone() {
    return new XcGm2dCoordinateSystem({
      origin: this.origin.clone(),
      xAxisDirection: this.xAxisDirection.clone(),
    });
  }

  toMatrix() {
    // TODO
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeTransformToCoordinateSystem({coordinateSystem}) {
    const matrix1 = coordinateSystem.toMatrix();
    const matrix2 = this.toMatrix().inverse;

    const matrix = XcGm2dMatrix.multiply({matrix1, matrix2});
    return matrix;
  }

  toJSON() {
    return {
      origin: this.origin.toJSON(),
      xAxisDirection: this.xAxisDirection.toJSON()
    }
  }
}
