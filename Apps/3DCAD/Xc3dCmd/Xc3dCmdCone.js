class Xc3dCmdCone {
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
  #semiAngle;
  #height;
  #position;
  #radiusInput;
  #semiAngleInput;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdCone.#CommandState.WaitForParameters;
    this.#body = null;
    this.#renderingObject = null;
    this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#semiAngle = Math.PI / 4.0;
    this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});

    this.#updateObjectDisplay();

    this.#initI18n();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdCone.#Event.Cancel}));
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdCone.#Event.Next}));
    widgets.push(nextButton);

    const radiusStr = this.#i18n.T`Radius`;
    this.#radiusInput = document.createElement('label');
    this.#radiusInput.innerHTML = `${radiusStr} <input name="radius" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 4})}">`;
    this.#radiusInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdCone.#Event.ParameterChange}));
    widgets.push(this.#radiusInput);

    const heightStr = this.#i18n.T`Height`;
    this.heightInput = document.createElement('label');
    this.heightInput.innerHTML = `${heightStr} <input name="height" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 4})}">`;
    this.heightInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdCone.#Event.ParameterChange}));
    widgets.push(this.heightInput);

    const semiAngleStr = this.#i18n.T`Semi Angle`;
    this.#semiAngleInput = document.createElement('label');
    this.#semiAngleInput.innerHTML = `${semiAngleStr} <input name="semiAngle" type="number" value="45" min="1" max="179" step="5">`;
    this.#semiAngleInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdCone.#Event.ParameterChange}));
    widgets.push(this.#semiAngleInput);

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

      'Radius': '半径',
      'Semi Angle': '半锥角',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdCone();
    yield* cmd.run();
  }

  #updateObjectDisplay() {
    try {
      if (this.#renderingObject) {
        Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
      }

      const coordinateSystem = new XcGmCoordinateSystem({origin: this.#position});
      this.#body = XcGmBody.createSolidCone({
        radius: this.#radius,
        height: this.#height,
        semiAngle: this.#semiAngle,
        coordinateSystem: coordinateSystem
      });

      this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({body: this.#body, color: new THREE.Color('lightblue')});
      this.#renderingObject.position.copy(this.#position.toThreeVector3());

      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.#renderingObject});

      Xc3dUIManager.redraw();
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdCone.#CommandState.Cancel) && (this.#state !== Xc3dCmdCone.#CommandState.Done)) {
      switch (this.#state) {
        case Xc3dCmdCone.#CommandState.WaitForParameters:
          this.#state = yield* this.#onWaitForParameters();
          break;
        case Xc3dCmdCone.#CommandState.WaitForPosition:
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
      expectedEventTypes: [Xc3dCmdCone.#Event.Cancel, Xc3dCmdCone.#Event.Next, Xc3dCmdCone.#Event.ParameterChange]
    });
    if (event === Xc3dCmdCone.#Event.Cancel) {
      return Xc3dCmdCone.#CommandState.Cancel;
    } else if (event === Xc3dCmdCone.#Event.Next) {
      return Xc3dCmdCone.#CommandState.WaitForPosition;
    } else if (event === Xc3dCmdCone.#Event.ParameterChange) {
      this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.#radiusInput.querySelector('input').valueAsNumber});
      this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.heightInput.querySelector('input').valueAsNumber});
      this.#semiAngle = this.#semiAngleInput.querySelector('input').valueAsNumber * Math.PI / 180.0;
      this.#updateObjectDisplay();
      return Xc3dCmdCone.#CommandState.WaitForParameters;
    } else {
      return Xc3dCmdCone.#CommandState.WaitForParameters;
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
      return Xc3dCmdCone.#CommandState.Cancel;
    } else {
      this.#position = position;

      // Add the cone to the document
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#body.transform({matrix});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: this.#body})});
      Xc3dUIManager.redraw();

      return Xc3dCmdCone.#CommandState.Done;
    }
  }
}
