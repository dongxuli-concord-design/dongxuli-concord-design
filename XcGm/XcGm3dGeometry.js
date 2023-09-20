class XcGm3dGeometry extends XcGmGeometry {
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
}
