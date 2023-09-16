class XcGmContext {
  static get gTol() {
    return new XcGmPrecision();
  }

  static set gTol(val) {
    XcGmAssert({assertion: false, message: 'gTol is read-only'});
  }

  constructor() {

  }
}
