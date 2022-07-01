class Xc3dDocModel extends Xc3dDocDrawableObject {
  body;
  color;
  texture;

  constructor({name = 'model', body = null, color = null, texture = null} = {}) {
    super({name});
    this.color = color;
    this.texture = texture;
    this.body = body;
  }

  static load({json, document}) {
    const name = json.name;
    const bodyData = json.bodyData;
    const bodies = XcGmPart.receiveFromData({data: bodyData});
    XcSysAssert({assertion: bodies.length === 1});
    const body = bodies[0];

    const color = new THREE.Color(json.color);

    const texture = null;
    if (json.texture) {
      texture = Xc3dDocTexture.load({json: json.texture, document});
    }

    const model = new Xc3dDocModel({
      name,
      body,
      color,
      texture
    });

    return model;
  }

  setAttributesFrom({model}) {
    this.texture = model.texture;
    this.color = model.color;
  }

  clone() {
    const newBody = this.body.clone();
    const newModel = new Xc3dDocModel({
      name: this.name,
      color: this.color ? this.color.clone() : null,
      texture: this.texture,
      body: newBody,
    });

    newModel.userData = {...this.userData};

    return newModel;
  }

  copy({other}) {
    super.copy({other});
    this.texture = other.texture;
    this.color = other.color ? other.color.clone() : null;

    const newBody = other.body.clone();
    this.body = newBody;
  }

  save({document}) {
    const bodyData = XcGmPart.transmitToData({parts: [this.body]});
    const textureData = this.texture ? this.texture.save() : null;
    return {
      name: this.name,
      bodyData: bodyData,
      texture: textureData,
      color: this.color ? `#${this.color.getHexString()}` : null,
    };
  }

  generateRenderingObject() {
    return Xc3dDocDocument.generateRenderingForBody({
      body: this.body,
      map: this.texture ? this.texture.map : null,
      color: this.color
    });
  }

  transform({matrix}) {
    this.body.transform({matrix});
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: Xc3dDocModel});
