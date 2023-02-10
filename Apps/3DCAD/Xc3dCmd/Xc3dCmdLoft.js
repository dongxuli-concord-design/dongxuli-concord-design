class Xc3dCmdLoft {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForProfile: Symbol('WaitForProfile'),
    WaitForStartVertex: Symbol('WaitForStartVertex'),
  };

  static #Event = {
    Cancel: Symbol('Cancel')
  };

  #i18n;
  #state;
  #profiles;
  #startVertices;
  #hints;
  #vertexPositionRenderingObjects;

  constructor() {
    this.#initI18n();

    this.#state = Xc3dCmdLoft.#CommandState.WaitForProfile;
    this.#profiles = [];
    this.#startVertices = [];
    this.#hints = new THREE.Group();
    this.#vertexPositionRenderingObjects = new THREE.Group();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Done': '退出',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdLoft();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdLoft.#CommandState.Done) && (this.#state !== Xc3dCmdLoft.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdLoft.#CommandState.WaitForProfile:
          this.#state = yield* this.#onWaitForProfile();
          break;
        case Xc3dCmdLoft.#CommandState.WaitForStartVertex:
          this.#state = yield* this.#onWaitForStartVertex();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdLoft.#CommandState.Done) {
      const profileBodies = [];
      for (const profile of this.#profiles) {
        const profileBody = profile.body;
        profileBodies.push(profileBody);
      }
      const guideWires = [];
      const body = XcGmBody.loft({profiles: profileBodies, startVertices: this.#startVertices, guideWires});

      Xc3dUIManager.document.addDrawableObject({drawableObject:  new Xc3dDocModel({body})});
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForProfile() {
    // Clean all existing start vertex hints
    this.#vertexPositionRenderingObjects.remove(...this.#vertexPositionRenderingObjects.children)
    Xc3dUIManager.redraw();

    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select profile`,
      allowReturnNull: true
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdLoft.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdLoft.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#profiles.push(drawableObject);

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      this.#hints.add(highlightingRenderingObject);

      for (const [i, vertex] of drawableObject.body.vertices.entries()) {
        const position = vertex.point.position;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([...position.toArray()]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({
          color: new THREE.Color('Purple'),
          size: 10,
          sizeAttenuation: false
        });
        const renderingObject = new THREE.Points(geometry, material);
        renderingObject.userData.vertexID = i;
        renderingObject.userData.vertex = vertex;
        renderingObject.userData.section = drawableObject;
        this.#vertexPositionRenderingObjects.add(renderingObject);
      }
      this.#hints.add(this.#vertexPositionRenderingObjects);
      Xc3dUIManager.redraw();
      
      return Xc3dCmdLoft.#CommandState.WaitForStartVertex;
    }
  }

  * #onWaitForStartVertex() {
    const lastProfile = this.#profiles[this.#profiles.length - 1];
    const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: lastProfile});

    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Please specify the first vertex`,
      type: Xc3dUIManager.PICK_TYPE.VERTEX,
      targetRenderingObjects: [renderingObjectOfDrawable],
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdLoft.#CommandState.Cancel;
    } else {
      const startVertex = value;
      this.#startVertices.push(startVertex);

      this.#hints.remove(this.#vertexPositionRenderingObjects);

      for (let i = this.#vertexPositionRenderingObjects.children.length - 1; i >= 0; i -= 1) {
        if (this.#vertexPositionRenderingObjects.children[i].userData.vertex === startVertex) {
          this.#hints.add(this.#vertexPositionRenderingObjects.children[i]);
          break;
        }
      }

      // Find the edge
      const edgesWithStartVertex = lastProfile.body.findEdge({callback: (edge) => ((edge.vertices.vertex1 === startVertex) || (edge.vertices.vertex2 === startVertex))});
      XcSysAssert({assertion: edgesWithStartVertex.length > 0});
      const edgeWithStartVertex = edgesWithStartVertex[0];
      if (startVertex !== edgeWithStartVertex.vertices.vertex1) {
        XcGmEdge.reverse({edges: [edgeWithStartVertex]});
      }
      edgeWithStartVertex.propagateOrientation();

      const renderingObjectOfVertex = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity: startVertex});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfVertex});
      this.#hints.add(highlightingRenderingObject);
      Xc3dUIManager.redraw();

      return Xc3dCmdLoft.#CommandState.WaitForProfile;
    }
  }
}
