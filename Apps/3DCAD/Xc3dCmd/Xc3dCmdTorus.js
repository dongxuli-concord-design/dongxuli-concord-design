class Xc3dCmdTorus {
  static #CommandState = {
    Cancel: Symbol('Cancel'),
    Done: Symbol('Done'),
    WaitForParameters: Symbol('WaitForParameters'),
    WaitForPosition: Symbol('WaitForPosition'),
  };

  static #Event = {
    Cancel: Symbol('Cancel'),
    Next: Symbol('Next'),
    ParameterChange: Symbol('ParameterChange')
  };

  #i18n;
  #state;
  #body;
  #position;
  #renderingObject;
  #majorRadius;
  #minorRadius;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdTorus.#CommandState.WaitForParameters;
    this.#body = null;
    this.#renderingObject = null;
    this.#majorRadius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#minorRadius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 8.0});
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});


    this.#updateObjectDisplay();

    this.#initI18n();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdTorus.#Event.Cancel}));
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdTorus.#Event.Next}));
    widgets.push(nextButton);

    const majorRadiusStr = this.#i18n.T`Major radius`;
    this.majorRadiusInput = document.createElement('label');
    this.majorRadiusInput.innerHTML = `${majorRadiusStr} <input name="majorradius" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#majorRadius})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#majorRadius / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#majorRadius * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#majorRadius / 4})}">`;
    this.majorRadiusInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdTorus.#Event.ParameterChange}));
    widgets.push(this.majorRadiusInput);

    const minorRadiusStr = this.#i18n.T`Minor radius`;
    this.minorRadiusInput = document.createElement('label');
    this.minorRadiusInput.innerHTML = `${minorRadiusStr} <input name="minorradius" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#minorRadius})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#minorRadius / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#minorRadius * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#minorRadius / 8})}">`;
    this.minorRadiusInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdTorus.#Event.ParameterChange}));
    widgets.push(this.minorRadiusInput);

    this.#uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Please input dimensions`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Please input dimensions': '请输入尺寸',
      'Major radius': '大圆半径',
      'Minor radius': '小圆半径',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdTorus();
    yield* cmd.run();
  }

  #updateObjectDisplay() {
    try {
      if (this.#renderingObject) {
        Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
      }

      this.#body = XcGmBody._pkCreateSolidTorus({majorRadius: this.#majorRadius, minorRadius: this.#minorRadius});

      this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({body: this.#body, color: new THREE.Color('lightblue')});
      this.#renderingObject.position.copy(this.#position.toThreeVector3());

      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.#renderingObject});

      Xc3dUIManager.redraw();
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdTorus.#CommandState.Cancel) && (this.#state !== Xc3dCmdTorus.#CommandState.Done)) {
      switch (this.#state) {
        case Xc3dCmdTorus.#CommandState.WaitForParameters:
          this.#state = yield* this.#onWaitForParameters();
          break;
        case Xc3dCmdTorus.#CommandState.WaitForPosition:
          this.#state = yield* this.#onWaitForPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.clearCustomOverlayRenderingObjects();
    Xc3dUIManager.clearCustomRenderingObjects();
  }

  * #onWaitForParameters() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmdTorus.#Event.Cancel, Xc3dCmdTorus.#Event.Next, Xc3dCmdTorus.#Event.ParameterChange]
    });
    if (event === Xc3dCmdTorus.#Event.Cancel) {
      return Xc3dCmdTorus.#CommandState.Cancel;
    } else if (event === Xc3dCmdTorus.#Event.Next) {
      return Xc3dCmdTorus.#CommandState.WaitForPosition;
    } else if (event === Xc3dCmdTorus.#Event.ParameterChange) {
      this.#majorRadius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.majorRadiusInput.querySelector('input').valueAsNumber});
      this.#minorRadius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.minorRadiusInput.querySelector('input').valueAsNumber});
      this.#updateObjectDisplay();
      return Xc3dCmdTorus.#CommandState.WaitForParameters;
    } else {
      return Xc3dCmdTorus.#CommandState.WaitForParameters;
    }
  }

  * #onWaitForPosition() {
    Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#renderingObject});

    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Please specify location`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      draggingCallback: (currentPos) => {
        this.#renderingObject.position.copy(currentPos.toThreeVector3());
        Xc3dUIManager.redraw();
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdTorus.#CommandState.Cancel;
    } else {
      this.#position = position;

      // Add the torus to the document
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#body._pkTransform({matrix});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: this.#body, color: new THREE.Color('rgb(220, 220, 220)')})});
      Xc3dUIManager.redraw();

      return Xc3dCmdTorus.#CommandState.Done;
    }
  }
}
