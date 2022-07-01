class Xc3dCmdUndo {
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

      'No undo action.': '没有可撤销的动作',
      'Undo actions': '撤销动作',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdUndo();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    const returnValue = Xc3dUIManager.document.undo();
    Xc3dUIManager.redraw();

    if (returnValue) {
      Xc3dUIManager.redraw();
      XcSysManager.outputDisplay.log(this.#i18n.T`Undo actions`);
    } else {
      XcSysManager.outputDisplay.warn(this.#i18n.T`No undo action.`);
    }
  }
}
