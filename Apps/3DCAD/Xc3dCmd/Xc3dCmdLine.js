class Xc3dCmdLine {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForStartPosition: Symbol('WaitForStartPosition'),
    WaitForEndPosition: Symbol('WaitForEndPosition')
  };

  #i18n;
  #state;
  #startPosition;
  #endPosition;

  constructor() {
    this.#state = Xc3dCmdLine.#CommandState.WaitForStartPosition;
    this.#startPosition = null;
    this.#endPosition = null;

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Start position': '起点位置',
      'End position': '终点位置',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdLine();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdLine.#CommandState.Done) && (this.#state !== Xc3dCmdLine.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdLine.#CommandState.WaitForStartPosition:
          this.#state = yield* this.#onWaitForStartPosition();
          break;
        case Xc3dCmdLine.#CommandState.WaitForEndPosition:
          this.#state = yield* this.#onWaitForEndPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdLine.#CommandState.Done) {
      const position = this.#startPosition;
      const direction = XcGm3dPosition.subtract({
        position: this.#endPosition,
        positionOrVector: this.#startPosition
      });
      const axis = new XcGm3dAxis({position, direction});
      const line = XcGm3dLine._pkCreate({axis});

      const interval = new XcGmInterval({
        low: 0,
        high: this.#startPosition.distanceToPosition({position: this.#endPosition})
      });

      const {wire} = XcGm3dCurve.makeWireBodyFromCurves({curveAndIntervals: [{curve: line, interval}]});

      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: wire, color: new THREE.Color('rgb(50, 50, 50)')})});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForStartPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Start position`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdLine.#CommandState.Cancel;
    } else {
      this.#startPosition = position;
      return Xc3dCmdLine.#CommandState.WaitForEndPosition;
    }
  }

  * #onWaitForEndPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`End position`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      basePosition: this.#startPosition
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdLine.#CommandState.Cancel;
    } else {
      this.#endPosition = position;
      return Xc3dCmdLine.#CommandState.Done;
    }
  }
}

