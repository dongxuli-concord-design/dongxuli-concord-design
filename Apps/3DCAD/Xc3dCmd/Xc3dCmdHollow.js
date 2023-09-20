class Xc3dCmdHollow {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForBody: Symbol('WaitForBody'),
    WaitForFaces: Symbol('WaitForFaces'),
    WaitForOffset: Symbol('WaitForOffset')
  };

  #i18n;
  #state;
  #body;
  #model;
  #faces;
  #offset;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdHollow.#CommandState.WaitForFaces;
    this.#body = null;
    this.#model = null;
    this.#faces = [];
    this.#offset = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 10.0});
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

      'Specify the face of the body to be hollowed': '指定要抽壳的面',
      'Please select all faces from one body.': '请选取同一个实体上的面',
      'Unsupported model type': '不支持的实体类型',
      'Offset distance': '偏移距离',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdHollow();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdHollow.#CommandState.Done) && (this.#state !== Xc3dCmdHollow.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdHollow.#CommandState.WaitForFaces:
          this.#state = yield* this.#onWaitForFaces();
          break;
        case Xc3dCmdHollow.#CommandState.WaitForOffset:
          this.#state = yield* this.#onWaitForOffset();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    // Unhighlight everything
    this.#highlightingRenderingObjects.forEach((renderingObject) => {
      Xc3dUIManager.removeCustomRenderingObject({renderingObject});
    });
    this.#highlightingRenderingObjects.length = 0;
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdHollow.#CommandState.Done) {
      const error = this.#body._pkHollowFaces({faces: this.#faces, offset: this.#offset});
      if (!error) {
        Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
        Xc3dUIManager.redraw();
      }
    }

    return this.#state;
  }

  * #onWaitForFaces() {
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Specify the face of the body to be hollowed`,
      type: Xc3dUIManager.PICK_TYPE.FACE,
      allowReturnNull: this.#faces.length
    });

    const face = value;

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        if (this.#faces.length === 0) {
          return Xc3dCmdHollow.#CommandState.Cancel;
        } else {
          return Xc3dCmdHollow.#CommandState.WaitForOffset;
        }
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdHollow.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      let drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: face});

      if (!(drawableObject instanceof Xc3dDocModel)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Unsupported model type`);
        return Xc3dCmdHollow.#CommandState.WaitForFaces;
      }

      const body = face.body;

      if ( this.#body && (body !== this.#body)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select all faces from one body.`);
        return Xc3dCmdHollow.#CommandState.WaitForFaces;
      }

      this.#body = body;
      this.#model = drawableObject;

      this.#faces.push(face);

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity: face});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
      this.#highlightingRenderingObjects.push(highlightingRenderingObject);
      Xc3dUIManager.redraw();

      return Xc3dCmdHollow.#CommandState.WaitForFaces;
    }
  }

  * #onWaitForOffset() {
    const {inputState, distance} = yield* Xc3dUIManager.getDistance({prompt: this.#i18n.T`Offset distance`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdHollow.#CommandState.Cancel;
    } else {
      this.#offset = distance;
      return Xc3dCmdHollow.#CommandState.Done;
    }
  }
}
