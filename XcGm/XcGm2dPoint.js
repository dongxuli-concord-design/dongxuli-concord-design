class XcGm2dPoint extends XcGm2dGeometry {
  position;
  constructor({position}) {
    super();
    this.position.copy(position);
  }
}
