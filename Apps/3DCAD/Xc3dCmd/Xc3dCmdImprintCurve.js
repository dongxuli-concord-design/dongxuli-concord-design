class Xc3dCmdImprintCurve {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFace: Symbol('WaitForFace'),
    WaitForPosition1: Symbol('WaitForPosition1'),
    WaitForPosition2: Symbol('WaitForPosition2'),
  };

  #i18n;
  #state;
  #face;
  #position1;
  #position2;

  constructor() {
    this.#state = Xc3dCmdImprintCurve.#CommandState.WaitForFace;
    this.#face = null;
    this.#position1 = null;
    this.#position2 = null;

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Done': '退出',

      'Select object to transform': '选择要变换的物体',
      'Please specify base position': '请选择锚点',
      'Please input rotation, scale or translation': '请输入旋转，缩放或平移',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdImprintCurve();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdImprintCurve.#CommandState.Done) && (this.#state !== Xc3dCmdImprintCurve.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdImprintCurve.#CommandState.WaitForFace:
          this.#state = yield* this.#onWaitForFace();
          break;
        case Xc3dCmdImprintCurve.#CommandState.WaitForPosition1:
          this.#state = yield* this.#onWaitForPosition1();
          break;
        case Xc3dCmdImprintCurve.#CommandState.WaitForPosition2:
          this.#state = yield* this.#onWaitForPosition2();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdImprintCurve.#CommandState.Done) {
      const position = this.#position1;
      const direction = XcGm3dPosition.subtract({
        position: this.#position2,
        positionOrVector: this.#position1
      }).normal();
      const axis = new XcGm3dAxis({position, direction});
      const curve = XcGm3dLine.create({axis});
      const interval = new XcGmInterval({
        low: 0,
        high: this.#position1.distanceToPosition({position: this.#position2})
      });
      this.#face.imprintCurve({curves: [curve], intervals: [interval]});

      let drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: this.#face});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject});
      Xc3dUIManager.redraw();
    }
  }

  * #onWaitForFace() {
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Select a planar face`,
      type: Xc3dUIManager.PICK_TYPE.FACE
    });

    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#face = value;
      return Xc3dCmdImprintCurve.#CommandState.WaitForPosition1;
    } else {
      return Xc3dCmdImprintCurve.#CommandState.Cancel;
    }
  }

  * #onWaitForPosition1() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: this.#i18n.T`Please specify position 1`});
    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#position1 = position;
      return Xc3dCmdImprintCurve.#CommandState.WaitForPosition2;
    } else {
      return Xc3dCmdImprintCurve.#CommandState.Cancel;
    }
  }

  * #onWaitForPosition2() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: this.#i18n.T`Please specify position 1`});
    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#position2 = position;
      return Xc3dCmdImprintCurve.#CommandState.Done;
    } else {
      return Xc3dCmdImprintCurve.#CommandState.Cancel;
    }
  }
}
