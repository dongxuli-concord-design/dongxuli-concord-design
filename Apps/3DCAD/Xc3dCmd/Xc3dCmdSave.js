class Xc3dCmdSave {
  #i18n;

  constructor() {
    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'File has been saved': '文件已保存',
      'File cannot been saved': '文件无法保存',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdSave();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    try {
      const documentData = Xc3dUIManager.document.save();

      const fileData = {
        appName: Xc3dApp.appName,
        appVersion: Xc3dApp.appVersion,
        appUserData: Xc3dApp.appUserData,
        documentData
      };
      const fileDataString = JSON.stringify(fileData, null, '\t');

      const fs = require('fs');
      fs.writeFileSync(Xc3dApp.filePath, fileDataString);
      XcSysManager.outputDisplay.info(this.#i18n.T`File has been saved`);
    } catch (error) {
      XcSysManager.outputDisplay.error(this.#i18n.T`File has been saved`, error);
    }
  }
}
