class Xc3dCmdBoolean {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFirstBody: Symbol('WaitForFirstBody'),
    WaitForSecondBody: Symbol('WaitForSecondBody'),
    WaitForBooleanType: Symbol('WaitForBooleanType')
  };

  #state;
  #firstBody;
  #secondBody;
  #firstModel;
  #secondModel;
  #booleanType;
  #highlightingRenderingObjects;
  #i18n;

  constructor() {
    this.#state = Xc3dCmdBoolean.#CommandState.WaitForFirstBody;
    this.#firstBody = null;
    this.#secondBody = null;
    this.#firstModel = null;
    this.#secondModel = null;
    this.#booleanType = XcGmBody.BooleanFunction.Union;
    this.#highlightingRenderingObjects = [];

    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdBoolean();
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

      'Boolean operation cannot be accomplished.': '布尔运算无法正确地完成。',
      'Please specify main object': '请指定主物体',
      'Please specify tool object': '请指定工具物体',
      'Please select a body which is different with the first one.': '请选择一个不同的物体。',
      'Boolean operation mode': '布尔运算模式',
      'Union': '合并',
      'Subtraction': '相减',
      'Intersection': '相交',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdBoolean.#CommandState.Done) && (this.#state !== Xc3dCmdBoolean.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdBoolean.#CommandState.WaitForFirstBody:
          this.#state = yield* this.#onWaitForFirstBody();
          break;
        case Xc3dCmdBoolean.#CommandState.WaitForSecondBody:
          this.#state = yield* this.#onWaitForSecondBody();
          break;
        case Xc3dCmdBoolean.#CommandState.WaitForBooleanType:
          this.#state = yield* this.#onWaitForBooleanType();
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

    if (this.#state === Xc3dCmdBoolean.#CommandState.Done) {
      const targetBody = this.#firstBody;
      const toolBody = this.#secondBody;

      Xc3dUIManager.document.startTransaction();
      Xc3dUIManager.document.removeDrawableObject({drawableObject: this.#firstModel});
      Xc3dUIManager.document.removeDrawableObject({drawableObject: this.#secondModel});

      try {
        const resultBodies = targetBody.boolean({tools: [toolBody], func: this.#booleanType});

        for (let i = 0; i < resultBodies.length; i += 1) {
          const newModel = new Xc3dDocModel({body: resultBodies[i]});
          newModel.setAttributesFrom({model: this.#firstModel});

          Xc3dUIManager.document.addDrawableObject({drawableObject: newModel});
        }

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Boolean operation cannot be accomplished.`);
      } finally {
        Xc3dUIManager.document.endTransaction();
      }
    }

    return this.#state;
  }

  * #onWaitForFirstBody() {
    // TODO: use GetBody!
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Please specify main object`,
      filter: (object) => {
        return object instanceof Xc3dDocModel;
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdBoolean.#CommandState.WaitForFirstBody;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdBoolean.#CommandState.Cancel;
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
      return Xc3dCmdBoolean.#CommandState.WaitForSecondBody;
    }
  }

  * #onWaitForSecondBody() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Please specify tool object`,
      filter: (object) => {
        return object instanceof Xc3dDocModel;
      }
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdBoolean.#CommandState.WaitForSecondBody;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdBoolean.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      const body = drawableObject.body;

      if (body === this.#firstBody) {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select a body which is different with the first one.`);
        return Xc3dCmdBoolean.#CommandState.WaitForSecondBody;
      } else {
        this.#secondBody = body;
        this.#secondModel = drawableObject;

        const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
        const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
        Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
        this.#highlightingRenderingObjects.push(highlightingRenderingObject);

        Xc3dUIManager.redraw();
        return Xc3dCmdBoolean.#CommandState.WaitForBooleanType;
      }
    }
  }

  * #onWaitForBooleanType() {
    const {inputState, choice} = yield* Xc3dUIManager.getChoice({
      prompt: this.#i18n.T`Boolean operation mode`,
      choices: [this.#i18n.T`Union`, this.#i18n.T`Subtraction`, this.#i18n.T`Intersection`]
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdBoolean.#CommandState.WaitForBooleanType;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdBoolean.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      switch (choice) {
        case 0:
          this.#booleanType = XcGmBody.BooleanFunction.Union;
          break;
        case 1:
          this.#booleanType = XcGmBody.BooleanFunction.Subtraction;
          break;
        case 2:
          this.#booleanType = XcGmBody.BooleanFunction.Intersection;
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
      return Xc3dCmdBoolean.#CommandState.Done;
    }
  }
}
