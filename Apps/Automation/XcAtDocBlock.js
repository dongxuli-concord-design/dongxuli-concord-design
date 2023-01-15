class XcAtDocBlock extends Xc3dDocDrawableObject {
  #x;
  #y;
  #z;
  #color;
  #transparent;
  #opacity;

  #body;
  #renderingObject;

  matrix;

  constructor({
                name = 'XcAtDocBlock',
                x,
                y,
                z,
                coordinateSystem = new XcGmCoordinateSystem(),
                color = new THREE.Color('gray'),
                transparent = false,
                opacity = 1.0,
              }) {
    super({name});
    this.#x = x;
    this.#y = y;
    this.#z = z;
    this.matrix = new XcGm3dMatrix();
    this.#color = color.clone();
    this.#transparent = transparent;
    this.#opacity = opacity;

    this.#body = XcGmBody.createSolidBlock({
      x: this.x,
      y: this.y,
      z: this.z,
      coordinateSystem,
    });
    this.#genereateBasicRenderingObject();
  }

  #genereateBasicRenderingObject() {
    this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({
      body: this.#body,
      color: this.#color,
      transparent: this.#transparent,
      opacity: this.#opacity,
    });
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    XcSysAssert({assertion: false, message: 'Cannot change size.'});
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    XcSysAssert({assertion: false, message: 'Cannot change size.'});
  }

  get z() {
    return this.#z;
  }

  set z(value) {
    XcSysAssert({assertion: false, message: 'Cannot change size.'});
  }

  get color() {
    return this.#color;
  }

  set color(value) {
    this.#color = value;
    this.#genereateBasicRenderingObject();
  }

  get transparent() {
    return this.#transparent;
  }

  set transparent(value) {
    this.#transparent = value;
    this.#genereateBasicRenderingObject();
  }

  get opacity() {
    return this.#opacity;
  }

  set opacity(value) {
    this.#opacity = value;
    this.#genereateBasicRenderingObject();
  }

  static load({json, document}) {
    const name = json.name;

    const x = json.x;
    const y = json.y;
    const z = json.z;
    const matrix = XcGm3dMatrix.fromJSON({json: json.matrix});
    const color = new THREE.Color();
    color.fromArray(json.color);
    const transparent = json.transparent;
    const opacity = json.opacity;

    const obj = new XcAtDocBlock({name, x, y, z, matrix, color, transparent, opacity});

    const userData = json.userData;
    obj.userData = userData;

    return obj;
  }

  clone() {
    const newObj = new XcAtDocBlock({
      x: this.#x,
      y: this.#y,
      z: this.#z,
      name: this.name,
      matrix: this.matrix.clone(),
      color: this.#color.clone(),
      transparent: this.#transparent,
      opacity: this.#opacity,
    });

    newObj.userData = {...this.userData};

    return newObj;
  }

  copy({other}) {
    super.copy({other});
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.matrix = other.matrix.clone();
    this.color = other.color.clone();
    this.transparent = other.transparent;
    this.opacity = other.opacity;
  }

  save({document}) {
    const data = super.save({document});

    const color = [];
    this.#color.toArray(color);

    return {
      ...data,
      x: this.#x,
      y: this.#y,
      z: this.#z,
      matrix: this.matrix.toJSON(),
      color,
      transparent: this.#transparent,
      opacity: this.#opacity,
    }
  }

  generateRenderingObject() {
    const renderingObject = this.#renderingObject.clone();
    renderingObject.applyMatrix4(this.matrix.toThreeMatrix4());
    return renderingObject;
  }

  transform({matrix}) {
    this.matrix.multiply({matrix});
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: XcAtDocBlock});
