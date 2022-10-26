class Xc3dCmdExport {
  static #Event = {
    Quit: Symbol('Quit'),
    Next: Symbol('Next')
  };

  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPath: Symbol('WaitForPath'),
    WaitForObject: Symbol('WaitForObject')
  };

  #i18n;
  #state;
  #path;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdExport.#CommandState.WaitForPath;
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
        case Xc3dCmdExport.#CommandState.WaitForPath:
          this.#state = yield* this.#onWaitForPath();
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

  * #onWaitForPath() {
    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdExport.#Event.Quit});
    });
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdExport.#Event.Next});
    });
    widgets.push(nextButton);

    const path = this.#i18n.T`Path`;
    const pathInput = document.createElement('label');
    pathInput.innerHTML = `${path} <input type="text" value="${this.#path}">`;
    widgets.push(pathInput);

    this.#uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Please input path`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmdExport.#Event.Next, Xc3dCmdExport.#Event.Quit]
    });

    if (event === Xc3dCmdExport.#Event.Next) {
      this.#path = pathInput.querySelector('input').value;
      return Xc3dCmdExport.#CommandState.WaitForObject;
    } else if (event === Xc3dCmdExport.#Event.Quit) {
      return Xc3dCmdExport.#CommandState.Cancel;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForObject() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select object to export`,
      filter: (object) => {
        return object instanceof Xc3dDocModel;
      }
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
