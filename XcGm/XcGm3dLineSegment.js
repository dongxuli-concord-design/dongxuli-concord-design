class XcGm3dLineSegment extends XcGm3dCurve {
  startPosition;
  endPosition;
  constructor({startPosition, endPosition}) {
    super();
    this.startPosition = startPosition.clone();
    this.endPosition = endPosition.clone();
  }
}