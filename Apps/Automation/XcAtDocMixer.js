class XcAtDocMixerTest extends Xc3dDocDrawableObject {
  color;
  #position;

  constructor({
                name = 'mixer object demo',
                color = new THREE.Color('blue'),
                position,
              }) {
    super({name});
    this.#position = position;
    this.color = color;
  }

  static load({json, document}) {
    const name = json.name;
    const position = XcGm3dPosition.fromJSON({json: json.position});
    const color = new THREE.Color(json.color);

    const obj = new XcAtDocMixerTest({name, position});

    const userData = json.userData;
    obj.userData = userData;

    return obj;
  }

  get position() {
    return this.#position.clone();
  }

  clone() {
    const newObj = new XcAtDocMixerTest({
      name: this.name,
      position: this.#position.clone(),
      color: this.color.clone(),
    });

    newObj.userData = {...this.userData};

    return newObj;
  }

  copy({other}) {
    super.copy({other});
    this.#position = other.position.clone();
    this.color = other.color.clone();
  }

  save({document}) {
    const data = super.save({document});

    return {
      ...data,
      position: this.#position.toJSON(),
      color: `#${this.color.getHexString()}`,
    }
  }

  generateRenderingObject() {
    const coordinateSystem = new XcGm3dCoordinateSystem({
      origin: this.#position,
    });
    const body = XcGmBody._pkCreateSolidBlock({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      coordinateSystem
    });

    return Xc3dDocDocument.generateRenderingForBody({
      body,
      color: this.color,
    });
  }

  transform({matrix}) {
    this.#position.transform({matrix});
  }


  * dance10times() {
    for (let i = 0; i < 10; ++i) {

      // Pause for a few ticks
      for (let i = 0; i < 10; ++i) { yield null; }

      // Update object
      this.color.setHex( Math.random() * 0xffffff );

      yield this;
    }
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: XcAtDocMixerTest});
