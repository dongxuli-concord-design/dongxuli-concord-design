class Xc3dCmdImportXT {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForLocation: Symbol('WaitForLocation')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
  };

  #i18n;
  #pathName;
  #state;
  #uiContext;

  constructor() {
    const fs = require('fs');
    const path = require('path');
    this.#pathName = path.dirname(Xc3dApp.filePath);

    this.#state = Xc3dCmdImportXT.#CommandState.WaitForLocation;

    this.#initI18n();

    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Ok`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdImportXT.#Event.Done});
    });
    widgets.push(doneButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdImportXT.#Event.Cancel});
    });
    widgets.push(cancelButton);

    const fileLocationDisplay = document.createElement('textarea');
    fileLocationDisplay.setAttribute('rows', '3');
    fileLocationDisplay.setAttribute('cols', '20');
    fileLocationDisplay.setAttribute('readonly', true);
    fileLocationDisplay.style.resize = "none";
    fileLocationDisplay.innerHTML = this.#pathName;
    widgets.push(fileLocationDisplay);

    const fileChooser = document.createElement('input');
    fileChooser.setAttribute('type', 'file');
    fileChooser.setAttribute('data-id', 'filedialog');
    fileChooser.style.display = "none";
    widgets.push(fileChooser);

    const fileChooseButton = document.createElement('button');
    fileChooseButton.innerHTML = this.#i18n.T`Select file`;
    fileChooseButton.addEventListener('click', (event) => {
      fileChooser.addEventListener("change", (event) => {
        if (event.target.value) {
          this.#pathName = event.target.value;
          fileLocationDisplay.innerHTML = this.#pathName;
        }
      }, false);

      fileChooser.click();
    });
    widgets.push(fileChooseButton);

    this.#uiContext = new XcSysContext({
      prompt: this.#i18n.T`Please specify file to import`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });
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

  #importXT(fileName) {
    const parts = XcGmPart.receiveFromFile({fileName});
    for (const body of parts) {
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body})});
    }
    Xc3dUIManager.redraw();
  }

  * #onWaitForLocation() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmdImportXT.#Event.Cancel, Xc3dCmdImportXT.#Event.Done]
    });
    if (event === Xc3dCmdImportXT.#Event.Cancel) {
      return Xc3dCmdImportXT.#CommandState.Cancel;
    } else if (event === Xc3dCmdImportXT.#Event.Done) {
      return Xc3dCmdImportXT.#CommandState.Done;
    } else {
      return Xc3dCmdImportXT.#CommandState.WaitForLocation;
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdImportXT.#CommandState.Done) && (this.#state !== Xc3dCmdImportXT.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdImportXT.#CommandState.WaitForLocation:
          this.#state = yield* this.#onWaitForLocation();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdImportXT.#CommandState.Done) {
      this.#importXT(this.#pathName);
      XcSysManager.outputDisplay.info(this.#i18n.T`Imported ${this.#pathName}.`);
    }
  }
}
