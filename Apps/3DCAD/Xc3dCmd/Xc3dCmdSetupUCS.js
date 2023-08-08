class Xc3dCmdSetupUCS {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForUCSorWCS: Symbol('WaitForUCSorWCS'),
    WaitForTransform: Symbol('WaitForTransform'),
    WaitForOrigin: Symbol('WaitForOrigin'),
    WaitForAxes: Symbol('WaitForAxes'),
    WaitForXY: Symbol('WaitForXY'),
    WaitForYZ: Symbol('WaitForYZ'),
    WaitForZX: Symbol('WaitForZX'),
  };

  static #Event = {
    Cancel: Symbol('Cancel'),
    ManualUCS: Symbol('ManualUCS'),
    TransformUCS: Symbol('TransformUCS'),
    WCS: Symbol('WCS'),
    XY: Symbol('XY'),
    ZX: Symbol('ZX'),
    YZ: Symbol('YZ'),
  };

  #i18n;
  #state;
  #origin;
  #hints;

  constructor() {
    this.#state = Xc3dCmdSetupUCS.#CommandState.WaitForUCSorWCS;
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

      'Specify the following options': '请指定选项',
      'Reset': '复位',
      'Set UCS Manually': '手动设置坐标系',
      'Set UCS By Transform': '通过移动设置坐标系',
      'Please specify new coordinate system': '请设置新的坐标系',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdSetupUCS();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    while ((this.#state !== Xc3dCmdSetupUCS.#CommandState.Cancel) && ((this.#state !== Xc3dCmdSetupUCS.#CommandState.Done))){
      switch (this.#state) {
        case Xc3dCmdSetupUCS.#CommandState.WaitForUCSorWCS:
          this.#state = yield* this.#onWaitForUCSOrWCS();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForTransform:
          this.#state = yield* this.#onWaitForTransform();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForOrigin:
          this.#state = yield* this.#onWaitForOrigin();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForAxes:
          this.#state = yield* this.#onWaitForAxes();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForXY:
          this.#state = yield* this.#onWaitForXY();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForZX:
          this.#state = yield* this.#onWaitForZX();
          break;
        case Xc3dCmdSetupUCS.#CommandState.WaitForYZ:
          this.#state = yield* this.#onWaitForYZ();
          break;
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForUCSOrWCS() {
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.Cancel}));
    widgets.push(cancelButton);

    const setWCS = document.createElement('button');
    setWCS.innerHTML = this.#i18n.T`Reset`;
    setWCS.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.WCS}));
    widgets.push(setWCS);

    const setUCSManually = document.createElement('button');
    setUCSManually.innerHTML = this.#i18n.T`Set UCS Manually`;
    setUCSManually.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.ManualUCS}));
    widgets.push(setUCSManually);

    const setUCSByTransform = document.createElement('button');
    setUCSByTransform.innerHTML = this.#i18n.T`Set UCS By Transform`;
    setUCSByTransform.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.TransformUCS}));
    widgets.push(setUCSByTransform);

    const uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Specify the following options`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [Xc3dCmdSetupUCS.#Event.Cancel, Xc3dCmdSetupUCS.#Event.WCS, Xc3dCmdSetupUCS.#Event.ManualUCS, Xc3dCmdSetupUCS.#Event.TransformUCS],
    });

    if (event === Xc3dCmdSetupUCS.#Event.Cancel) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    } else if (event === Xc3dCmdSetupUCS.#Event.WCS) {
      Xc3dUIManager.resetUCS();
      return Xc3dCmdSetupUCS.#CommandState.Done;
    } else if (event === Xc3dCmdSetupUCS.#Event.ManualUCS) {
      return Xc3dCmdSetupUCS.#CommandState.WaitForOrigin;
    } else if (event === Xc3dCmdSetupUCS.#Event.TransformUCS) {
      return Xc3dCmdSetupUCS.#CommandState.WaitForTransform;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForTransform() {
    const coordinateSystem = Xc3dUIManager.ucs;

    const renderingObjectofUCS = Xc3dUIManager.renderingObjectsOfUCS().clone();
    renderingObjectofUCS.visible = true;
    renderingObjectofUCS.position.set(0, 0, 0);
    renderingObjectofUCS.rotation.set(0, 0, 0);
    renderingObjectofUCS.scale.set(1, 1, 1);
    renderingObjectofUCS.updateMatrix();
    renderingObjectofUCS.updateMatrixWorld();

    this.#hints.add(renderingObjectofUCS);
    Xc3dUIManager.redraw();

    const {inputState, transform} = yield* Xc3dUIManager.getTransform({
      prompt: this.#i18n.T`Please specify new coordinate system`,
      coordinateSystem,
      needScale: false,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      draggingCallback: (currentMatrix) => {
        renderingObjectofUCS.position.set(0, 0, 0);
        renderingObjectofUCS.rotation.set(0, 0, 0);
        renderingObjectofUCS.scale.set(1, 1, 1);

        renderingObjectofUCS.updateMatrix();
        renderingObjectofUCS.updateMatrixWorld();

        renderingObjectofUCS.applyMatrix4(currentMatrix.toThreeMatrix4());
        renderingObjectofUCS.updateMatrix();
        renderingObjectofUCS.updateMatrixWorld();

        Xc3dUIManager.redraw();
      }
    });
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: renderingObjectofUCS});

    if (inputState === Xc3dUIInputState.eInputNormal) {
      const currentCoordinateSystemMatrix = Xc3dUIManager.ucs.toMatrix();
      const newCoordinateSystemMatrix = XcGm3dMatrix.multiply({matrix1: transform, matrix2: currentCoordinateSystemMatrix});
      const customCoordinateSystem = XcGmCoordinateSystem.fromMatrix({matrix: newCoordinateSystemMatrix});
      Xc3dUIManager.ucs = customCoordinateSystem;

      return Xc3dCmdSetupUCS.#CommandState.Done;
    } else {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
  }

  * #onWaitForOrigin() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: this.#i18n.T`Please specify origin`});
    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#origin = position;

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array(this.#origin.toArray());
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({
        color: new THREE.Color('yellow'),
        size: 10,
        sizeAttenuation: false
      });
      const point = new THREE.Points(geometry, material);
      this.#hints.add(point);

      return Xc3dCmdSetupUCS.#CommandState.WaitForAxes;
    } else {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
  }

  * #onWaitForAxes() {
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.Cancel}));
    widgets.push(cancelButton);

    const xyButton = document.createElement('button');
    xyButton.innerHTML = 'XY';
    xyButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.XY}));
    widgets.push(xyButton);

    const zxButton = document.createElement('button');
    zxButton.innerHTML = 'ZX';
    zxButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.ZX}));
    widgets.push(zxButton);

    const yzButton = document.createElement('button');
    yzButton.innerHTML = 'YZ';
    yzButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdSetupUCS.#Event.YZ}));
    widgets.push(yzButton);

    const uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Please specify which axes to set`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [Xc3dCmdSetupUCS.#Event.XY, Xc3dCmdSetupUCS.#Event.ZX, Xc3dCmdSetupUCS.#Event.YZ],
    });

    if (event === Xc3dCmdSetupUCS.#Event.XY) {
      return Xc3dCmdSetupUCS.#CommandState.WaitForXY;
    } else if (event === Xc3dCmdSetupUCS.#Event.ZX) {
      return Xc3dCmdSetupUCS.#CommandState.WaitForZX;
    } else if (event === Xc3dCmdSetupUCS.#Event.YZ) {
      return Xc3dCmdSetupUCS.#CommandState.WaitForYZ;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForXY() {
    let {inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the X direction`});
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    const xAxisDirection = direction;

    const arrowHelper = new THREE.ArrowHelper(xAxisDirection.toThreeVector3(), this.#origin.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 'red');
    this.#hints.add(arrowHelper);

    ({inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the Y direction`}));
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    const yAxisDirection = direction;

    const zAxisDirection = xAxisDirection.crossProduct({vector: yAxisDirection});

    zAxisDirection.normalize();

    const customCoordinateSystem = new XcGmCoordinateSystem({
      origin: this.#origin,
      zAxisDirection,
      xAxisDirection,
    });
    Xc3dUIManager.ucs = customCoordinateSystem;

    return Xc3dCmdSetupUCS.#CommandState.Done;
  }

  * #onWaitForZX() {
    let {inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the Z direction`});
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    const zAxisDirection = direction;

    const arrowHelper = new THREE.ArrowHelper(zAxisDirection.toThreeVector3(), this.#origin.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 'blue');
    this.#hints.add(arrowHelper);

    ({inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the X direction`}));
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    let xAxisDirection = direction;

    // Adjust x Axis
    const yAxisDirection = zAxisDirection.crossProduct({vector: xAxisDirection});
    xAxisDirection = yAxisDirection.crossProduct({vector: zAxisDirection});

    zAxisDirection.normalize();
    xAxisDirection.normalize();

    const customCoordinateSystem = new XcGmCoordinateSystem({
      origin: this.#origin,
      zAxisDirection,
      xAxisDirection,
    });
    Xc3dUIManager.ucs = customCoordinateSystem;

    return Xc3dCmdSetupUCS.#CommandState.Done;
  }

  * #onWaitForYZ() {
    let {inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the Y direction`});
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    const yAxisDirection = direction;

    const arrowHelper = new THREE.ArrowHelper(yAxisDirection.toThreeVector3(), this.#origin.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 'green');
    this.#hints.add(arrowHelper);

    ({inputState, direction} = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the Z direction`}));
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdSetupUCS.#CommandState.Cancel;
    }
    const zAxisDirection = direction;

    const xAxisDirection = yAxisDirection.crossProduct({vector: zAxisDirection});
    zAxisDirection.normalize();
    xAxisDirection.normalize();

    const customCoordinateSystem = new XcGmCoordinateSystem({
      origin: this.#origin,
      zAxisDirection,
      xAxisDirection,
    });
    Xc3dUIManager.ucs = customCoordinateSystem;

    return Xc3dCmdSetupUCS.#CommandState.Done;
  }

}
