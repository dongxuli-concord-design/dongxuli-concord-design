class Xc3dCmdProgrammableModel {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForCode: Symbol('WaitForCode'),
  };

  static #Event = {
    Quit: Symbol('Quit'),
  };

  #i18n;
  #state;
  #hints;
  #renderingObjectGroup;

  constructor() {
    this.#initI18n();
    this.#hints = new THREE.Group();
    this.#renderingObjectGroup = new THREE.Group();
    this.#hints.add(this.#renderingObjectGroup);

    this.#state = Xc3dCmdProgrammableModel.#CommandState.WaitForCode;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'OK': '确定',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdProgrammableModel();
    const ret = yield* cmd.run();
    return ret;
  }

  * #onWaitForCode() {
    const {inputState, object} = yield* Xc3dUIManager.getObject({prompt: this.#i18n.T`Please update code and run`});
    if (inputState === Xc3dUIInputState.eInputCancel) {
      return Xc3dCmdProgrammableModel.#CommandState.Quit;
    } else if ((inputState === Xc3dUIInputState.eInputNormal) || (inputState === Xc3dUIInputState.eInputTest)) {
      if (typeof object === 'function') {
        const func = object;
        let drawableObjects = null;
        try {
          drawableObjects = func();
        } catch (error) {
          XcSysManager.outputDisplay.error(error.toString());
          return Xc3dCmdProgrammableModel.#CommandState.WaitForCode;
        }

        this.#renderingObjectGroup.remove(...this.#renderingObjectGroup.children);

        if (inputState === Xc3dUIInputState.eInputNormal) {
          drawableObjects.forEach(drawableObject => Xc3dUIManager.document.addDrawableObject({drawableObject}));
          Xc3dUIManager.redraw();
          return Xc3dCmdProgrammableModel.#CommandState.Quit;
        } else {
          drawableObjects.forEach(drawableObject => {
            const renderingObject = drawableObject.generateRenderingObject();
            this.#renderingObjectGroup.add(renderingObject);            
          });

          Xc3dUIManager.redraw();
          return Xc3dCmdProgrammableModel.#CommandState.WaitForCode;
        }
      } else {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dCmdProgrammableModel.#CommandState.WaitForCode;
      }
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while (this.#state !== Xc3dCmdProgrammableModel.#CommandState.Quit) {
      switch (this.#state) {
        case Xc3dCmdProgrammableModel.#CommandState.WaitForCode:
          this.#state = yield* this.#onWaitForCode();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();
  }
}
