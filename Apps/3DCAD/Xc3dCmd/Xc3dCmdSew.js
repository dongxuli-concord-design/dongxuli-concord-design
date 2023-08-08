class Xc3dCmdSew {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFirstBody: Symbol('WaitForFirstBody'),
    WaitForSecondBody: Symbol('WaitForSecondBody')
  };

  #i18n;
  #state;
  #firstBody;
  #secondBody;
  #firstModel;
  #secondModel;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdSew.#CommandState.WaitForFirstBody;
    this.#firstBody = null;
    this.#secondBody = null;
    this.#firstModel = null;
    this.#secondModel = null;
    this.#highlightingRenderingObjects = [];

    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdSew();
    const ret = yield* cmd.run();
    return ret;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Please specify main object': '请指定主物体',
      'Please specify tool object': '请指定工具物体',
      'Please select a body which is different with the first one.': '请选择与第一个不同的体',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdSew.#CommandState.Done) && (this.#state !== Xc3dCmdSew.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdSew.#CommandState.WaitForFirstBody:
          this.#state = yield* this.#onWaitForFirstBody();
          break;
        case Xc3dCmdSew.#CommandState.WaitForSecondBody:
          this.#state = yield* this.#onWaitForSecondBody();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    // Unhighlight everything
    this.#highlightingRenderingObjects.forEach(renderingObject => Xc3dUIManager.removeCustomRenderingObject({renderingObject}));
    this.#highlightingRenderingObjects.length = 0;

    if (this.#state === Xc3dCmdSew.#CommandState.Done) {
      const targetBody = this.#firstBody;
      const toolBody = this.#secondBody;

      Xc3dUIManager.document.startTransaction();
      Xc3dUIManager.document.removeDrawableObject({drawableObject: this.#firstModel});
      Xc3dUIManager.document.removeDrawableObject({drawableObject: this.#secondModel});

      try {
        const {sewnBodies, unSewnBodies} = XcGmBody.sew({bodies: [targetBody, toolBody], gapWidthBound: 1e-2});

        for (let i = 0; i < sewnBodies.length; i += 1) {
          const newModel = new Xc3dDocModel({body: sewnBodies[i]});
          Xc3dUIManager.document.addDrawableObject({drawableObject: newModel});
        }

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Sew operation cannot be accomplished.`);
      } finally {
        Xc3dUIManager.document.endTransaction();
      }
    }

    return this.#state;
  }

  * #onWaitForFirstBody() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Please specify main object`,
      filter: (object) => {
        if (object instanceof Xc3dDocModel) {
          if (object.body.type === XcGmBody.BODY_TYPE.SHEET) {
            return true;
          } else {
            return false;
          }  
        } else {
          return false;
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdSew.#CommandState.WaitForFirstBody;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdSew.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#firstBody = drawableObject.body;
      this.#firstModel = drawableObject;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
      this.#highlightingRenderingObjects.push(highlightingRenderingObject);

      Xc3dUIManager.redraw();
      return Xc3dCmdSew.#CommandState.WaitForSecondBody;
    }
  }

  * #onWaitForSecondBody() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Please specify tool object`,
      filter: (object) => {
        if (object instanceof Xc3dDocModel) {
          if (object.body.type === XcGmBody.BODY_TYPE.SHEET) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSew.#CommandState.Cancel;
    }

    const body = drawableObject.body;

    if (body === this.#firstBody) {
      XcSysManager.outputDisplay.warn(this.#i18n.T`Please select a body which is different with the first one.`);
      return Xc3dCmdSew.#CommandState.WaitForSecondBody;
    } else {
      this.#secondBody = body;
      this.#secondModel = drawableObject;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
      this.#highlightingRenderingObjects.push(highlightingRenderingObject);

      Xc3dUIManager.redraw();

      return Xc3dCmdSew.#CommandState.Done;
    }
  }
}

