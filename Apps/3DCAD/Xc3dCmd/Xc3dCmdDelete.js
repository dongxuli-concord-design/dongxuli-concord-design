class Xc3dCmdDelete {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForObject: Symbol('WaitForObject')
  };

  #i18n;
  #state;

  constructor() {
    this.#state = Xc3dCmdDelete.#CommandState.WaitForObject;

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Select object to delete': '选择要删除的物体',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdDelete();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdDelete.#CommandState.Done) && (this.#state !== Xc3dCmdDelete.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdDelete.#CommandState.WaitForObject:
          this.#state = yield* this.#onWaitForObject();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    return this.#state;
  }

  * #onWaitForObject() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select object to delete`,
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdDelete.#CommandState.Done;
    } else {
      Xc3dUIManager.document.removeDrawableObject({drawableObject: drawableObject});
      Xc3dUIManager.redraw();
      return Xc3dCmdDelete.#CommandState.WaitForObject;
    }
  }
}
