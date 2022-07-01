class Xc3dCmdFillet {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForEdges: Symbol('WaitForEdges'),
    WaitForRadius: Symbol('WaitForRadius')
  };

  #i18n;
  #state;
  #body;
  #model;
  #edges;
  #radius;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdFillet.#CommandState.WaitForEdges;
    this.#body = null;
    this.#model = null;
    this.#edges = [];
    this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 20.0});
    this.#highlightingRenderingObjects = [];

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Select edges': '选择边',
      'Please select all edges from a solid body.': '请从同一个实体上选择边。',
      'Unsupported model type': '不支持的实体类型',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdFillet();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdFillet.#CommandState.Done) && (this.#state !== Xc3dCmdFillet.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdFillet.#CommandState.WaitForEdges:
          this.#state = yield* this.#onWaitForEdges();
          break;
        case Xc3dCmdFillet.#CommandState.WaitForRadius:
          this.#state = yield* this.#onWaitForRadius();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    // Unhighlight everything
    for (const renderingObject of this.#highlightingRenderingObjects) {
      Xc3dUIManager.removeCustomRenderingObject({renderingObject});
    }
    this.#highlightingRenderingObjects.length = 0;
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdFillet.#CommandState.Done) {
      XcGmEdge.setBlendConstantFor({edges: this.#edges, radius: this.#radius});
      this.#body.fixBlends();
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForEdges() {
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Select edges`,
      type: Xc3dUIManager.PICK_TYPE.EDGE,
      allowReturnNull: this.#edges.length
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        if (this.#edges.length === 0) {
          return Xc3dCmdFillet.#CommandState.Cancel;
        } else {
          return Xc3dCmdFillet.#CommandState.WaitForRadius;
        }
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdFillet.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      const edge = value;
      const drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: edge});
      if (!(drawableObject instanceof Xc3dDocModel)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Unsupported model type`);
        return Xc3dCmdFillet.#CommandState.WaitForEdges;
      }

      const body = edge.body;
      if (body.type !== XcGmBody.BODY_TYPE.SOLID) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select all edges from a solid body.`);
        return Xc3dCmdFillet.#CommandState.WaitForEdges;
      }

      if ( this.#body && (body !== this.#body)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select all edges from a solid body.`);
        return Xc3dCmdFillet.#CommandState.WaitForEdges;
      }

      this.#body = body;
      this.#model = drawableObject;
      this.#edges.push(value);

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity: value});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
      this.#highlightingRenderingObjects.push(highlightingRenderingObject);

      Xc3dUIManager.redraw();

      return Xc3dCmdFillet.#CommandState.WaitForEdges;
    }
  }

  * #onWaitForRadius() {
    const {inputState, distance} = yield* Xc3dUIManager.getDistance({prompt: this.#i18n.T`Radius`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        this.#radius = 0.2;
        return Xc3dCmdFillet.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdFillet.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#radius = distance;
      return Xc3dCmdFillet.#CommandState.Done;
    }
  }
}
