class Xc3dCmdCode {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForCode: Symbol('WaitForCode'),
  };

  static #Event = {
    Quit: Symbol('Quit'),
  };

  #i18n;
  #state;

  constructor() {
    this.#initI18n();
    this.#state = Xc3dCmdCode.#CommandState.WaitForCode;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'OK': '确定',
      'Please update code and run': '请输入代码并运行',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdCode();
    const ret = yield* cmd.run();
    return ret;
  }

  * #onWaitForCode() {
    const {inputState, object} = yield* Xc3dUIManager.getObject({prompt: this.#i18n.T`Please update code and run`});
    if (inputState === Xc3dUIInputState.eInputCancel) {
      return Xc3dCmdCode.#CommandState.Quit;
    } else if ((inputState === Xc3dUIInputState.eInputNormal) || (inputState === Xc3dUIInputState.eInputTest)) {
      if (typeof object === 'function') {
        const func = object;
        try {
          yield* func();
        } catch (error) {
          XcSysManager.outputDisplay.error(error.toString());
        }

        if (inputState === Xc3dUIInputState.eInputNormal) {
          return Xc3dCmdCode.#CommandState.Quit;
        } else {
          return Xc3dCmdCode.#CommandState.WaitForCode;
        }
      } else {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dCmdCode.#CommandState.WaitForCode;
      }
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * run() {
    while (this.#state !== Xc3dCmdCode.#CommandState.Quit) {
      switch (this.#state) {
        case Xc3dCmdCode.#CommandState.WaitForCode:
          this.#state = yield* this.#onWaitForCode();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.redraw();
  }
}
