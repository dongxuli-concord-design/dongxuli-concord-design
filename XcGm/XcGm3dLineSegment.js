class XcGm3dLineSegment extends XcGm3dCurve {
  startPosition;
  endPosition;
  constructor({startPosition, endPosition}) {
    super();
    this.startPosition = startPosition.clone();
    this.endPosition = endPosition.clone();
  }

  clone() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  contains({position}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  translate({vector}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  rotate({position, angle}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  scale({position, factor}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  mirror({line}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  transform({matrix}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  save() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  static load({json}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get hasStartPosition() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get hasEndPosition() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get isClosed() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get isDegenerated() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get isLinear() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  get isPeriodic() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeBox() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computePosition({t}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeTangent({t}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeClosestPositionToPosition({position}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeClosestPositionToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeDistanceToPosition({position}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeDistanceToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeNormalPosition({position}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeDegeneratedGeometry() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeLength({startParam, endParam}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeParamAtLength({length}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  computeParamAtPosition({position}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  reverseParam() {
    XcGmAssert({assertion: false, message: 'TODO'});
  }

  setInterval({interval}) {
    XcGmAssert({assertion: false, message: 'TODO'});
  }
}
