class Xc3dCmdPrism {
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
  #renderingObject;
  #radius;
  #height;
  #sides;
  #position;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdPrism.#CommandState.WaitForParameters;
    this.#body = null;
    this.#renderingObject = null;
    this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#sides = 3;
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});

    this.#updateObjectDisplay();

    this.#initI18n();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdPrism.#Event.Cancel}));
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdPrism.#Event.Next}));
    widgets.push(nextButton);

    const radiusStr = this.#i18n.T`Radius`;
    this.radiusInput = document.createElement('label');
    this.radiusInput.innerHTML = `${radiusStr}  <input name="radius" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 4})}">`;
    this.radiusInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdPrism.#Event.ParameterChange}));
    widgets.push(this.radiusInput);

    const heightStr = this.#i18n.T`Height`;
    this.heightInput = document.createElement('label');
    this.heightInput.innerHTML = `${heightStr} <input name="height" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 4})}">`;
    this.heightInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdPrism.#Event.ParameterChange}));
    widgets.push(this.heightInput);

    const sidesStr = this.#i18n.T`Sides`;
    this.sidesInput = document.createElement('label');
    this.sidesInput.innerHTML = `${sidesStr} <input name="sides" type="number" value="3" min="3" max="16" step="1">`;
    this.sidesInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdPrism.#Event.ParameterChange}));
    widgets.push(this.sidesInput);

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

      'Sides': '边数',
      'Radius': '半径',
      'Height': '高度',
      'Please input dimensions': '请输入尺寸',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdPrism();
    yield* cmd.run();
  }

  #updateObjectDisplay() {
    try {
      if (this.#renderingObject) {
        Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
      }

      this.#body = XcGmBody._pkCreateSolidPrism({radius: this.#radius, height: this.#height, sides: this.#sides});

      this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({body: this.#body, color: new THREE.Color('lightblue')});
      this.#renderingObject.position.copy(this.#position.toThreeVector3());

      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.#renderingObject});

      Xc3dUIManager.redraw();
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdPrism.#CommandState.Cancel) && (this.#state !== Xc3dCmdPrism.#CommandState.Done)) {
      switch (this.#state) {
        case Xc3dCmdPrism.#CommandState.WaitForParameters:
          this.#state = yield* this.#onWaitForParameters();
          break;
        case Xc3dCmdPrism.#CommandState.WaitForPosition:
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
      expectedEventTypes: [Xc3dCmdPrism.#Event.Cancel, Xc3dCmdPrism.#Event.Next, Xc3dCmdPrism.#Event.ParameterChange]
    });
    if (event === Xc3dCmdPrism.#Event.Cancel) {
      return Xc3dCmdPrism.#CommandState.Cancel;
    } else if (event === Xc3dCmdPrism.#Event.Next) {
      return Xc3dCmdPrism.#CommandState.WaitForPosition;
    } else if (event === Xc3dCmdPrism.#Event.ParameterChange) {
      this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.radiusInput.querySelector('input').valueAsNumber});
      this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.heightInput.querySelector('input').valueAsNumber});
      this.#sides = this.sidesInput.querySelector('input').valueAsNumber;
      this.#updateObjectDisplay();
      return Xc3dCmdPrism.#CommandState.WaitForParameters;
    } else {
      return Xc3dCmdPrism.#CommandState.WaitForParameters;
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
      return Xc3dCmdPrism.#CommandState.Cancel;
    } else {
      this.#position = position;

      // Add the prism to the document
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#body._pkTransform({matrix});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: this.#body, color: new THREE.Color('rgb(220, 220, 220)')})});
      Xc3dUIManager.redraw();

      return Xc3dCmdPrism.#CommandState.Done;
    }
  }
}
