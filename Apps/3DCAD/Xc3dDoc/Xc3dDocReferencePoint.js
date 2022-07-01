class Xc3dDocReferencePoint extends Xc3dDocDrawableObject {
  #position;

  constructor({
                name = 'ref position',
                position,
              }) {
    super({name});
    this.#position = position;
  }

  static load({json, document}) {
    const name = json.name;
    const position = XcGm3dPosition.fromJSON({json: json.position});

    const refPoint = new Xc3dDocReferencePoint({name, position});

    const userData = json.userData;
    refPoint.userData = userData;

    return refPoint;
  }

  get position() {
    return this.#position.clone();
  }
  
  clone() {
    const newRefPoint = new Xc3dDocReferencePoint({
      name: this.name,
      position: this.#position.clone(),
    });

    newRefPoint.userData = {...this.userData};

    return newRefPoint;
  }

  copy({other}) {
    super.copy({other});
    this.#position = other.position.clone();
  }

  save({document}) {
    const data = super.save({document});

    return {
      ...data,
      position: this.#position.toJSON(),
    }
  }

  generateRenderingObject() {
    const point = XcGm3dPoint.create({position: this.#position});
    const body = point.createMinimumBody();
    return Xc3dDocDocument.generateRenderingForBody({
      body,
      color: new THREE.Color('purple')
    });
  }

  transform({matrix}) {
    this.#position.transform({matrix});
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: Xc3dDocReferencePoint});
