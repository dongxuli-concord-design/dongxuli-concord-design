class Xc3dUIGetAngle {
  static CommandState = {
    Ok: Symbol('Ok'),
    Cancel: Symbol('Cancel'),
    Done: Symbol('Done'),
    WaitForAngleOrMeasurement: Symbol('WaitForAngleOrMeasurement'),
    WaitForCenterPosition: Symbol('WaitForCenterPosition'),
    WaitForFirstPosition: Symbol('WaitForFirstPosition'),
    WaitForSecondPosition: Symbol('WaitForSecondPosition'),
  };

  static #Event = {
    Input: Symbol('Input'),
    InputEnter: Symbol('InputEnter'),
    Measure: Symbol('Measure'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  angle;
  state;

  hints;

  #prompt;
  #allowReturnNull;
  #angleInputWidget;
  #draggingCallback;
  #draggingIntensity;
  #centerPosition;
  #firstPosition;
  #secondPosition;
  #arrowHelper;
  #uicontextForWaitForAngleOrMeasurement;

  constructor({
                prompt,
                allowReturnNull = false,
                draggingCallback = null,
                draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
              }) {
    this.#prompt = prompt;
    this.#allowReturnNull = allowReturnNull;

    // get some parameter from the config
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetAngle.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetAngle.#Event.Done}));
      widgets.push(doneButton);
    }

    this.#angleInputWidget = document.createElement('input');
    this.#angleInputWidget.type = 'number';
    this.#angleInputWidget.value = '0';
    this.#angleInputWidget.min = '-360';
    this.#angleInputWidget.max = '360';
    this.#angleInputWidget.step = '10';

    this.#angleInputWidget.placeholder = Xc3dUII18n.i18n.T`Angle`;
    this.#angleInputWidget.addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dUIGetAngle.#Event.Input}));
    this.#angleInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetAngle.#Event.InputEnter});
      }
    });
    widgets.push(this.#angleInputWidget);

    const measureButton = document.createElement('button');
    measureButton.innerHTML = Xc3dUII18n.i18n.T`Measure`;
    measureButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetAngle.#Event.Measure}));
    widgets.push(measureButton);

    this.#uicontextForWaitForAngleOrMeasurement = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.hints = new THREE.Group();
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.hints});

    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.angle = null;
    this.#centerPosition = null;
    this.#firstPosition = null;
    this.#secondPosition = null;
    this.state = Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement;
    this.#arrowHelper = null;
  }

  * onWaitForAngleOrMeasurement() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uicontextForWaitForAngleOrMeasurement,
      expectedEventTypes: [Xc3dUIGetAngle.#Event.Cancel, Xc3dUIGetAngle.#Event.Done, Xc3dUIGetAngle.#Event.InputEnter, Xc3dUIGetAngle.#Event.Measure]
    });

    if (event === Xc3dUIGetAngle.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      this.angle = null;
      return Xc3dUIGetAngle.CommandState.Cancel;
    } else if (event === Xc3dUIGetAngle.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.angle = null;
      return Xc3dUIGetAngle.CommandState.Done;
    } else if (event === Xc3dUIGetAngle.#Event.InputEnter) {
      try {
        this.angle = (Xc3dUIParser.parseFloat({string: this.#angleInputWidget.value}) * 3.14) / 180.0;
        return Xc3dUIGetAngle.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement;
      }
    } else if (event === Xc3dUIGetAngle.#Event.Input) {
      try {
        this.angle = (Xc3dUIParser.parseFloat({string: this.#angleInputWidget.value}) * 3.14) / 180.0;

        if (this.#draggingCallback) {
          this.#draggingCallback(this.angle);
        }

        return Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement;
      } catch (error) {
        return Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement;
      }
    } else if (event === Xc3dUIGetAngle.#Event.Measure) {
      return Xc3dUIGetAngle.CommandState.WaitForCenterPosition;
    }

    return Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement;
  }

  * onWaitForCenterPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: Xc3dUII18n.i18n.T`Specify the center position of the angle`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAngle.CommandState.Cancel;
    } else {
      this.#centerPosition = position;
      return Xc3dUIGetAngle.CommandState.WaitForFirstPosition;
    }
  }

  * onWaitForFirstPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: Xc3dUII18n.i18n.T`Specify the first position of the angle`,
      basePosition: this.#centerPosition
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAngle.CommandState.Cancel;
    } else {
      this.#firstPosition = position;
      // Add arrow handle
      const arrowDirection = XcGm3dPosition.subtract({
        position: this.#firstPosition,
        positionOrVector: this.#centerPosition
      }).normal;
      this.#arrowHelper = new THREE.ArrowHelper(arrowDirection.toThreeVector3(), this.#centerPosition.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
      this.hints.add(this.#arrowHelper);

      return Xc3dUIGetAngle.CommandState.WaitForSecondPosition;
    }
  }

  * onWaitForSecondPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: Xc3dUII18n.i18n.T`Specify the second position of the angle`,
      basePosition: this.#centerPosition,
      draggingIntensity: this.#draggingIntensity,
      draggingCallback: (position) => {
        if (this.#draggingCallback) {
          this.#secondPosition = position;
          const firstVector = XcGm3dPosition.subtract({
            position: this.#firstPosition,
            positionOrVector: this.#centerPosition
          });
          const secondVector = XcGm3dPosition.subtract({
            position: this.#secondPosition,
            positionOrVector: this.#centerPosition
          });
          this.angle = firstVector.angleTo({vector: secondVector});
          this.#draggingCallback(this.angle);
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAngle.CommandState.Cancel;
    } else {
      this.#secondPosition = position;
      const firstVector = XcGm3dPosition.subtract({
        position: this.#firstPosition,
        positionOrVector: this.#centerPosition
      });
      const secondVector = XcGm3dPosition.subtract({
        position: this.#secondPosition,
        positionOrVector: this.#centerPosition
      });
      this.angle = firstVector.angleTo({vector: secondVector});
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetAngle.CommandState.Ok;
    }
  }
}

Xc3dUIManager.getAngle = function* ({
                                              prompt,
                                              allowReturnNull = false,
                                              draggingCallback = null,
                                              draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                            }) {
  const angleGetter = new Xc3dUIGetAngle({prompt, allowReturnNull, draggingCallback, draggingIntensity});
  while ((angleGetter.state !== Xc3dUIGetAngle.CommandState.Ok) &&
  (angleGetter.state !== Xc3dUIGetAngle.CommandState.Cancel) && ((angleGetter.state !== Xc3dUIGetAngle.CommandState.Done))) {
    switch (angleGetter.state) {
      case Xc3dUIGetAngle.CommandState.WaitForAngleOrMeasurement:
        angleGetter.state = yield* angleGetter.onWaitForAngleOrMeasurement();
        break;
      case Xc3dUIGetAngle.CommandState.WaitForCenterPosition:
        angleGetter.state = yield* angleGetter.onWaitForCenterPosition();
        break;
      case Xc3dUIGetAngle.CommandState.WaitForFirstPosition:
        angleGetter.state = yield* angleGetter.onWaitForFirstPosition();
        break;
      case Xc3dUIGetAngle.CommandState.WaitForSecondPosition:
        angleGetter.state = yield* angleGetter.onWaitForSecondPosition();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }
  Xc3dUIManager.removeCustomRenderingObject({renderingObject: angleGetter.hints});

  return {inputState: angleGetter.inputState, angle: angleGetter.angle};
};
