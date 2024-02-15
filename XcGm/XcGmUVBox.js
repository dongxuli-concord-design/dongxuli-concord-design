class XcGmUVBox {
  lowU;
  lowV;
  highU;
  highV;

  constructor({lowU, lowV, highU, highV}) {
    this.lowU = lowU;
    this.lowV = lowV;
    this.highU = highU;
    this.highV = highV;
  }

  static fromJSON({json}) {
    let uvBox = new XcGmUVBox({
      lowU: json.lowU,
      lowV: json.lowV,
      highU: json.highU,
      highV: json.highV,
    });
    return uvBox;
  }

  toJSON() {
    return {
      lowU: this.lowU,
      lowV: this.lowV,
      highU: this.highU,
      highV: this.highV,
    }
  }
}
