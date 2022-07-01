class Xc3dDocTexture {

  name;
  document;
  filePath;
  isStaticPath;
  #map;

  constructor({
                name = 'texture',
                filePath,
                document,
                isStaticPath = false,
              }) {
    this.name = name;
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

    try {
      this.#loadImage();
    } catch (error) {
      XcSysManager.outputDisplay.error('Load external file error');
      throw error;
    }
  }

  get map() {
    return this.#map;
  }

  static load({json, document}) {
    const name = json.name;
    const filePath = json.filePath;
    const isStaticPath = json.isStaticPath;
    const texture = new Xc3dDocTexture({
      name,
      filePath,
      isStaticPath,
      document,
    });

    try {
      this.#loadImage();
    } catch (error) {
      XcSysManager.outputDisplay.error('Load external file error');
      throw error;
    }

    return texture;
  }

  #loadImage() {
    try {
      let resolvedPath = this.filePath;
      const fs = require('fs');
      if (!this.isStaticPath) {
        // Get the absolute path from the relative path
        const path = require('path');
        const documentFileFolder = path.dirname(this.document.filePath);
        const joinedPath = path.join(documentFileFolder, this.filePath);
        resolvedPath = path.resolve(joinedPath);
      }

      const bitmap = fs.readFileSync(resolvedPath);
      const textureData = new Buffer(bitmap).toString('base64');
      const imageData = `data:image/png;base64,${textureData}`;
      const image = new Image();
      image.src = imageData;
      this.#map = new THREE.Texture();
      this.#map.image = image;
      image.onload = () => {
        this.#map.wrapS = THREE.RepeatWrapping;
        this.#map.wrapT = THREE.RepeatWrapping; 
        this.#map.needsUpdate = true;
      };
    } catch (error) {
      this.#map = null;
      XcSysManager.outputDisplay.warn(error);
    }
  }

  save({document}) {
    return {
      name: this.name,
      filePath: this.filePath,
      isStaticPath: this.isStaticPath,
    };
  }
}
