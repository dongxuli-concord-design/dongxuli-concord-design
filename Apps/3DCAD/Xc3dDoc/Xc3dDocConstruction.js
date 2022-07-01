class Xc3dDocConstruction extends Xc3dDocDrawableObject {

  constructor({name = 'construction'} = {}) {
    super({name});
  }

  static load({json, document}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  clone() {
    const newConstruction = new Xc3dDocConstruction({name: this.name});

    newConstruction.userData = {...this.userData};

    return newConstruction;
  }

  copy({other}) {
    super.copy({other});
  }

  save({document}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  generateRenderingObject() {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }
}
