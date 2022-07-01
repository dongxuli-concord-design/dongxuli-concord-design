class Xc3dDocAnnotation extends Xc3dDocDrawableObject {

  constructor({name = 'annotation'} = {}) {
    super({name});
  }

  static load({json, document}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
    return null;
  }

  setAssociatedParts({associatedParts}) {
    this.associatedParts = [...associatedParts];
  }

  clone() {
    const newAnnotation = new Xc3dDocAnnotation({
      name: this.name,
    });

    newAnnotation.userData = {...this.userData};

    return newAnnotation;
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

  transform({matrix}) {
    XcSysAssert({assertion: false, message: 'The subclass has to implement this function'});
  }
}
