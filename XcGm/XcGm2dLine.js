class XcGm2dLine extends XcGm2dCurve {
  axis;
  constructor({axis}) {
    super();
    this.axis.copy({axis});
  }
}
