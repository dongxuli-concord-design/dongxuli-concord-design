class Xc3dCmdRedo {
  #i18n;

  constructor() {
    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'No redo action.': '没有可重做的动作',
      'Redo actions': '重做动作',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdRedo();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    const returnValue = Xc3dUIManager.document.redo();
    if (returnValue) {
      Xc3dUIManager.redraw();
      XcSysManager.outputDisplay.log(this.#i18n.T`Redo actions`);
    } else {
      XcSysManager.outputDisplay.warn(this.#i18n.T`No redo action.`);
    }
  }
}
