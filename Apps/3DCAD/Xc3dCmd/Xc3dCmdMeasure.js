class Xc3dCmdMeasure {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForNextPosition: Symbol('WaitForNextPosition'),
  };

  #i18n;
  #state;
  #lastPosition;

  constructor() {
    this.#state = Xc3dCmdMeasure.#CommandState.WaitForNextPosition;
    this.#lastPosition = null;
    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Please specify a position': '请指定一个位置',
      'Position coordinate: {0}, {1}, {2}': '位置坐标： {0}, {1}, {2}',
      'Distance to last position: {0}': '距离上次位置距离：{0}',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdMeasure();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while (this.#state !== Xc3dCmdMeasure.#CommandState.Quit) {
      switch (this.#state) {
        case Xc3dCmdMeasure.#CommandState.WaitForNextPosition:
          this.#state = yield* this.#onWaitForNextPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }
    return this.#state;
  }

  * #onWaitForNextPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Please specify a position`,
      basePosition: this.lastPosition
    });

    if (inputState === Xc3dUIInputState.eInputNormal) {
      const ucsPosition = Xc3dUIManager.getUCSPositionFromWorldPosition({worldPosition: position});
      XcSysManager.outputDisplay.info(this.#i18n.T`Position coordinate: ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.x}).toFixed(3))}, ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.y}).toFixed(3))}, ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.z}).toFixed(3))}`);

      if (this.lastPosition) {
        XcSysManager.outputDisplay.info(this.#i18n.T`Distance to last position: ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: position.distanceToPosition({position: this.lastPosition})}).toFixed(3))}`);
      }

      this.lastPosition = position;
      return Xc3dCmdMeasure.#CommandState.WaitForNextPosition;
    } else {
      return Xc3dCmdMeasure.#CommandState.Quit;
    }
  }
}
