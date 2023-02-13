class Xc3dCmdSweep {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForProfile: Symbol('WaitForProfile'),
    WaitForPath: Symbol('WaitForPath'),
    WaitForStartVertex: Symbol('WaitForStartVertex'),
  };

  #i18n;
  #state;
  #profile;
  #path;
  #startVertex;
  #hints;
  #vertexPositionRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdSweep.#CommandState.WaitForProfile;
    this.#profile = null;
    this.#path = null;
    this.#startVertex = null;
    this.#hints = new THREE.Group();
    this.#vertexPositionRenderingObjects = new THREE.Group();

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdSweep();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdSweep.#CommandState.Done) && (this.#state !== Xc3dCmdSweep.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdSweep.#CommandState.WaitForProfile:
          this.#state = yield* this.#onWaitForProfile();
          break;
        case Xc3dCmdSweep.#CommandState.WaitForPath:
          this.#state = yield* this.#onWaitForPath();
          break;
        case Xc3dCmdSweep.#CommandState.WaitForStartVertex:
          this.#state = yield* this.#onWaitForStartVertex();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});

    if (this.#state === Xc3dCmdSweep.#CommandState.Done) {
      const profileBodies = [this.#profile.body];
      const pathBody = this.#path.body;
      const pathVertices = [this.#startVertex];
      const body = XcGmBody.sweep({profiles: profileBodies, path: pathBody, pathVertices});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body, color: new THREE.Color('rgb(220, 220, 220)')})});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForProfile() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select a profile`,
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSweep.#CommandState.Cancel;
    } else {
      this.#profile = drawableObject;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      this.#hints.add(highlightingRenderingObject);

      Xc3dUIManager.redraw();
      return Xc3dCmdSweep.#CommandState.WaitForPath;
    }
  }

  * #onWaitForPath() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select a path`,
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSweep.#CommandState.Cancel;
    } else {
      this.#path = drawableObject;

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

      return Xc3dCmdSweep.#CommandState.WaitForStartVertex;
    }
  }

  * #onWaitForStartVertex() {
    const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: this.#path});

    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Please specify start vertex`,
      type: Xc3dUIManager.PICK_TYPE.VERTEX,
      targetRenderingObjects: [renderingObjectOfDrawable],
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSweep.#CommandState.Cancel;
    } else {
      this.#startVertex = value;
      return Xc3dCmdSweep.#CommandState.Done;
    }
  }
}
