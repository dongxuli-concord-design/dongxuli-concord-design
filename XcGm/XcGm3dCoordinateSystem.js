class XcGm3dCoordinateSystem {
  origin;
  zAxisDirection;
  xAxisDirection;

  constructor({
                origin = new XcGm3dPosition({x: 0, y: 0, z: 0}),
                zAxisDirection = new XcGm3dVector({x: 0, y: 0, z: 1}),
                xAxisDirection = new XcGm3dVector({x: 1, y: 0, z: 0})
              } = {}) {
    this.origin = origin;
    this.zAxisDirection = zAxisDirection;
    this.xAxisDirection = xAxisDirection;
  }

  static fromMatrix({matrix}) {
    return new XcGm3dCoordinateSystem({
      origin: new XcGm3dPosition({x: matrix.entry[0][3], y: matrix.entry[1][3], z: matrix.entry[2][3]}),
      zAxisDirection: new XcGm3dVector({x: matrix.entry[0][2], y: matrix.entry[1][2], z: matrix.entry[2][2]}),
      xAxisDirection: new XcGm3dVector({x: matrix.entry[0][0], y: matrix.entry[1][0], z: matrix.entry[2][0]}),
    });
  }

  static fromJSON({json}) {
    const coordinateSystem = new XcGm3dCoordinateSystem();
    coordinateSystem.origin = XcGm3dPosition.fromJSON({json: json.origin});
    coordinateSystem.zAxisDirection = XcGm3dVector.fromJSON({json: json.zAxisDirection});
    coordinateSystem.xAxisDirection = XcGm3dVector.fromJSON({json: json.xAxisDirection});
    return coordinateSystem;
  }

  clone() {
    return new XcGm3dCoordinateSystem({
      origin: this.origin.clone(),
      zAxisDirection: this.zAxisDirection.clone(),
      xAxisDirection: this.xAxisDirection.clone(),
    });
  }

  toMatrix() {
    const matrix = new XcGm3dMatrix();
    matrix.entry[0][0] = 0;
    matrix.entry[0][1] = 0;
    matrix.entry[0][2] = 0;
    matrix.entry[0][3] = 0;
    matrix.entry[1][0] = 0;
    matrix.entry[1][1] = 0;
    matrix.entry[1][2] = 0;
    matrix.entry[1][3] = 0;
    matrix.entry[2][0] = 0;
    matrix.entry[2][1] = 0;
    matrix.entry[2][2] = 0;
    matrix.entry[2][3] = 0;

    const origin = this.origin;
    const zAxisDirection = this.zAxisDirection;
    const xAxisDirection = this.xAxisDirection;
    const yAxisDirection = zAxisDirection.crossProduct({vector: xAxisDirection}).normal;

    matrix.entry[0][0] = xAxisDirection.x;
    matrix.entry[1][0] = xAxisDirection.y;
    matrix.entry[2][0] = xAxisDirection.z;
    matrix.entry[3][0] = 0.0;

    matrix.entry[0][1] = yAxisDirection.x;
    matrix.entry[1][1] = yAxisDirection.y;
    matrix.entry[2][1] = yAxisDirection.z;
    matrix.entry[3][1] = 0.0;

    matrix.entry[0][2] = zAxisDirection.x;
    matrix.entry[1][2] = zAxisDirection.y;
    matrix.entry[2][2] = zAxisDirection.z;
    matrix.entry[3][2] = 0.0;

    matrix.entry[0][3] = origin.x;
    matrix.entry[1][3] = origin.y;
    matrix.entry[2][3] = origin.z;
    matrix.entry[3][3] = 1.0;

    return matrix;
  }

  computeTransformToCoordinateSystem({coordinateSystem}) {
    const matrix1 = coordinateSystem.toMatrix();
    const matrix2 = this.toMatrix().inverse;

    const matrix = XcGm3dMatrix.multiply({matrix1, matrix2});
    return matrix;
  }

  toJSON() {
    return {
      origin: this.origin.toJSON(),
      zAxisDirection: this.zAxisDirection.toJSON(),
      xAxisDirection: this.xAxisDirection.toJSON()
    }
  }
}
