class Xc3dDocSTLModel extends Xc3dDocDrawableObject {
  filePath;
  isStaticPath;
  matrix;
  document;
  color;

  constructor({
                name = 'stl model',
                filePath,
                document,
                isStaticPath = false,
                matrix = new XcGm3dMatrix(),
                color = new THREE.Color('lightslategray'),
              }) {
    super({name});
    this.matrix = matrix.clone();
    this.document = document;
    this.isStaticPath = isStaticPath;
    this.color = color;

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
    const color = new THREE.Color(json.color);

    const model = new Xc3dDocSTLModel({
      name,
      filePath,
      isStaticPath,
      matrix,
      document,
      color,
    });

    const userData = json.userData;
    model.userData = userData;

    return model;
  }

  clone() {
    const newModel = new Xc3dDocSTLModel({
      name: this.name,
      filePath: this.filePath,
      matrix: this.matrix.clone(),
      color: this.color ? this.color.clone() : null,
    });

    newModel.userData = {...this.userData};

    return newModel;
  }

  copy({other}) {
    super.copy({other});

    this.filePath = other.filePath;
    this.matrix = other.matrix.clone();
    this.color = other.color ? other.color.clone() : null;
  }

  save({document}) {
    const data = super.save({document});
    return {
      ...data,
      filePath: this.filePath,
      isStaticPath: this.isStaticPath,
      matrix: this.matrix.toJSON(),
      color: this.color ? `#${this.color.getHexString()}` : null,
    }
  }

  generateRenderingObject() {
    let renderingObject = new THREE.Group();
    if (!this.filePath) {
      return renderingObject;
    }

    try {
      const fs = require('fs');
      let resolvedPath = this.filePath;

      if (!this.isStaticPath) {
        const path = require('path');
        const documentFileFolder = path.dirname(this.document.filePath);
        const joinedPath = path.join(documentFileFolder, this.filePath);
        resolvedPath = path.resolve(joinedPath);
      }

      const stlContent = fs.readFileSync(resolvedPath, "binary");
      const geometry = this.#parseSTL(stlContent);
      let material = null;
      if (geometry.hasColors) {
        material = new THREE.MeshStandardMaterial({opacity: geometry.alpha, vertexColors: true});
      } else {
        material = new THREE.MeshStandardMaterial({color: this.color});
      }
      renderingObject = new THREE.Mesh(geometry, material);
      renderingObject.applyMatrix4(this.matrix.toThreeMatrix4());
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }

    return renderingObject;
  }

  transform({matrix}) {
    this.matrix.preMultiply({matrix});
  }

  // Forked from THREE.js STL Loader
  #parseSTL(data) {

    function isBinary(data) {

      var expect, face_size, n_faces, reader;
      reader = new DataView(data);
      face_size = (32 / 8 * 3) + ((32 / 8 * 3) * 3) + (16 / 8);
      n_faces = reader.getUint32(80, true);
      expect = 80 + (32 / 8) + (n_faces * face_size);

      if (expect === reader.byteLength) {

        return true;

      }

      // An ASCII STL data must begin with 'solid ' as the first six bytes.
      // However, ASCII STLs lacking the SPACE after the 'd' are known to be
      // plentiful.  So, check the first 5 bytes for 'solid'.

      // Several encodings, such as UTF-8, precede the text with up to 5 bytes:
      // https://en.wikipedia.org/wiki/Byte_order_mark#Byte_order_marks_by_encoding
      // Search for "solid" to start anywhere after those prefixes.

      // US-ASCII ordinal values for 's', 'o', 'l', 'i', 'd'

      var solid = [115, 111, 108, 105, 100];

      for (var off = 0; off < 5; off++) {

        // If "solid" text is matched to the current offset, declare it to be an ASCII STL.

        if (matchDataViewAt(solid, reader, off)) return false;

      }

      // Couldn't find "solid" text at the beginning; it is binary STL.

      return true;

    }

    function matchDataViewAt(query, reader, offset) {

      // Check if each byte in query matches the corresponding byte from the current offset

      for (var i = 0, il = query.length; i < il; i += 1) {

        if (query[i] !== reader.getUint8(offset + i, false)) return false;

      }

      return true;

    }

    function parseBinary(data) {

      var reader = new DataView(data);
      var faces = reader.getUint32(80, true);

      var r, g, b, hasColors = false, colors;
      var defaultR, defaultG, defaultB, alpha;

      // process STL header
      // check for default color in header ("COLOR=rgba" sequence).

      for (var index = 0; index < 80 - 10; index++) {

        if ((reader.getUint32(index, false) == 0x434F4C4F /*COLO*/) &&
          (reader.getUint8(index + 4) == 0x52 /*'R'*/) &&
          (reader.getUint8(index + 5) == 0x3D /*'='*/)) {

          hasColors = true;
          colors = new Float32Array(faces * 3 * 3);

          defaultR = reader.getUint8(index + 6) / 255;
          defaultG = reader.getUint8(index + 7) / 255;
          defaultB = reader.getUint8(index + 8) / 255;
          alpha = reader.getUint8(index + 9) / 255;

        }

      }

      var dataOffset = 84;
      var faceLength = 12 * 4 + 2;

      var geometry = new THREE.BufferGeometry();

      var vertices = new Float32Array(faces * 3 * 3);
      var normals = new Float32Array(faces * 3 * 3);

      for (var face = 0; face < faces; face++) {

        var start = dataOffset + face * faceLength;
        var normalX = reader.getFloat32(start, true);
        var normalY = reader.getFloat32(start + 4, true);
        var normalZ = reader.getFloat32(start + 8, true);

        if (hasColors) {

          var packedColor = reader.getUint16(start + 48, true);

          if ((packedColor & 0x8000) === 0) {

            // facet has its own unique color

            r = (packedColor & 0x1F) / 31;
            g = ((packedColor >> 5) & 0x1F) / 31;
            b = ((packedColor >> 10) & 0x1F) / 31;

          } else {

            r = defaultR;
            g = defaultG;
            b = defaultB;

          }

        }

        for (var i = 1; i <= 3; i += 1) {

          var vertexstart = start + i * 12;
          var componentIdx = (face * 3 * 3) + ((i - 1) * 3);

          vertices[componentIdx] = reader.getFloat32(vertexstart, true);
          vertices[componentIdx + 1] = reader.getFloat32(vertexstart + 4, true);
          vertices[componentIdx + 2] = reader.getFloat32(vertexstart + 8, true);

          normals[componentIdx] = normalX;
          normals[componentIdx + 1] = normalY;
          normals[componentIdx + 2] = normalZ;

          if (hasColors) {

            colors[componentIdx] = r;
            colors[componentIdx + 1] = g;
            colors[componentIdx + 2] = b;

          }

        }

      }

      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

      if (hasColors) {

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.hasColors = true;
        geometry.alpha = alpha;

      }

      return geometry;

    }

    function parseASCII(data) {

      var geometry = new THREE.BufferGeometry();
      var patternSolid = /solid([\s\S]*?)endsolid/g;
      var patternFace = /facet([\s\S]*?)endfacet/g;
      var faceCounter = 0;

      var patternFloat = /[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source;
      var patternVertex = new RegExp('vertex' + patternFloat + patternFloat + patternFloat, 'g');
      var patternNormal = new RegExp('normal' + patternFloat + patternFloat + patternFloat, 'g');

      var vertices = [];
      var normals = [];

      var normal = new THREE.Vector3();

      var result;

      var groupCount = 0;
      var startVertex = 0;
      var endVertex = 0;

      while ((result = patternSolid.exec(data)) !== null) {

        startVertex = endVertex;

        var solid = result[0];

        while ((result = patternFace.exec(solid)) !== null) {

          var vertexCountPerFace = 0;
          var normalCountPerFace = 0;

          var text = result[0];

          while ((result = patternNormal.exec(text)) !== null) {

            normal.x = parseFloat(result[1]);
            normal.y = parseFloat(result[2]);
            normal.z = parseFloat(result[3]);
            normalCountPerFace++;

          }

          while ((result = patternVertex.exec(text)) !== null) {

            vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
            normals.push(normal.x, normal.y, normal.z);
            vertexCountPerFace++;
            endVertex++;

          }

          // every face have to own ONE valid normal

          if (normalCountPerFace !== 1) {

            console.error('THREE.STLLoader: Something isn\'t right with the normal of face number ' + faceCounter);

          }

          // each face have to own THREE valid vertices

          if (vertexCountPerFace !== 3) {

            console.error('THREE.STLLoader: Something isn\'t right with the vertices of face number ' + faceCounter);

          }

          faceCounter++;

        }

        var start = startVertex;
        var count = endVertex - startVertex;

        geometry.addGroup(start, count, groupCount);
        groupCount++;

      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

      return geometry;

    }

    function ensureString(buffer) {

      if (typeof buffer !== 'string') {

        return LoaderUtils.decodeText(new Uint8Array(buffer));

      }

      return buffer;

    }

    function ensureBinary(buffer) {

      if (typeof buffer === 'string') {

        var array_buffer = new Uint8Array(buffer.length);
        for (var i = 0; i < buffer.length; i += 1) {

          array_buffer[i] = buffer.charCodeAt(i) & 0xff; // implicitly assumes little-endian

        }

        return array_buffer.buffer || array_buffer;

      } else {

        return buffer;

      }

    }

    // start

    var binData = ensureBinary(data);

    return isBinary(binData) ? parseBinary(binData) : parseASCII(ensureString(data));
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: Xc3dDocSTLModel});
