class Xc3dDocDrawableObject {

  userData;
  name;

  constructor({name = ''} = {}) {
    this.userData = {};
    this.name = name;
  }

  static load({json, document}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  clone() {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  copy({other}) {
    this.name = other.name;
    this.userData = {...other.userData};
  }

  save({document}) {
    return {
      name: this.name,
      userData: this.userData
    }
  }

  generateRenderingObject() {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  transform({matrix}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
  }
}
