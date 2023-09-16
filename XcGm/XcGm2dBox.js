class XcGm2dBox {
  minimumX;
  minimumY;
  maximumX;
  maximumY;

  constructor({minimumX, minimumY, maximumX, maximumY}) {
    this.minimumX = minimumX;
    this.minimumY = minimumY;
    this.maximumX = maximumX;
    this.maximumY = maximumY;
  }

  static fromJSON({json}) {
    const box = new XcGm2dBox({
      minimumX: json.minimumX,
      minimumY: json.minimumY,
      maximumX: json.maximumX,
      maximumY: json.maximumY,
    });
    return box;
  }

  toJSON() {
    return {
      minimumX: this.minimumX,
      minimumY: this.minimumY,
      maximumX: this.maximumX,
      maximumY: this.maximumY,
    }
  }

  clone() {
    return new XcGm2dBox({
      minimumX: this.minimumX, 
      minimumY: this.minimumY,
      maximumX: this.maximumX,
      maximumY: this.maximumY,
    });
  }
  
  transform({matrix}) {
    // TODO
  }
}
