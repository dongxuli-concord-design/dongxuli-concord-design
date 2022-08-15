class XcGmBox {
  minimumX;
  minimumY;
  minimumZ;
  maximumX;
  maximumY;
  maximumZ;

  constructor({minimumX, minimumY, minimumZ, maximumX, maximumY, maximumZ}) {
    this.minimumX = minimumX;
    this.minimumY = minimumY;
    this.minimumZ = minimumZ;
    this.maximumX = maximumX;
    this.maximumY = maximumY;
    this.maximumZ = maximumZ;
  }

  static fromJSON({json}) {
    let box = new XcGmBox({
      minimumX: json.minimumX,
      minimumY: json.minimumY,
      minimumZ: json.minimumZ,
      maximumX: json.maximumX,
      maximumY: json.maximumY,
      maximumZ: json.maximumZ,
    });
    return box;
  }

  toJSON() {
    return {
      minimumX,
      minimumY,
      minimumZ,
      maximumX,
      maximumY,
      maximumZ,
    }
  }
}
