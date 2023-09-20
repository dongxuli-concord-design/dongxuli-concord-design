class XcGmGeometry extends XcGmEntity {
  constructor() {
    super();
  }

  clone() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  toJSON() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  static fromJSON({json}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }
}
