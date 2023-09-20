class Xc3dCmdSpline {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPosition: Symbol('WaitForPosition'),
  };

  #i18n;
  #state;
  #positions;
  #hints;

  constructor() {
    this.#state = Xc3dCmdSpline.#CommandState.WaitForPosition;
    this.#positions = [];
    this.#hints = new THREE.Group();

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Please specify position': '请指定位置',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdSpline();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdSpline.#CommandState.Done) && (this.#state !== Xc3dCmdSpline.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdSpline.#CommandState.WaitForPosition:
          this.#state = yield* this.#onWaitForPositions();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdSpline.#CommandState.Done) {
      const curves = XcGm3dNurbsCurve._pkCreateBspline({positions: this.#positions});
      const curveAndIntervals = curves.map(curve => {
        return {curve, interval: new XcGmInterval({low: 0, high: 1})}
      });

      const {wire, newEdges} = XcGm3dCurve.makeWireBodyFromCurves({curveAndIntervals});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: wire, color: new THREE.Color('rgb(50, 50, 50)')})});
      Xc3dUIManager.redraw();
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForPositions() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Please specify position`,
      allowReturnNull: true,
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdSpline.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdSpline.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#positions.push(position);
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([...position.toArray()]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({
        color: new THREE.Color('Indigo'),
        size: 5,
        sizeAttenuation: false
      });
      const renderingPoint = new THREE.Points(geometry, material);
      this.#hints.add(renderingPoint);
      Xc3dUIManager.redraw();

      return Xc3dCmdSpline.#CommandState.WaitForPosition;
    }
  }
}
