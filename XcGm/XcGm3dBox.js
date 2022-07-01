class XcGm3dBox {
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
    const box = new XcGm3dBox({
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

  clone() {
    return new XcGm3dBox({
      minimumX: this.minimumX, 
      minimumY: this.minimumY,
      minimumZ: this.minimumZ,
      maximumX: this.maximumX,
      maximumY: this.maximumY,
      maximumZ: this.maximumZ,
    });
  }
  
  transform({matrix}) {
    // TODO
  }
}
