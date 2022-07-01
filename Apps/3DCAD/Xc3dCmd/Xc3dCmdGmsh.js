class Xc3dCmdGmsh {
  static #State = {
    Cancel: Symbol('Cancel'),
    Done: Symbol('Done'),

    WaitForNodes: Symbol('WaitForNodes'),
    WaitForNodeLine1: Symbol('WaitForNodeLine1'), //entity bloc, 6 nodes total, min/max node tags
    WaitForNodeGroup: Symbol('WaitForNodeGroup'), //entity type, parametric coordinates set, nodes number
    WaitForNodeTags: Symbol('WaitForNodeTags'), //node tags
    WaitForNodeCoordinates: Symbol('WaitForNodeCoordinates'), //node coordinates
    WaitForNodesEndOrNodeGroup: Symbol('WaitForNodesEndOrNodeGroup'),

    WaitForElements: Symbol('WaitForElements'),
    WaitForElementsLine1: Symbol('WaitForElementsLine1'), //entity bloc, elements total, min/max element tags
    WaitForElementGroup: Symbol('WaitForElementGroup'), //entity type, element type, elements number
    WaitForElementNodes: Symbol('WaitForElementNodes'), //Elements
    WaitForElementsEndOrElementGroup: Symbol('WaitForElementsEndOrElementGroup'),
  };

  renderingObject;

  #state;
  #lineArray;
  #lineIndex;
  #currentNodeNum;
  #currentNodeTags;
  #currentElementNum;
  #currentElementType;

  #nodes;
  #nodeTagToIndexMap;
  #elements;

  constructor({text = ""} = {}) {
    this.renderingObject = new THREE.Group();

    this.#state = Xc3dCmdGmsh.#State.WaitForNodes;

    this.#lineIndex = 0;
    const lines = text.split(/\r?\n/);
    const trimmedLines = lines.map(line => line.trim());
    this.#lineArray = trimmedLines.filter(line => line !== '');

    this.#currentNodeNum = 0;
    this.#currentNodeTags = [];
    this.#currentNodeNum = 0;
    this.#currentElementType = 0;

    this.#nodes = [];
    this.#elements = new Map();
    this.#nodeTagToIndexMap = new Map();
  }

  * run() {
    while ((this.#state !== Xc3dCmdGmsh.#State.Cancel) && (this.#state !== Xc3dCmdGmsh.#State.Done)) {
      switch (this.#state) {
        case Xc3dCmdGmsh.#State.WaitForNodes:
          this.#state = yield* this.#onWaitForNodes();
          break;
        case Xc3dCmdGmsh.#State.WaitForNodeLine1:
          this.#state = yield* this.#onWaitForNodeLine1();
          break;
        case Xc3dCmdGmsh.#State.WaitForNodeGroup:
          this.#state = yield* this.#onWaitForNodeGroup();
          break;
        case Xc3dCmdGmsh.#State.WaitForNodeTags:
          this.#state = yield* this.#onWaitForNodeTags();
          break;
        case Xc3dCmdGmsh.#State.WaitForNodeCoordinates:
          this.#state = yield* this.#onWaitForNodeCoordinates();
          break;
        case Xc3dCmdGmsh.#State.WaitForNodesEndOrNodeGroup:
          this.#state = yield* this.#onWaitForNodesEndOrNodeGroup();
          break;
        case Xc3dCmdGmsh.#State.WaitForElements:
          this.#state = yield* this.#onWaitForElements();
          break;
        case Xc3dCmdGmsh.#State.WaitForElementsLine1:
          this.#state = yield* this.#onWaitForElementsLine1();
          break;
        case Xc3dCmdGmsh.#State.WaitForElementGroup:
          this.#state = yield* this.#onWaitForElementGroup();
          break;
        case Xc3dCmdGmsh.#State.WaitForElementNodes:
          this.#state = yield* this.#onWaitForElementNodes();
          break;
        case Xc3dCmdGmsh.#State.WaitForElementsEndOrElementGroup:
          this.#state = yield* this.#onWaitForElementsEndOrElementGroup();
          break;
        default:
          XcSysAssert({assertion: false, message: `Internal command state error`});
          break;
      }
    }
  }

  #stepOver() {
    XcSysAssert({assertion: this.#lineIndex < this.#lineArray.length - 1});
    this.#lineIndex += 1;
  }

  #getNodeNumFromElementType({elementType, elements}) {
    switch (elementType) {
      case 1: // 2-node line.
      {
        XcSysAssert({assertion: elements.length === 2 + 1});
        const verticesData = [];
        for (let j = 1; j < 2 + 1; j += 1) {
          const nodeTag = parseInt(elements[j]);
          const nodeIndex = this.#nodeTagToIndexMap.get(nodeTag);
          const nodeCoordinate = this.#nodes[nodeIndex].coordinate;
          verticesData.push(...nodeCoordinate.toArray());
        }

        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(0x0000ff),
          polygonOffset: true,
          polygonOffsetFactor: -5.0,
          polygonOffsetUnits: -5.0
        });
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(verticesData);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const renderingObject = new THREE.Line(geometry, material);
        return renderingObject;
      }
      case 2: // 3-node triangle
      {
        XcSysAssert({assertion: elements.length === 3 + 1});
        const verticesData = [];
        for (let j = 1; j < 3 + 1; j += 1) {
          const nodeTag = parseInt(elements[j]);
          const nodeIndex = this.#nodeTagToIndexMap.get(nodeTag);
          const nodeCoordinate = this.#nodes[nodeIndex].coordinate;
          verticesData.push(...nodeCoordinate.toArray());
        }

        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(0x0000ff),
          polygonOffset: true,
          polygonOffsetFactor: -5.0,
          polygonOffsetUnits: -5.0
        });
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(verticesData);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const renderingObject = new THREE.LineLoop(geometry, material);
        return renderingObject;
      }
      case 3: // 4-node quadrangle
      {
        XcSysAssert({assertion: elements.length === 4 + 1});
        const verticesData = [];
        for (let j = 1; j < 4 + 1; j += 1) {
          const nodeTag = parseInt(elements[j]);
          const nodeIndex = this.#nodeTagToIndexMap.get(nodeTag);
          const nodeCoordinate = this.#nodes[nodeIndex].coordinate;
          verticesData.push(...nodeCoordinate.toArray());
        }

        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(0x0000ff),
          polygonOffset: true,
          polygonOffsetFactor: -5.0,
          polygonOffsetUnits: -5.0
        });
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(verticesData);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const renderingObject = new THREE.LineLoop(geometry, material);
        return renderingObject;
      }
      case 4: // 4-node tetrahedron
        return null;
      case 5: // 8-node hexahedron
        return null;
      case 6: // 6-node prism
        return null;
      case 7: // 5-node pyramid.
        return null;
      case 8: // 3-node second order line (2 nodes associated with the vertices and 1 with the edge)
        return null;
      case 9: // 6-node second order triangle (3 nodes associated with the vertices and 3 with the edges).
        return null;
      case 10: // 9-node second order quadrangle (4 nodes associated with the vertices, 4 with the edges and 1 with the face).
        return null;
      case 11: // 10-node second order tetrahedron (4 nodes associated with the vertices and 6 with the edges).
        return null;
      case 12: // 27-node second order hexahedron (8 nodes associated with the vertices, 12 with the edges, 6 with the faces and 1 with the volume).
        return null;
      case 12: // 18-node second order prism (6 nodes associated with the vertices, 9 with the edges and 3 with the quadrangular faces).
        return null;
      case 14: // 14-node second order pyramid (5 nodes associated with the vertices, 8 with the edges and 1 with the quadrangular face).
        return null;
      case 15: // 1-node point.
      {
        XcSysAssert({assertion: elements.length === 1 + 1});
        const verticesData = [];
        for (let j = 1; j < 1 + 1; j += 1) {
          const nodeTag = parseInt(elements[j]);
          const nodeIndex = this.#nodeTagToIndexMap.get(nodeTag);
          const nodeCoordinate = this.#nodes[nodeIndex].coordinate;
          verticesData.push(...nodeCoordinate.toArray());
        }

        const material = new THREE.PointsMaterial({
          color: new THREE.Color(0x0000ff),
          size: 10,
          sizeAttenuation: false,
        });
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(verticesData);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const renderingObject = new THREE.Points(geometry, material);
        return renderingObject;
      }
      case 16: // 8-node second order quadrangle (4 nodes associated with the vertices and 4 with the edges).
        return null;
      case 17: // 20-node second order hexahedron (8 nodes associated with the vertices and 12 with the edges).
        return null;
      case 18: // 15-node second order prism (6 nodes associated with the vertices and 9 with the edges).
        return null;
      case 19: // 13-node second order pyramid (5 nodes associated with the vertices and 8 with the edges).
        return null;
      case 20: // 9-node third order incomplete triangle (3 nodes associated with the vertices, 6 with the edges)
        return null;
      case 21: // 10-node third order triangle (3 nodes associated with the vertices, 6 with the edges, 1 with the face)
        return null;
      case 22: // 12-node fourth order incomplete triangle (3 nodes associated with the vertices, 9 with the edges)
        return null;
      case 23: // 15-node fourth order triangle (3 nodes associated with the vertices, 9 with the edges, 3 with the face)
        return null;
      case 24: // 15-node fifth order incomplete triangle (3 nodes associated with the vertices, 12 with the edges)
        return null;
      case 25: // 21-node fifth order complete triangle (3 nodes associated with the vertices, 12 with the edges, 6 with the face)
        return null;
      case 26: // 4-node third order edge (2 nodes associated with the vertices, 2 internal to the edge)
        return null;
      case 27: // 5-node fourth order edge (2 nodes associated with the vertices, 3 internal to the edge)
        return null;
      case 28: // 6-node fifth order edge (2 nodes associated with the vertices, 4 internal to the edge)
        return null;
      case 29: // 20-node third order tetrahedron (4 nodes associated with the vertices, 12 with the edges, 4 with the faces)
        return null;
      case 30: // 35-node fourth order tetrahedron (4 nodes associated with the vertices, 18 with the edges, 12 with the faces, 1 in the volume)
        return null;
      case 31: // 56-node fifth order tetrahedron (4 nodes associated with the vertices, 24 with the edges, 24 with the faces, 4 in the volume)
        return null;
      case 92: // 64-node third order hexahedron (8 nodes associated with the vertices, 24 with the edges, 24 with the faces, 8 in the volume)
        return null;
      case 93: // 125-node fourth order hexahedron (8 nodes associated with the vertices, 36 with the edges, 54 with the faces, 27 in the volume)
        return null;
      default:
        XcSysAssert({assertion: false});
    }
  }

  *#onWaitForNodes() {
    while (this.#lineIndex < this.#lineArray.length) {
      const line = this.#lineArray[this.#lineIndex];
      if (line === '$Nodes') {
        break;
      }
      this.#stepOver();
    }

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForNodeLine1;
  }

  *#onWaitForNodeLine1() {
    const line = this.#lineArray[this.#lineIndex];
    const elements = line.split(/\s+/);
    XcSysAssert({assertion: elements.length === 4});

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForNodeGroup;
  }

  *#onWaitForNodeGroup() {
    const line = this.#lineArray[this.#lineIndex];
    const elements = line.split(/\s+/);
    XcSysAssert({assertion: elements.length === 4});
    this.#currentNodeNum = parseInt(elements[3]);

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForNodeTags;
  }

  *#onWaitForNodeTags() {
    this.#currentNodeTags.length = 0;
    for (let i = 0; i < this.#currentNodeNum; i += 1) {
      const line = this.#lineArray[this.#lineIndex + i];
      const nodeTag = parseInt(line);
      this.#currentNodeTags.push(nodeTag);
    }

    this.#lineIndex += this.#currentNodeNum;
    return Xc3dCmdGmsh.#State.WaitForNodeCoordinates;
  }

  *#onWaitForNodeCoordinates() {
    for (let i = 0; i < this.#currentNodeNum; i += 1) {
      const line = this.#lineArray[this.#lineIndex + i];
      const elements = line.split(/\s+/);
      XcSysAssert({assertion: elements.length === 3});

      const x = parseFloat(elements[0]);
      const y = parseFloat(elements[1]);
      const z = parseFloat(elements[2]);

      const tag = this.#currentNodeTags[i];
      const coordinate = new XcGm3dPosition({x, y, z});
      this.#nodes.push({
        tag,
        coordinate,
      });
      this.#nodeTagToIndexMap.set(tag, this.#nodes.length-1);
    }

    this.#lineIndex += this.#currentNodeNum;

    return Xc3dCmdGmsh.#State.WaitForNodesEndOrNodeGroup;
  }

  *#onWaitForNodesEndOrNodeGroup() {
    const line = this.#lineArray[this.#lineIndex];
    if (line === '$EndNodes') {
      this.#stepOver();
      return Xc3dCmdGmsh.#State.WaitForElements;
    } else {
      return Xc3dCmdGmsh.#State.WaitForNodeGroup;
    }
  }

  *#onWaitForElements() {
    const line = this.#lineArray[this.#lineIndex];
    XcSysAssert({assertion: line === '$Elements'});

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForElementsLine1;
  }

  *#onWaitForElementsLine1() {
    const line = this.#lineArray[this.#lineIndex];
    const elements = line.split(/\s+/);
    XcSysAssert({assertion: elements.length === 4});

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForElementGroup;
  }

  *#onWaitForElementGroup() {
    const line = this.#lineArray[this.#lineIndex];
    const elements = line.split(/\s+/);
    XcSysAssert({assertion: elements.length === 4});
    this.#currentElementType = parseInt(elements[2]);
    this.#currentElementNum = parseInt(elements[3]);

    this.#stepOver();
    return Xc3dCmdGmsh.#State.WaitForElementNodes;
  }

  *#onWaitForElementNodes() {
    for (let i = 0; i < this.#currentElementNum; i += 1) {
      const line = this.#lineArray[this.#lineIndex + i];
      const elements = line.split(/\s+/);
      const renderingObject = this.#getNodeNumFromElementType({elementType: this.#currentElementType, elements});
      this.renderingObject.add(renderingObject);
    }

    this.#lineIndex += this.#currentElementNum;

    return Xc3dCmdGmsh.#State.WaitForElementsEndOrElementGroup;
  }

  *#onWaitForElementsEndOrElementGroup() {
    const line = this.#lineArray[this.#lineIndex];
    if (line === '$EndElements') {
      return Xc3dCmdGmsh.#State.Done;
    } else {
      return Xc3dCmdGmsh.#State.WaitForElementGroup;
    }
  }
}
