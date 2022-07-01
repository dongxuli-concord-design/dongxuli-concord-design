class Xc3dCmdSphere {
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
  #position;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdSphere.#CommandState.WaitForParameters;
    this.#body = null;
    this.#renderingObject = null;
    this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});

    this.#updateObjectDisplay();

    this.#initI18n();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdSphere.#Event.Cancel});
    });
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdSphere.#Event.Next});
    });
    widgets.push(nextButton);

    const radiusStr = this.#i18n.T`Radius`;
    this.radiusInput = document.createElement('label');
    this.radiusInput.innerHTML = `${radiusStr} <input name="radius" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#radius / 4})}">`;
    this.radiusInput.querySelector('input').addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdSphere.#Event.ParameterChange});
    });
    widgets.push(this.radiusInput);

    this.#uiContext = new XcSysContext({
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
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdSphere();
    yield* cmd.run();
  }

  #updateObjectDisplay() {
    try {
      if (this.#renderingObject) {
        Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
      }

      this.#body = XcGmBody.createSolidSphere({radius: this.#radius});

      this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({body: this.#body});
      this.#renderingObject.position.copy(this.#position.toThreeVector3());

      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.#renderingObject});

      Xc3dUIManager.redraw();
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdSphere.#CommandState.Cancel) && (this.#state !== Xc3dCmdSphere.#CommandState.Done)) {
      switch (this.#state) {
        case Xc3dCmdSphere.#CommandState.WaitForParameters:
          this.#state = yield* this.#onWaitForParameters();
          break;
        case Xc3dCmdSphere.#CommandState.WaitForPosition:
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
      expectedEventTypes: [Xc3dCmdSphere.#Event.Cancel, Xc3dCmdSphere.#Event.Next, Xc3dCmdSphere.#Event.ParameterChange]
    });
    if (event === Xc3dCmdSphere.#Event.Cancel) {
      return Xc3dCmdSphere.#CommandState.Cancel;
    } else if (event === Xc3dCmdSphere.#Event.Next) {
      return Xc3dCmdSphere.#CommandState.WaitForPosition;
    } else if (event === Xc3dCmdSphere.#Event.ParameterChange) {
      this.#radius = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.radiusInput.querySelector('input').valueAsNumber});
      this.#updateObjectDisplay();
      return Xc3dCmdSphere.#CommandState.WaitForParameters;
    } else {
      return Xc3dCmdSphere.#CommandState.WaitForParameters;
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
      return Xc3dCmdSphere.#CommandState.Cancel;
    } else {
      this.#position = position;

      // Add the sphere to the document
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#body.transform({matrix});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: this.#body})});
      Xc3dUIManager.redraw();

      return Xc3dCmdSphere.#CommandState.Done;
    }
  }
}
