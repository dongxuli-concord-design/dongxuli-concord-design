class Xc3dCmdPoint {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPosition: Symbol('WaitForPosition')
  };

  #i18n;
  #state;
  #position;

  constructor() {
    this.#state = Xc3dCmdPoint.#CommandState.WaitForPosition;
    this.#position = Xc3dUIManager.ucs.origin;
    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Specify position': '指定位置',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdPoint();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdPoint.#CommandState.Done) && (this.#state !== Xc3dCmdPoint.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdPoint.#CommandState.WaitForPosition:
          this.#state = yield* this.#onWaitForPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdPoint.#CommandState.Done) {
      const point = XcGm3dPoint.create({position: this.#position});
      const body = point.createMinimumBody();

      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body, color: new THREE.Color('rgb(50, 50, 50)')})});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForPosition() {
    //TODO: set the material in Config
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('green'),
      size: 10,
      sizeAttenuation: false
    });
    const renderingObject = new THREE.Points(geometry, material);

    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Specify position`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      draggingCallback: function (point) {
        renderingObject.position.copy(point.toThreeVector3());
        return renderingObject;
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdPoint.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdPoint.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#position = position;
      return Xc3dCmdPoint.#CommandState.Done;
    }
  }
}
