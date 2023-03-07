class Xc3dCmd3DPrint {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'), 
    WaitForLocation: Symbol('WaitForLocation')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
  };

  #pathName;
  #state;
  #i18n;
  #uiContext;

  constructor() {
    const fs = require('fs');
    const path = require('path');
    this.#pathName = path.dirname(Xc3dApp.filePath);

    this.#state = Xc3dCmd3DPrint.#CommandState.WaitForLocation;

    this.#initI18n();

    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Ok`;
    doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmd3DPrint.#Event.Done}));
    widgets.push(doneButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmd3DPrint.#Event.Cancel}));
    widgets.push(cancelButton);

    const fileLocationDisplay = document.createElement('textarea');
    fileLocationDisplay.setAttribute('rows', '3');
    fileLocationDisplay.setAttribute('cols', '20');
    fileLocationDisplay.setAttribute('readonly', true);
    fileLocationDisplay.style.resize = 'none';
    fileLocationDisplay.innerHTML = this.#pathName;
    widgets.push(fileLocationDisplay);

    const fileChooser = document.createElement('input');
    fileChooser.setAttribute('type', 'file');
    fileChooser.setAttribute('data-id', 'filedialog');
    fileChooser.setAttribute('nwdirectory', '');
    fileChooser.style.display ='none';
    widgets.push(fileChooser);

    const fileChooseButton = document.createElement('button');
    fileChooseButton.innerHTML = this.#i18n.T`Change export location`;
    fileChooseButton.addEventListener('click', (event) => {
      fileChooser.addEventListener('change', (event) => {
        if (event.target.value) {
          this.#pathName = event.target.value;
          fileLocationDisplay.innerHTML = this.#pathName;
        }
      }, false);

      fileChooser.click();
    });
    widgets.push(fileChooseButton);

    this.#uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Please specify export location`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });
  }

  static *command() {
    const cmd = new Xc3dCmd3DPrint();
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

      'Internal error: Cannot export STL for {0}.': '内部错误：不能把{0}导出为STL文件。',
      'Internal error: Not supported data type.': '内部错误：不支持的数据类型。',
      'Internal error: cannot write to file.': '内部错误：写入文件失败。',
      'Exported STL to {0}.': '输出STL到{0}目录中。',
      'Please specify export location': '请指定导出目录',
      'Skip unsupported model': '忽略不支持的模型',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  // http://www.fabbers.com/tech/STL_Format
  // https://all3dp.com/what-is-stl-file-format-extension-3d-printing/
  #exportToSTL(model, folder, index) {
    const fs = require('fs');
    const path = require('path');

    const stlFileString = model.body.toSTL();

    fs.writeFile(`${folder}${path.sep}${index}-${model.name}.stl`, stlFileString, function (error) {
      if (error) {
        XcSysManager.outputDisplay.error(this.#i18n.T`Internal error: cannot write to file.`);
      }
    });
  }

  * #onWaitForLocation() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmd3DPrint.#Event.Cancel, Xc3dCmd3DPrint.#Event.Done],
    });
    if (event === Xc3dCmd3DPrint.#Event.Cancel) {
      return Xc3dCmd3DPrint.#CommandState.Cancel;
    } else if (event === Xc3dCmd3DPrint.#Event.Done) {
      return Xc3dCmd3DPrint.#CommandState.Done;
    } else {
      return Xc3dCmd3DPrint.#CommandState.WaitForLocation;
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmd3DPrint.#CommandState.Done) && (this.#state !== Xc3dCmd3DPrint.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmd3DPrint.#CommandState.WaitForLocation:
          this.#state = yield* this.#onWaitForLocation();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmd3DPrint.#CommandState.Done) {
      Xc3dUIManager.document.drawableObjects.forEach((drawableObject, index) => {
        if (drawableObject instanceof Xc3dDocModel) {
          const type = drawableObject.body.type;
          if ((type === XcGmBody.BODY_TYPE.SOLID) || (type === XcGmBody.BODY_TYPE.SHEET)) {
            this.#exportToSTL(drawableObject, this.#pathName, index);
          } else {
            XcSysManager.outputDisplay.info(this.#i18n.T`Skip unsupported model`);
          }
        } else {
          XcSysManager.outputDisplay.info(this.#i18n.T`Skip unsupported model`);
        }
      });

      XcSysManager.outputDisplay.info(this.#i18n.T`Exported STL to ${this.#pathName}.`);
    }
  }
}
