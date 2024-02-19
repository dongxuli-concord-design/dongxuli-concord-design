class Xc3dDocDocument {
  static fileVersion = 1;

  static #registeredDrawableObjectTypeClassMap = new Map();

  static RenderingResolution = {
    High: 'High',
    Low: 'Low',
  };

  static #drawableObjectToRenderingObjectMap = new WeakMap();
  static #renderingObjectToDrawableObjectMap = new WeakMap();
  static #modelingKernelEntityToRenderingObjectMap = new WeakMap();
  static #renderingObjectToModelingKernelObjectMap = new WeakMap();

  filePath;

  #renderingScene;
  #drawableObjects;
  #textures;
  #userData;

  #undoEnabled;
  #undoDeltas;
  #redoDeltas;
  #undoSteps;
  #redoSteps;

  #isInEditTransaction;
  #currentTransactionSteps;

  #objectToIDMap;
  #idToObjectMap;


  constructor({filePath}) {
    this.filePath = filePath;
    this.#renderingScene = new THREE.Group();
    this.#drawableObjects = [];
    this.#textures = [];
    this.#userData = {};

    this.#undoEnabled = true;
    this.#undoDeltas = [];
    this.#redoDeltas = [];
    this.#undoSteps = [];
    this.#redoSteps = [];

    this.#isInEditTransaction = false;
    this.#currentTransactionSteps = 0;

    this.#objectToIDMap = new Map();
    this.#idToObjectMap = new Map();
  }

  get renderingScene() {
    return this.#renderingScene;
  }

  set renderingScene(value) {
    XcSysAssert({assertion: false, message: 'renderingScene cannot be reassigned.'});
  }

  get userData() {
    return this.#userData;
  }

  set userData(value) {
    XcSysAssert({assertion: false, message: 'userData cannot be reassigned.'});
  }

  get undoEnabled() {
    return this.#undoEnabled;
  }

  set undoEnabled(v) {
    this.#undoEnabled = v;
    this.cleanRuntimeData();
  }

  static registerDrawableObjectType({cls}) {
    Xc3dDocDocument.#registeredDrawableObjectTypeClassMap.set(cls.name, cls);
  }

  static getDrawableObjectClassByType({className}) {
    return Xc3dDocDocument.#registeredDrawableObjectTypeClassMap.get(className);
  }

  static getRenderingObjectFromDrawableObject({drawableObject}) {
    const renderingObject = Xc3dDocDocument.#drawableObjectToRenderingObjectMap.get(drawableObject);
    return renderingObject;
  }

  static getDrawableObjectFromRenderingObject({renderingObject}) {
    const drawableObject = Xc3dDocDocument.#renderingObjectToDrawableObjectMap.get(renderingObject);
    return drawableObject;
  }

  static getDrawableObjectFromKernelEntity({kernelEntity}) {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity});
    const drawableObject = Xc3dDocDocument.#renderingObjectToDrawableObjectMap.get(renderingObject);
    return drawableObject;
  }

  static getRenderingObjectFromModelingKernelEntity({kernelEntity}) {
    const renderingObject = Xc3dDocDocument.#modelingKernelEntityToRenderingObjectMap.get(kernelEntity);
    return renderingObject;
  }

  static getModelingKernelEntityFromRenderingObject({renderingObject}) {
    const kernelEntity = Xc3dDocDocument.#renderingObjectToModelingKernelObjectMap.get(renderingObject);
    return kernelEntity;
  }

  static generateRenderingForBody({
                                    body,
                                    color,
                                    map = null,
                                    transparent = false,
                                    opacity = 1.0,
                                    showFace = true,
                                    showEdge = true,
                                    showVertex = true,
                                    renderingResolution = Xc3dDocDocument.RenderingResolution.High,
                                  }) {
    const bodyType = body._pkType;
    let pointSize = null;
    if (bodyType === XcGmBody._PKBodyType.SOLID) {
      pointSize = 1;
    } else if (bodyType === XcGmBody._PKBodyType.SHEET) {
      pointSize = 1;
    } else if (bodyType === XcGmBody._PKBodyType.WIRE) {
      pointSize = 1;
    } else if (bodyType === XcGmBody._PKBodyType.MINIMUM) {
      pointSize = 5;
    } else {
      pointSize = 5;
    }

    const renderingBody = new THREE.Group();

    // Set maps
    Xc3dDocDocument.#renderingObjectToModelingKernelObjectMap.set(renderingBody, body);
    Xc3dDocDocument.#modelingKernelEntityToRenderingObjectMap.set(body, renderingBody);

    // Faces
    body._pkFaces.forEach(face => {
      const renderingMesh = Xc3dDocDocument.generateMeshForFace({face, color, map, opacity, transparent, renderingResolution});
      renderingMesh.visible = showFace;

      // Set maps
      Xc3dDocDocument.#renderingObjectToModelingKernelObjectMap.set(renderingMesh, face);
      Xc3dDocDocument.#modelingKernelEntityToRenderingObjectMap.set(face, renderingMesh);

      renderingBody.add(renderingMesh);
    });

    // Edges
    body._pkEdges.forEach(edge => {
      const renderingLine = Xc3dDocDocument.generateLineForEdge({edge, color, renderingResolution});
      renderingLine.visible = showEdge;

      // Set maps
      Xc3dDocDocument.#renderingObjectToModelingKernelObjectMap.set(renderingLine, edge);
      Xc3dDocDocument.#modelingKernelEntityToRenderingObjectMap.set(edge, renderingLine);

      renderingBody.add(renderingLine);
    });

    // Vertices
    body._pkVertices.forEach(vertex => {
      const renderingPoint = Xc3dDocDocument.generatePointForVertex({vertex, color, size: pointSize});
      renderingPoint.visible = showVertex;

      // Set maps
      Xc3dDocDocument.#renderingObjectToModelingKernelObjectMap.set(renderingPoint, vertex);
      Xc3dDocDocument.#modelingKernelEntityToRenderingObjectMap.set(vertex, renderingPoint);

      renderingBody.add(renderingPoint);
    });

    return renderingBody;
  }

  static generateMeshForFace({face, color, map, opacity, transparent, renderingResolution = Xc3dDocDocument.RenderingResolution.High}) {
    let resolution = null;
    if (renderingResolution === Xc3dDocDocument.RenderingResolution.Low) {
      resolution = 'low';
    } else if (renderingResolution === Xc3dDocDocument.RenderingResolution.High) {
      resolution = 'high';
    } else {
      XcSysAssert({assertion: false, message: 'Unexpected facet type.'});
      resolution = 'high';
    }

    const _normalizeParameter = (uvBOX, parameter) => {
      parameter.x = (parameter.x - uvBOX.lowU) / (uvBOX.highU - uvBOX.lowU);
      parameter.y = (parameter.y - uvBOX.lowV) / (uvBOX.highV - uvBOX.lowV);
    }

    const allRenderingFacetData = face._pkRenderFacet({resolution});
    const geometry = new THREE.BufferGeometry();
    const uvBox = face.UVBox;
    const vertices = [];
    const vertexNormals = [];
    const parameters = [];
    const indices = [];
    let indexOffset = 0;

    allRenderingFacetData.forEach(renderingFacetData => {
      if (renderingFacetData.type === 'L3TPFI') {
        // Facet plus normals plus parameters
        for (let i = 0; i < renderingFacetData.facets.length; i += 1) {
          // For each _pkVertices in
          const facet = renderingFacetData.facets[i];
          const vertex = new THREE.Vector3(facet.point[0], facet.point[1], facet.point[2]);
          const normal = new THREE.Vector3(facet.normal[0], facet.normal[1], facet.normal[2]);
          const parameter = new THREE.Vector2(facet.parameter[0], facet.parameter[1]);
          _normalizeParameter(uvBox, parameter);

          vertices.push(vertex.x, vertex.y, vertex.z);
          vertexNormals.push(normal.x, normal.y, normal.z);
          parameters.push(parameter.x, parameter.y);
        }

        // Set indices
        for (let i = 0; i < renderingFacetData.facets.length - 2; i += 3) {
          indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
        }
        indexOffset += renderingFacetData.facets.length;
      } else if (renderingFacetData.type === 'L3TPTI') {
        // Facet strips plus normals plus parameters
        for (let i = 0; i < renderingFacetData.facets.length; i += 1) {
          // For each _pkVertices in
          const facet = renderingFacetData.facets[i];
          const vertex = new THREE.Vector3(facet.point[0], facet.point[1], facet.point[2]);
          const normal = new THREE.Vector3(facet.normal[0], facet.normal[1], facet.normal[2]);
          const parameter = new THREE.Vector2(facet.parameter[0], facet.parameter[1]);
          _normalizeParameter(uvBox, parameter);

          vertices.push(vertex.x, vertex.y, vertex.z);
          vertexNormals.push(normal.x, normal.y, normal.z);
          parameters.push(parameter.x, parameter.y);
        }

        // Set indices
        for (let i = 0; i < renderingFacetData.facets.length - 2; i += 1) {
          if ((i % 2) == 0) {
            indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
          } else {
            indices.push(indexOffset + i + 1, indexOffset + i, indexOffset + i + 2);
          }
        }

        indexOffset += renderingFacetData.facets.length;
      } else {
        XcSysAssert({assertion: false, message: 'Unexpected facet type.'});
      }
    });

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(vertexNormals), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(parameters), 2));
    
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    // Polygon offset: https://sites.google.com/site/threejstuts/home/polygon_offset
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      map,
      opacity,
      transparent,
      polygonOffset: true,
      polygonOffsetFactor: 0,
      polygonOffsetUnits: 1.0
    });
    const renderingMesh = new THREE.Mesh(geometry, material);

    return renderingMesh;
  }

  static generateLineForEdge({edge, color, renderingResolution = Xc3dDocDocument.RenderingResolution.High}) {
    let resolution = null;
    if (renderingResolution === Xc3dDocDocument.RenderingResolution.Low) {
      resolution = 0.0001;
    } else if (renderingResolution === Xc3dDocDocument.RenderingResolution.High) {
      resolution = 0.00001;
    } else {
      XcSysAssert({assertion: false, message: 'Invalid rendering resolution'});
      resolution = 0.00001;        
    }

    const allRenderingLineData = edge._pkRenderLine({resolution});
    const geometry = new THREE.BufferGeometry();

    XcSysAssert({assertion: allRenderingLineData.length === 1});

    const renderingLineData = allRenderingLineData[0];

    if (renderingLineData.type === 'L3TPSL') {
      // Straight lines
      const startPosition = new THREE.Vector3(
        renderingLineData.data.startPoint[0],
        renderingLineData.data.startPoint[1],
        renderingLineData.data.startPoint[2]);

      const endPosition = new THREE.Vector3(
        renderingLineData.data.endPoint[0],
        renderingLineData.data.endPoint[1],
        renderingLineData.data.endPoint[2]);

      const vertices = new Float32Array([
        ...startPosition.toArray(),
        ...endPosition.toArray(),
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    } else if (renderingLineData.type === 'L3TPPY') {
      // Polyline
      const vertices = [];
      for (let i = 0; i < renderingLineData.data.length; i += 1) {
        vertices.push(renderingLineData.data[i][0]);
        vertices.push(renderingLineData.data[i][1]);
        vertices.push(renderingLineData.data[i][2]);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    } else if (renderingLineData.type === 'L3TPCC') {
      // Complete circle
      const centerPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.centerPoint});
      const radius = renderingLineData.data.radius;
      const axisDir = XcGm3dVector.fromArray({array: renderingLineData.data.axisDir});
      const tmpVec = axisDir.clone();
      tmpVec.x += 0.1;
      tmpVec.y += 0.1;
      const xDir = tmpVec.crossProduct({vector: axisDir}).normal;
      const yDir = axisDir.crossProduct({vector: xDir}).normal;

      const vertices = [];
      for (let param = 0; param <= (Math.PI * 2); param += resolution) {
        const x = centerPosition.x + radius * (Math.cos(param) * xDir.x + Math.sin(param) * yDir.x);
        const y = centerPosition.y + radius * (Math.cos(param) * xDir.y + Math.sin(param) * yDir.y);
        const z = centerPosition.z + radius * (Math.cos(param) * xDir.z + Math.sin(param) * yDir.z);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    } else if (renderingLineData.type === 'L3TPCI') {
      // Partial circle
      const startPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.startPoint});
      const endPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.endPoint});
      const centerPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.centerPoint});
      const axisDir = XcGm3dVector.fromArray({array: renderingLineData.data.axisDir});
      const radius = renderingLineData.data.radius;

      const xDir = XcGm3dPosition.subtract({
        position: startPosition.toVector(),
        positionOrVector: centerPosition.toVector()
      }).normal;
      const yDir = axisDir.crossProduct({vector: xDir}).normal;

      const endVec = XcGm3dPosition.subtract({
        position: endPosition.toVector(),
        positionOrVector: centerPosition.toVector()
      }).normal;

      const rotationAngle = xDir.rotationAngleTo({vector: endVec, axis: axisDir});

      const vertices = [];
      for (let param = 0; param <= rotationAngle; param += resolution) {
        const x = centerPosition.x + radius * (Math.cos(param) * xDir.x + Math.sin(param) * yDir.x);
        const y = centerPosition.y + radius * (Math.cos(param) * xDir.y + Math.sin(param) * yDir.y);
        const z = centerPosition.z + radius * (Math.cos(param) * xDir.z + Math.sin(param) * yDir.z);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    } else if (renderingLineData.type === 'L3TPCE') {
      // Complete ellipse
      const centerPoint = XcGm3dPosition.fromArray({array: renderingLineData.data.centerPoint});
      const majorRadius = renderingLineData.data.majorRadius;
      const minorRadius = renderingLineData.data.minorRadius;
      const majorAxisDir = XcGm3dVector.fromArray({array: renderingLineData.data.majorAxisDir});
      const minorAxisDir = XcGm3dVector.fromArray({array: renderingLineData.data.minorAxisDir});

      const vertices = [];
      for (let param = 0; param <= (Math.PI * 2); param += resolution) {
        const x = centerPoint.x + majorRadius * Math.cos(param) * majorAxisDir.x + minorRadius * Math.sin(param) * minorAxisDir.x;
        const y = centerPoint.y + majorRadius * Math.cos(param) * majorAxisDir.y + minorRadius * Math.sin(param) * minorAxisDir.y;
        const z = centerPoint.z + majorRadius * Math.cos(param) * majorAxisDir.z + minorRadius * Math.sin(param) * minorAxisDir.z;
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    } else if (renderingLineData.type === 'L3TPEL') {
      // Partial ellipse
      const centerPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.centerPoint});
      const majorRadius = renderingLineData.data.majorRadius;
      const minorRadius = renderingLineData.data.minorRadius;
      const majorAxisDir = XcGm3dVector.fromArray({array: renderingLineData.data.majorAxisDir});
      const minorAxisDir = XcGm3dVector.fromArray({array: renderingLineData.data.minorAxisDir});
      const startPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.startPoint});
      const endPosition = XcGm3dPosition.fromArray({array: renderingLineData.data.endPoint});

      const normalVec = majorAxisDir.crossProduct({vector: minorAxisDir});

      // Map everything to a unit-circle to calculate the parameter (angle).
      // This is because the mapping of the ellipse arc's parameter space and arc points is not uniform.
      const worldCoordinateSystem = new XcGm3dCoordinateSystem();
      const ellipseCoordinateSystem = new XcGm3dCoordinateSystem({
        origin: centerPosition,
        zAxisDirection: normalVec,
        xAxisDirection: majorAxisDir,
      });
      const ellipseToWorldTransform = ellipseCoordinateSystem.computeTransformToCoordinateSystem({
        coordinateSystem: worldCoordinateSystem
      });
      startPosition.transform({matrix: ellipseToWorldTransform});
      endPosition.transform({matrix: ellipseToWorldTransform});
      const xAxisDirection = new XcGm3dVector({x: 1, y: 0, z: 0});
      const zAxisDirection = new XcGm3dVector({x: 0, y: 0, z: 1});
      const startVector = new XcGm3dVector({
        x: startPosition.x / majorRadius,
        y: startPosition.y / minorRadius,
        z: startPosition.z
      });
      const startAngle = xAxisDirection.rotationAngleTo({vector: startVector, axis: zAxisDirection});
      const endVector = new XcGm3dVector({
        x: endPosition.x / majorRadius,
        y: endPosition.y / minorRadius,
        z: endPosition.z
      });
      let endAngle = xAxisDirection.rotationAngleTo({vector: endVector, axis: zAxisDirection});

      if (endAngle < startAngle) {
        endAngle = Math.PI * 2 - startAngle;
      }

      const vertices = [];
      for (let param = startAngle; param <= endAngle; param += resolution) {
        const x = centerPosition.x + majorRadius * Math.cos(param) * majorAxisDir.x + minorRadius * Math.sin(param) * minorAxisDir.x;
        const y = centerPosition.y + majorRadius * Math.cos(param) * majorAxisDir.y + minorRadius * Math.sin(param) * minorAxisDir.y;
        const z = centerPosition.z + majorRadius * Math.cos(param) * majorAxisDir.z + minorRadius * Math.sin(param) * minorAxisDir.z;
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    } else {
      console.error(renderingLineData.type, 'Not supported _pkEdges. To be implemented!');
    }

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const material = new THREE.LineBasicMaterial({color, linewidth: 1});

    const renderingLine = new THREE.Line(geometry, material);

    return renderingLine;
  }

  static generatePointForVertex({vertex, color, size = 1}) {
    const geometry = new THREE.BufferGeometry();
    const position = vertex.point.position;

    const vertices = new Float32Array([position.x, position.y, position.z]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color,
      size,
      sizeAttenuation: false
    });

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const renderingPoint = new THREE.Points(geometry, material);

    return renderingPoint;
  }

  static load({json, filePath}) {
    const document = new Xc3dDocDocument({filePath});

    const fileVersion = json.fileVersion;
    XcSysAssert({
      assertion: fileVersion >= 0,
      message: 'Load file error: Incompatible file format: File version is not available.'
    });

    // Load textures first
    json.textures.forEach(textureData => {
      const texture = Xc3dDocTexture.load({json: textureData.textureJSON, document});
      document.#textures.add(texture);

      const objectID = textureData.objectID;
      document.#idToObjectMap.set(objectID, texture);
      document.#objectToIDMap.set(texture, objectID);
    });

    json.drawableObjects.forEach(drawableObjectData => {
      const className = drawableObjectData.drawableObjectClassName;
      const json = drawableObjectData.drawableObjectJSON;
      const drawableObjectCls = Xc3dDocDocument.getDrawableObjectClassByType({className});
      XcSysAssert({
        assertion: drawableObjectCls,
        message: 'Load file error: Some custom object types are not registered.'
      });
      const drawableObject = drawableObjectCls.load({json, document});

      // Generate undo delta data, but don't setup undo steps data,
      // since we don't want to undo this loaded data.
      document.#undoDeltas.push(new Xc3dDocOperationDelta({
        type: Xc3dDocOperationDelta.OPERATION_TYPE.LOAD,
        drawableObject: drawableObject
      }));

      document.#addDrawableObject({drawableObject});

      const objectID = drawableObjectData.objectID;
      document.#idToObjectMap.set(objectID, drawableObject);
      document.#objectToIDMap.set(drawableObject, objectID);
    });

    document.#userData = json.userData;

    return document;
  }

  get textures() {
  return [...this.#textures];
  }

  get drawableObjects() {
    return [...this.#drawableObjects];
  }

  cleanRuntimeData() {
    this.#undoDeltas.length = 0;
    this.#redoDeltas.length = 0;
    this.#undoSteps.length = 0;
    this.#redoSteps.length = 0;

    this.#isInEditTransaction = false;
    this.#currentTransactionSteps = 0;
  }

  #addDrawableObject({drawableObject}) {
    XcSysAssert({assertion: !this.#drawableObjects.includes(drawableObject), message: 'Object has been added already.'});

    const renderingObject = drawableObject.generateRenderingObject();

    this.#renderingScene.add(renderingObject);
    this.#drawableObjects.push(drawableObject);

    // Set maps
    Xc3dDocDocument.#drawableObjectToRenderingObjectMap.set(drawableObject, renderingObject);

    renderingObject.traverse((obj) => Xc3dDocDocument.#renderingObjectToDrawableObjectMap.set(obj, drawableObject));
  }

  #disposeRendering (renderingObject) {
    renderingObject.traverse(obj=> {
      if (obj.geometry) {
        obj.geometry.dispose();
        obj.geometry = null;
      }

      if (obj.material) {
        obj.material.dispose();
        obj.material = null;
      }
    });
  }

  #removeDrawableObject({drawableObject}) {
    XcSysAssert({assertion: this.#drawableObjects.includes(drawableObject), message: 'Object not found.'});

    const index = this.#drawableObjects.indexOf(drawableObject);
    this.#drawableObjects.splice(index, 1);

    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
    this.#renderingScene.remove(renderingObject);
    this.#disposeRendering(renderingObject);
  }

  #modifyDrawableObject({drawableObject}) {
    // Remove old data
    let renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
    this.#renderingScene.remove(renderingObject);
    this.#disposeRendering(renderingObject);

    // Generate new data
    renderingObject = drawableObject.generateRenderingObject();

    this.#renderingScene.add(renderingObject);

    // Set maps
    Xc3dDocDocument.#drawableObjectToRenderingObjectMap.set(drawableObject, renderingObject);

    renderingObject.traverse((obj) => {
      Xc3dDocDocument.#renderingObjectToDrawableObjectMap.set(obj, drawableObject);
    });
  }

  addDrawableObject({drawableObject}) {
    if (this.#undoEnabled) {
      // Record undo
      this.#undoDeltas.push(new Xc3dDocOperationDelta({
        operationType: Xc3dDocOperationDelta.OPERATION_TYPE.ADD,
        drawableObject,
      }));

      if (this.#isInEditTransaction) {
        ++this.#currentTransactionSteps;
      } else {
        this.#redoDeltas.length = 0;
        this.#undoSteps.push(1);
        this.#redoSteps.length = 0;
      }
    }
    
    const objectID = uuid.v4();
    this.#idToObjectMap.set(objectID, drawableObject);
    this.#objectToIDMap.set(drawableObject, objectID);

    this.#addDrawableObject({drawableObject});

    return objectID;
  }

  removeDrawableObject({drawableObject}) {
    if (this.#undoEnabled) {
      // Record undo
      this.#undoDeltas.push(new Xc3dDocOperationDelta({
        operationType: Xc3dDocOperationDelta.OPERATION_TYPE.REMOVE,
        drawableObject,
      }));

      if (this.#isInEditTransaction) {
        ++this.#currentTransactionSteps;
      } else {
        this.#redoDeltas.length = 0;
        this.#undoSteps.push(1);
        this.#redoSteps.length = 0;
      }
    }

    const objectID = this.#idToObjectMap.get(drawableObject);
    this.#objectToIDMap.delete(drawableObject);
    this.#idToObjectMap.delete(objectID);

    this.#removeDrawableObject({drawableObject});
  }

  modifyDrawableObject({drawableObject}) {
    XcSysAssert({assertion: this.getObjectID({object: drawableObject}), message: 'drawableObject is not found.'});
    
    if (this.#undoEnabled) {
      // Record undo
      this.#undoDeltas.push(new Xc3dDocOperationDelta({
        operationType: Xc3dDocOperationDelta.OPERATION_TYPE.MODIFY,
        drawableObject,
      }));

      if (this.#isInEditTransaction) {
        ++this.#currentTransactionSteps;
      } else {
        this.#redoDeltas.length = 0;
        this.#undoSteps.push(1);
        this.#redoSteps.length = 0;
      }
    }

    this.#modifyDrawableObject({drawableObject});
  }

  startTransaction() {
    this.#isInEditTransaction = true;
    this.#currentTransactionSteps = 0;
  }

  endTransaction() {
    XcSysAssert({assertion: this.#isInEditTransaction, message: 'startTransaction is not called.'});

    this.#redoDeltas.length = 0;
    this.#undoSteps.push(this.#currentTransactionSteps);
    this.#redoSteps.length = 0;

    this.#isInEditTransaction = false;
    this.#currentTransactionSteps = 0;
  }

  addTexture({texture}) {
    XcSysAssert({assertion: !this.#textures.includes(texture), message: 'Object not found.'});

    const objectID = uuid.v4();
    this.#idToObjectMap.set(objectID, texture);
    this.#objectToIDMap.set(texture, objectID);

    this.#textures.push(texture);
  }

  removeTexture({texture}) {
    XcSysAssert({assertion: this.#textures.includes(texture), message: 'Object not found.'});
    const objectID = this.#idToObjectMap.get(texture);
    this.#objectToIDMap.delete(texture);
    this.#idToObjectMap.delete(objectID);

    const index = this.#textures.indexOf(texture);
    this.#textures.splice(index, 1);
  }

  getObjectID({object}) {
    return this.#objectToIDMap.get(object);
  }

  getObjectById({id}) {
    return this.#idToObjectMap.get(id);
  }

  queryDrawableObjectsByName({name}) {
    return this.#drawableObjects.filter((value)=> {
      return value.name === name;
    });
  }

  #undo() {
    XcSysAssert({assertion: this.#undoDeltas.length > 0});
    const lastDelta = this.#undoDeltas.pop();
    switch (lastDelta.operationType) {
      case Xc3dDocOperationDelta.OPERATION_TYPE.ADD: {
        this.#redoDeltas.unshift(lastDelta);
        this.#removeDrawableObject({drawableObject: lastDelta.drawableObject});
      }
        break;
      case Xc3dDocOperationDelta.OPERATION_TYPE.MODIFY: {
        this.#redoDeltas.unshift(lastDelta);

        for (let i = this.#undoDeltas.length - 1; i >= 0; i -= 1) {
          if (this.#undoDeltas[i].drawableObject === lastDelta.drawableObject) {
            lastDelta.drawableObject.copy({other: this.#undoDeltas[i].clonedDrawableObject});
            this.#modifyDrawableObject({drawableObject: lastDelta.drawableObject});
            break;
          }
        }
      }
        break;
      case Xc3dDocOperationDelta.OPERATION_TYPE.REMOVE: {
        this.#redoDeltas.unshift(lastDelta);
        lastDelta.drawableObject.copy({other: lastDelta.clonedDrawableObject});
        this.#addDrawableObject({drawableObject: lastDelta.drawableObject});
      }
        break;
      default:
        XcSysAssert({assertion: false});
        break;
    }
  }

  undo() {
    if (this.#undoSteps.length === 0) {
      return false;
    }

    const lastUndoSteps = this.#undoSteps.pop();
    this.#redoSteps.unshift(lastUndoSteps);
    for (let i = 0; i < lastUndoSteps; i += 1) {
      this.#undo();
    }

    return true;
  }

  #redo() {
    XcSysAssert({assertion: this.#redoDeltas.length > 0});
    const lastDelta = this.#redoDeltas.shift();
    switch (lastDelta.operationType) {
      case Xc3dDocOperationDelta.OPERATION_TYPE.ADD: {
        this.#undoDeltas.push(lastDelta);
        this.#addDrawableObject({drawableObject: lastDelta.drawableObject});

      }
        break;
      case Xc3dDocOperationDelta.OPERATION_TYPE.MODIFY: {
        this.#undoDeltas.push(lastDelta);
        lastDelta.drawableObject.copy({other: lastDelta.clonedDrawableObject});
        this.#modifyDrawableObject({drawableObject: lastDelta.drawableObject});
      }
        break;
      case Xc3dDocOperationDelta.OPERATION_TYPE.REMOVE: {
        this.#undoDeltas.push(lastDelta);
        this.#removeDrawableObject({drawableObject: lastDelta.drawableObject});
      }
        break;
      default:
        break;
    }
  }

  redo() {
    if (this.#redoSteps.length === 0) {
      return false;
    }

    const lastRedoSteps = this.#redoSteps.shift();
    this.#undoSteps.push(lastRedoSteps);
    for (let i = 0; i < lastRedoSteps; i += 1) {
      this.#redo();
    }

    return true;
  }

  notifyCollaborators() {
    // todo
  }

  save() {
    const documentJSON = {
      fileVersion: Xc3dDocDocument.fileVersion,
      drawableObjects: [],
      textures: [],
      userData: this.userData
    };

    this.#drawableObjects.forEach(drawableObject => {
      const drawableObjectClassName = drawableObject.constructor.name;
      const drawableObjectJSON = drawableObject.save({document: this});
      const objectID = this.getObjectID({object: drawableObject});
      documentJSON.drawableObjects.push({
        drawableObjectClassName,
        drawableObjectJSON,
        objectID,
      });
    });

    this.#textures.forEach(texture => {
      const textureJSON = texture.toJSON();
      const objectID = this.getObjectID({object: texture});
      documentJSON.textures.push({
        textureJSON,
        objectID,
      });

    });

    return documentJSON;
  }
}
