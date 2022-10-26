class Xc3dUIGetDistance {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForDistanceOrMeasurement: Symbol('WaitForDistanceOrMeasurement'),
    WaitForFirstPosition: Symbol('WaitForFirstPosition'),
    WaitForSecondPosition: Symbol('WaitForSecondPosition')
  };

  static #Event = {
    Input: Symbol('Input'),
    InputEnter: Symbol('InputEnter'),
    Measure: Symbol('Measure'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  distance;
  state;

  #prompt;
  #allowReturnNull;
  #distanceInputWidget;
  #uiContextForWaitForDistanceOrMeasurement;
  #firstPosition;
  #secondPosition;

  constructor({
                prompt,
                allowReturnNull,
                draggingCallback,
                draggingIntensity
              }) {
    this.#allowReturnNull = allowReturnNull;

    // get some parameter from the config
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetDistance.#Event.Cancel});
    });
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event: Xc3dUIGetDistance.#Event.Done});
      });
      widgets.push(doneButton);
    }

    this.#distanceInputWidget = document.createElement('input');
    this.#distanceInputWidget.type = 'number';
    this.#distanceInputWidget.placeholder = 'Distance';
    this.#distanceInputWidget.addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetDistance.#Event.Input});
    });
    this.#distanceInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetDistance.#Event.InputEnter});
      }
    });
    widgets.push(this.#distanceInputWidget);

    const button = document.createElement('button');
    button.innerHTML = 'Measure';
    button.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetDistance.#Event.Measure});
    });
    widgets.push(button);

    this.#uiContextForWaitForDistanceOrMeasurement = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.distance = null;
    this.#firstPosition = null;
    this.#secondPosition = null;
    this.state = Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement;
  }

  * onWaitForDistanceOrMeasurement({draggingCallback, draggingIntensity}) {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContextForWaitForDistanceOrMeasurement,
      expectedEventTypes: [Xc3dUIGetDistance.#Event.Cancel, Xc3dUIGetDistance.#Event.Done, Xc3dUIGetDistance.#Event.InputEnter, Xc3dUIGetDistance.#Event.Input, Xc3dUIGetDistance.#Event.Measure]
    });

    if (event === Xc3dUIGetDistance.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDistance.CommandState.Cancel;
    } else if (event === Xc3dUIGetDistance.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetDistance.CommandState.Done;
    } else if (event === Xc3dUIGetDistance.#Event.InputEnter) {
      try {
        this.distance = Xc3dUIParser.parseDistance({string: this.#distanceInputWidget.value});
        return Xc3dUIGetDistance.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement;
      }
    } else if (event === Xc3dUIGetDistance.#Event.Input) {
      try {
        this.distance = Xc3dUIParser.parseDistance({string: this.#distanceInputWidget.value});

        if (draggingCallback) {
          draggingCallback(this.distance);
        }

        return Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement;
      } catch (error) {
        return Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement;
      }
    } else if (event === Xc3dUIGetDistance.#Event.Measure) {
      XcSysManager.outputDisplay.info(Xc3dUII18n.i18n.T`Get distance from measurement.`);
      return Xc3dUIGetDistance.CommandState.WaitForFirstPosition;
    }

    return Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement;
  }

  * onWaitForFirstPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: Xc3dUII18n.i18n.T`Start position of distance`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDistance.CommandState.Cancel;
    } else {
      this.#firstPosition = position;
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetDistance.CommandState.WaitForSecondPosition;
    }
  }

  * onWaitForSecondPosition({draggingCallback, draggingIntensity}) {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: Xc3dUII18n.i18n.T`End position of distance`,
      basePosition: this.#firstPosition,
      draggingIntensity: draggingIntensity,
      draggingCallback: (position) => {
        if (draggingCallback) {
          this.#secondPosition = position;
          this.distance = this.#firstPosition.distanceToPosition({position: this.#secondPosition});
          draggingCallback(this.distance);
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDistance.CommandState.Cancel;
    } else {
      this.#secondPosition = position;
      this.inputState = Xc3dUIInputState.eInputNormal;
      this.distance = this.#firstPosition.distanceToPosition({position: this.#secondPosition});
      return Xc3dUIGetDistance.CommandState.Ok;
    }
  }
}

Xc3dUIManager.getDistance = function* ({
                                                 prompt,
                                                 allowReturnNull = false,
                                                 draggingCallback = null,
                                                 draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                               }) {
  const distanceGetter = new Xc3dUIGetDistance({prompt, allowReturnNull, draggingCallback, draggingIntensity});
  while ((distanceGetter.state !== Xc3dUIGetDistance.CommandState.Ok) &&
  (distanceGetter.state !== Xc3dUIGetDistance.CommandState.Cancel) && (distanceGetter.state !== Xc3dUIGetDistance.CommandState.Done)) {
    switch (distanceGetter.state) {
      case Xc3dUIGetDistance.CommandState.WaitForDistanceOrMeasurement:
        distanceGetter.state = yield* distanceGetter.onWaitForDistanceOrMeasurement({
          draggingCallback,
          draggingIntensity
        });
        break;
      case Xc3dUIGetDistance.CommandState.WaitForFirstPosition:
        distanceGetter.state = yield* distanceGetter.onWaitForFirstPosition({draggingCallback, draggingIntensity});
        break;
      case Xc3dUIGetDistance.CommandState.WaitForSecondPosition:
        distanceGetter.state = yield* distanceGetter.onWaitForSecondPosition({draggingCallback, draggingIntensity});
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: distanceGetter.inputState, distance: distanceGetter.distance};
};
