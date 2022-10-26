class XcAtDocBlock extends Xc3dDocDrawableObject {
  x;
  y;
  z;
  matrix;
  color;

  #renderingObject;

  constructor({
                name = 'XcAtDocBlock',
                x,
                y,
                z,
                coordinateSystem = new XcGmCoordinateSystem(),
                color = new THREE.Color('gray'),
              }) {
    super({name});
    this.x = x;
    this.y = y;
    this.z = z;
    this.matrix = new XcGm3dMatrix();
    this.color = color.clone();

    const body = XcGmBody.createSolidBlock({
      x: this.x,
      y: this.y,
      z: this.z,
      coordinateSystem,
    });
    this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({
      body,
      color: this.color,
    });
  }

  static load({json, document}) {
    const name = json.name;

    const x = json.x;
    const y = json.y;
    const z = json.z;
    const matrix = XcGm3dMatrix.fromJSON({json: json.matrix});
    const color = new THREE.Color();
    color.fromArray(json.color);

    const obj = new XcAtDocBlock({name, x, y, z, matrix, color});

    const userData = json.userData;
    obj.userData = userData;

    return obj;
  }

  clone() {
    const newObj = new XcAtDocBlock({
      x: this.x,
      y: this.y,
      z: this.z,
      name: this.name,
      matrix: this.matrix.clone(),
      color: this.color.clone(),
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
  }

  save({document}) {
    const data = super.save({document});

    const color = [];
    this.color.toArray(color);

    return {
      ...data,
      x: this.x,
      y: this.y,
      z: this.z,
      matrix: this.matrix.toJSON(),
      color,
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
