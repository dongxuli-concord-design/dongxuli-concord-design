class Xc3dCmdExportSTL {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'), 
    WaitForDirectory: Symbol('WaitForDirectory')
  };

  #state;
  #i18n;

  constructor() {
    this.#state = Xc3dCmdExportSTL.#CommandState.WaitForDirectory;
    this.#initI18n();
  }

  static *command() {
    const cmd = new Xc3dCmdExportSTL();
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
  #exportDrawableObjectToSTL({drawableObject, directory, index}) {
    const fs = require('fs');
    const path = require('path');

    const stlFileString = drawableObject.body._pkToSTL();

    fs.writeFile(`${directory}${path.sep}${index}-${drawableObject.name}.stl`, stlFileString, function (error) {
      if (error) {
        XcSysManager.outputDisplay.error(this.#i18n.T`Internal error: cannot write to file.`);
      }
    });
  }
  
  #exportDrawableObjects({directory}) {
    Xc3dUIManager.document.drawableObjects.forEach((drawableObject, index) => {
      if (drawableObject instanceof Xc3dDocModel) {
        const type = drawableObject.body._pkType;
        if ((type === XcGmBody._PKBodyType.SOLID) || (type === XcGmBody._PKBodyType.SHEET)) {
          this.#exportDrawableObjectToSTL({drawableObject, directory, index});
        } else {
          XcSysManager.outputDisplay.info(this.#i18n.T`Skip unsupported model`);
        }
      } else {
        XcSysManager.outputDisplay.info(this.#i18n.T`Skip unsupported model`);
      }
    });

    XcSysManager.outputDisplay.info(this.#i18n.T`Exported STL to ${directory}.`);
  }

  * #onWaitForDirectory() {
    const path = require('path');
    const workingFolder = path.dirname(Xc3dApp.filePath);

    const {inputState, files} = yield* Xc3dUIManager.getFile({
      prompt: this.#i18n.T`Please specify export location`,
      directory: true,
      workingdir: workingFolder,
    });
    if (inputState === Xc3dUIInputState.eInputNormal) {
      const directory = files[0].path;
      this.#exportDrawableObjects({directory});
      return Xc3dCmdExportSTL.#CommandState.Done;
    } else {
      return Xc3dCmdExportSTL.#CommandState.Cancel;
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdExportSTL.#CommandState.Done) && (this.#state !== Xc3dCmdExportSTL.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdExportSTL.#CommandState.WaitForDirectory:
          this.#state = yield* this.#onWaitForDirectory();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }
  }
}
