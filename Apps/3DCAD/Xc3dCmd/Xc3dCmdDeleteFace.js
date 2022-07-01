class Xc3dCmdDeleteFace {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFaces: Symbol('WaitForFaces')
  };

  #i18n;
  #state;
  #body;
  #model;
  #faces;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdDeleteFace.#CommandState.WaitForFaces;
    this.#body = null;
    this.#model = null;
    this.#faces = [];
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

      'Select faces to delete': '选择要删除的面',
      'Please select all faces from one body.': '请从一个体上选择面。',
      'Unsupported model type': '不支持的实体类型',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdDeleteFace();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdDeleteFace.#CommandState.Done) && (this.#state !== Xc3dCmdDeleteFace.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdDeleteFace.#CommandState.WaitForFaces:
          this.#state = yield* this.#onWaitForFaces();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    // Unhighlight everything
    for (const highlightingRenderingObjects of this.#highlightingRenderingObjects) {
      Xc3dUIManager.unHighlight({object: highlightingRenderingObjects});
    }
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdDeleteFace.#CommandState.Done) {
      XcGmFace.delete({faces: this.#faces});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForFaces() {
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Select faces to delete`,
      type: Xc3dUIManager.PICK_TYPE.FACE,
      allowReturnNull: this.#faces.length
    });

    const face = value;

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        if (this.#faces.length === 0) {
          return Xc3dCmdDeleteFace.#CommandState.Cancel;
        } else {
          return Xc3dCmdDeleteFace.#CommandState.Done;
        }
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdDeleteFace.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      let drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: face});
      if (!(drawableObject instanceof Xc3dDocModel)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Unsupported model type`);
        return Xc3dCmdDeleteFace.#CommandState.WaitForFaces;
      }

      const body = face.body;
      if ( this.#body && (body !== this.#body)) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select all faces from one body.`);
        return Xc3dCmdDeleteFace.#CommandState.WaitForFaces;
      }

      this.#faces.push(face);

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity: face});
      const highlightingRenderingObjects = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObjects});
      this.#highlightingRenderingObjects.push(highlightingRenderingObjects);

      Xc3dUIManager.redraw();
      return Xc3dCmdDeleteFace.#CommandState.WaitForFaces;
    }
  }
}
