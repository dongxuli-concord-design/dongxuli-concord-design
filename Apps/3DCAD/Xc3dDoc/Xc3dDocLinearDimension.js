class Xc3dDocLinearDimension extends Xc3dDocAnnotation {
  position1;
  position2;
  upVector;
  height;

  constructor({
                name = 'linear dimension',
                position1,
                position2,
                upVector,
                height
              }) {
    super({name});
    this.position1 = position1;
    this.position2 = position2;
    this.upVector = upVector;
    this.height = height;
  }

  static load({json, document}) {
    const name = json.name;
    const position1 = XcGm3dPosition.fromJSON({json: json.position1});
    const position2 = XcGm3dPosition.fromJSON({json: json.position2});
    const upVector = XcGm3dVector.fromJSON({json: json.upVector});
    const height = json.height;

    const linearDimension = new Xc3dDocLinearDimension({
      name,
      position1,
      position2,
      upVector,
      height
    });

    const userData = json.userData;
    linearDimension.userData = userData;

    return linearDimension;
  }

  setParameters({position1, position2, upVector, height}) {
    this.position1 = position1;
    this.position2 = position2;
    this.upVector = upVector;
    this.height = height;
  }

  clone() {
    const newLinearDimension = new Xc3dDocLinearDimension({
      name: this.name,
      position1: this.position1.clone(),
      position2: this.position2.clone(),
      upVector: this.upVector.clone(),
      height: this.height,
    });

    newLinearDimension.userData = {...this.userData};

    return newLinearDimension;
  }

  copy({other}) {
    super.copy({other});
    this.position1 = other.position1.clone();
    this.position2 = other.position2.clone();
    this.upVector = other.upVector.clone();
    this.height = other.height;
  }

  save({document}) {
    const data = super.save({document});

    return {
      ...data,
      position1: this.position1.toJSON(),
      position2: this.position2.toJSON(),
      upVector: this.upVector.toJSON(),
      height: this.height,
    }
  }

  generateRenderingObject() {
    // TODO:
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x0000ff)
    });
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      ...this.position1.toArray(),
      ...this.position2.toArray(),
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const line = new THREE.Line(geometry, material);

    const distance = this.position1.distanceToPosition({position: this.position2});
    const midPosition = new XcGm3dPosition({
      x: (this.position1.x + this.position2.x) / 2.0,
      y: (this.position1.y + this.position2.y) / 2.0,
      z: (this.position1.z + this.position2.z) / 2.0,
    });
    const label = Xc3dUIManager.generateTextLabel({
      text: `${distance.toFixed(2)}`,
      position: midPosition.toThreeVector3(),
      size: 0.02,
      height: 0.01,
      color: new THREE.Color(0x5cb85c80)
    });


    const annotationGroup = new THREE.Group();
    annotationGroup.add(line);
    annotationGroup.add(label);

    return annotationGroup;
  }

  transform({matrix}) {
    this.position1.transform({matrix});
    this.position2.transform({matrix});
    this.upVector.transform({matrix});
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: Xc3dDocLinearDimension});
