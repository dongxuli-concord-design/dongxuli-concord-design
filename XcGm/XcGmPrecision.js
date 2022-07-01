class XcGmPrecision {
  linearPrecision;
  anglePrecision;

  constructor({linearPrecision = 1.0e-8, anglePrecision = 1.0e-11} = {}) {
    this.linearPrecision = linearPrecision;
    this.anglePrecision = anglePrecision;
  }
}
