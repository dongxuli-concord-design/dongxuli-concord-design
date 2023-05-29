class Xc3dCmdExport {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFile: Symbol('WaitForFile'),
    WaitForObject: Symbol('WaitForObject')
  };

  #i18n;
  #state;
  #path;

  constructor() {
    this.#state = Xc3dCmdExport.#CommandState.WaitForFile;
    this.#path = '/tmp/model';

    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdExport();
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

      'Path': '目标文件名',
      'Select object to export': '选择要导出的物体',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdExport.#CommandState.Done) && (this.#state !== Xc3dCmdExport.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdExport.#CommandState.WaitForFile:
          this.#state = yield* this.#onWaitForFile();
          break;
        case Xc3dCmdExport.#CommandState.WaitForObject:
          this.#state = yield* this.#onWaitForObject();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    return this.#state;
  }

  * #onWaitForFile() {
    const path = require('path');
    const workingFolder = path.dirname(Xc3dApp.filePath);

    const {inputState, files} = yield* Xc3dUIManager.getFile({
      prompt: this.#i18n.T`Please input path`,
      nwsaveas: 'export.x_t',
      nwworkingdir: workingFolder,
    });
    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#path = files[0].path;
      return Xc3dCmdExport.#CommandState.WaitForObject;
    } else {
      return Xc3dCmdExport.#CommandState.Cancel;
    }
  }

  * #onWaitForObject() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select object to export`,
      filter: (object) => object instanceof Xc3dDocModel,
    });
    if (inputState === Xc3dUIInputState.eInputNormal) {
      const body = drawableObject.body;
      XcGmPart.transmitToFile({parts: [body], path: this.#path});
      return Xc3dCmdExport.#CommandState.Done;
    } else {
      return Xc3dCmdExport.#CommandState.Cancel;
    }
  }
}
