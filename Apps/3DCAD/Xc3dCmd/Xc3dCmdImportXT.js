class Xc3dCmdImportXT {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFile: Symbol('WaitForFile')
  };

  #i18n;
  #state;

  constructor() {
    this.#state = Xc3dCmdImportXT.#CommandState.WaitForFile;

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
    const cmd = new Xc3dCmdImportXT();
    const ret = yield* cmd.run();
    return ret;
  }

  #importXT({filePath}) {
    const parts = XcGmPart._pkReceiveFromFile({filePath});
    parts.forEach((body) => {
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body, color: new THREE.Color('rgb(220, 220, 220)')})});
    });
    Xc3dUIManager.redraw();
  }

  * #onWaitForFile() {
    const {inputState, files} = yield* Xc3dUIManager.getFile({
      prompt: this.#i18n.T`Please specify file to import`,
      accept: '.x_t',
    });
    if (inputState === Xc3dUIInputState.eInputNormal) {
      const filePath = files[0].path;
      this.#importXT({filePath});
      XcSysManager.outputDisplay.info(this.#i18n.T`Imported ${filePath}.`);
      return Xc3dCmdImportXT.#CommandState.WaitForFile;
    } else {
      return Xc3dCmdImportXT.#CommandState.Cancel;
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdImportXT.#CommandState.Done) && (this.#state !== Xc3dCmdImportXT.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdImportXT.#CommandState.WaitForFile:
          this.#state = yield* this.#onWaitForFile();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }
  }
}
