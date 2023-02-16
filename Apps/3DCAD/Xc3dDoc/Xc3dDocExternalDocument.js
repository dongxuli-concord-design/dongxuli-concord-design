class Xc3dDocExternalDocument extends Xc3dDocDrawableObject {
  static #assemblyToModelMap = new WeakMap();

  filePath;
  isStaticPath;
  matrix;
  document;

  constructor({
                name = 'external document',
                filePath,
                document,
                isStaticPath = false,
                matrix = new XcGm3dMatrix(),
              } = {}) {
    super({name});
    this.matrix = matrix.clone();
    this.document = document;
    this.isStaticPath = isStaticPath;

    const path = require('path');
    if (filePath && path.isAbsolute(filePath)) {
      try {
        const documentFileFolder = path.dirname(this.document.filePath);
        const relativePath = path.relative(documentFileFolder, filePath);
        this.filePath = relativePath;
      } catch (error) {
        XcSysManager.outputDisplay.error('Load external file error');
        this.filePath = null;
        throw error;
      }
    } else {
      this.filePath = filePath;
    }
  }

  static load({json, document}) {
    const name = json.name;
    const filePath = json.filePath;
    const isStaticPath = json.isStaticPath;
    const matrix = XcGm3dMatrix.fromJSON({json: json.matrix});

    const newExternalDocument = new Xc3dDocExternalDocument({
      name,
      filePath,
      isStaticPath,
      matrix,
      document,
    })

    const userData = json.userData;
    newExternalDocument.userData = userData;

    return newExternalDocument;
  }

  clone() {
    const newExternalDocument = new Xc3dDocExternalDocument({
      filePath: this.filePath,
      matrix: this.matrix.clone(),
      name: this.name,
      document: this.document,
    });

    newExternalDocument.userData = {...this.userData};

    return newExternalDocument;
  }

  copy({other}) {
    super.copy({other});
    this.filePath = other.filePath;
    this.matrix = other.matrix.clone();
  }

  save({document}) {
    const data = super.save({document});
    return {
      ...data,
      filePath: this.filePath,
      isStaticPath: this.isStaticPath,
      matrix: this.matrix.toJSON()
    };
  }

  generateRenderingObject() {
    let documentRendering = new THREE.Group();

    try {
      let resolvedPath = null;
      const fs = require('fs');

      if (this.isStaticPath) {
        resolvedPath = this.filePath;
      } else {
        const path = require('path');
        const documentFileFolder = path.dirname(this.document.filePath);
        const joinedPath = path.join(documentFileFolder, this.filePath);
        resolvedPath = path.resolve(joinedPath);
      }

      const fileContents = fs.readFileSync(resolvedPath);
      const documentData = JSON.parse(fileContents);

      const document = Xc3dDocDocument.load({json: documentData, filePath: resolvedPath});
      documentRendering.add(document.renderingScene);
      documentRendering.applyMatrix4(this.matrix.toThreeMatrix4());
    } catch (error) {
      XcSysManager.outputDisplay.error('Load external file error', error);
    }

    return documentRendering;
  }

  transform({matrix}) {
    this.matrix.preMultiply({matrix});
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: Xc3dDocExternalDocument});
