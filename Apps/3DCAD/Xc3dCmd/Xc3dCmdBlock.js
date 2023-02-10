class Xc3dCmdBlock {
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
  #length;
  #width;
  #height;
  #position;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdBlock.#CommandState.WaitForParameters;
    this.#body = null;
    this.#renderingObject = null;
    this.#length = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#width = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize / 4.0});
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});

    this.#initI18n();

    this.#updateObjectDisplay();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Cancel`;
    quitButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdBlock.#Event.Cancel}));
    widgets.push(quitButton);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = this.#i18n.T`Next`;
    nextButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dCmdBlock.#Event.Next}));
    widgets.push(nextButton);

    const lengthStr = this.#i18n.T`Length`;
    this.lengthInput = document.createElement('label');
    this.lengthInput.innerHTML = `${lengthStr} <input name="length" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#length})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#length / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#length * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#length / 4})}">`;
    this.lengthInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdBlock.#Event.ParameterChange}));
    widgets.push(this.lengthInput);

    const widthStr = this.#i18n.T`Width`;
    this.widthInput = document.createElement('label');
    this.widthInput.innerHTML = `${widthStr} <input name="#width" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#width})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#width / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#width * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#width / 4})}">`;
    this.widthInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdBlock.#Event.ParameterChange}));
    widgets.push(this.widthInput);

    const heightStr = this.#i18n.T`Height`;
    this.heightInput = document.createElement('label');
    this.heightInput.innerHTML = `${heightStr} <input name="#height" type="number" value="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height})}" min="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 100})}" max="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height * 100})}" step="${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: this.#height / 4})}">`;
    this.heightInput.querySelector('input').addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dCmdBlock.#Event.ParameterChange}));
    widgets.push(this.heightInput);

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
      'Please specify location': '请指定位置',
      'Length': '长度',
      'Width': '宽度',
      'Height': '高度',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdBlock();
    yield* cmd.run();
  }

  #updateObjectDisplay() {
    try {
      if (this.#renderingObject) {
        Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: this.#renderingObject});
      }

      this.#body = XcGmBody.createSolidBlock({x: this.#length, y: this.#width, z: this.#height});

      this.#renderingObject = Xc3dDocDocument.generateRenderingForBody({body: this.#body, color: new THREE.Color('lightblue')});
      this.#renderingObject.position.copy(this.#position.toThreeVector3());

      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.#renderingObject});

      Xc3dUIManager.redraw();
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdBlock.#CommandState.Cancel) && (this.#state !== Xc3dCmdBlock.#CommandState.Done)) {
      switch (this.#state) {
        case Xc3dCmdBlock.#CommandState.WaitForParameters:
          this.#state = yield* this.#onWaitForParameters();
          break;
        case Xc3dCmdBlock.#CommandState.WaitForPosition:
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
      expectedEventTypes: [Xc3dCmdBlock.#Event.Cancel, Xc3dCmdBlock.#Event.Next, Xc3dCmdBlock.#Event.ParameterChange]
    });
    if (event === Xc3dCmdBlock.#Event.Cancel) {
      return Xc3dCmdBlock.#CommandState.Cancel;
    } else if (event === Xc3dCmdBlock.#Event.Next) {
      return Xc3dCmdBlock.#CommandState.WaitForPosition;
    } else if (event === Xc3dCmdBlock.#Event.ParameterChange) {
      this.#length = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.lengthInput.querySelector('input').valueAsNumber});
      this.#width = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.widthInput.querySelector('input').valueAsNumber});
      this.#height = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: this.heightInput.querySelector('input').valueAsNumber});
      this.#updateObjectDisplay();
      return Xc3dCmdBlock.#CommandState.WaitForParameters;
    } else {
      return Xc3dCmdBlock.#CommandState.WaitForParameters;
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
      return Xc3dCmdBlock.#CommandState.Cancel;
    } else {
      this.#position = position;

      // Add the block to the document
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#body.transform({matrix});
      Xc3dUIManager.document.addDrawableObject({drawableObject: new Xc3dDocModel({body: this.#body})});
      Xc3dUIManager.redraw();

      return Xc3dCmdBlock.#CommandState.Done;
    }
  }
}
