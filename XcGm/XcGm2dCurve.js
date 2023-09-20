class XcGm2dCurve extends XcGm2dGeometry {
  constructor() {
    super();
  }

  clone() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  contains({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  translate({vector}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  rotate({position, angle}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  scale({position, factor}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  mirror({line}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  transform({matrix}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  toJSON() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  static fromJSON({json}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get hasStartPosition() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get hasEndPosition() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isClosed() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isDegenerated() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isLinear() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isPeriodic() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeBox() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computePosition({t}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeTangent({t}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeClosestPositionToPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeClosestPositionToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDistanceToPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDistanceToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeNormalPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDegeneratedGeometry() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeLength({startParam, endParam}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeParamAtLength({length}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeParamAtPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  reverseParam() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  setInterval({interval}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }
}
