class Xc3dUIGetAxis {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForAxis: Symbol('WaitForAxis'),
    WaitForFirstPosition: Symbol('WaitForFirstPosition'),
    WaitForSecondPosition: Symbol('WaitForSecondPosition')
  };

  static #Event = {
    Input: Symbol('Input'),
    InputEnter: Symbol('InputEnter'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  direction;
  firstPosition;
  state;

  #prompt;
  #allowReturnNull;
  #draggingCallback;
  #draggingIntensity;
  #secondPosition;
  #firstPositionInputWidget;
  #secondPositionInputWidget;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull,
                draggingCallback,
                draggingIntensity
              }) {
    this.#allowReturnNull = allowReturnNull;

    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.direction = null;

    this.firstPosition = null;
    this.#secondPosition = null;

    this.state = Xc3dUIGetAxis.CommandState.WaitForAxis;

    // get some parameter from the config
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.Cancel});
    });
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.Done});
      });
      widgets.push(doneButton);
    }

    this.#firstPositionInputWidget = document.createElement('input');
    this.#firstPositionInputWidget.type = 'text';
    this.#firstPositionInputWidget.placeholder = 'Axis start position';
    this.#firstPositionInputWidget.addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.Input});
    });
    this.#firstPositionInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.InputEnter});
      }
    });
    widgets.push(this.#firstPositionInputWidget);

    this.#secondPositionInputWidget = document.createElement('input');
    this.#secondPositionInputWidget.type = 'text';
    this.#secondPositionInputWidget.placeholder = Xc3dUII18n.i18n.T`Axis end position`;
    this.#secondPositionInputWidget.addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.Input});
    });
    this.#secondPositionInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetAxis.#Event.InputEnter});
      }
    });
    widgets.push(this.#secondPositionInputWidget);


    const toolbarItems = ['Measure', 'X', '-X', 'Y', '-Y', 'Z', '-Z'];
    for (const item of toolbarItems) {
      const button = document.createElement('button');
      button.innerHTML = item;
      button.dataset.axis = item;
      button.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event});
      });
      widgets.push(button);
    }

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });
  }

  * onWaitForAxis() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [
        Xc3dUIGetAxis.#Event.Cancel, 
        Xc3dUIGetAxis.#Event.Done, 
        Xc3dUIGetAxis.#Event.InputEnter,
        (event) => { return event instanceof MouseEvent; },
        ],
    });

    if (event === Xc3dUIGetAxis.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAxis.CommandState.Cancel;
    } else if (event === Xc3dUIGetAxis.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetAxis.CommandState.Done;
    } else if (event === Xc3dUIGetAxis.#Event.InputEnter) {
      try {
        { // First position
          const {position, isRelative} = Xc3dUIParser.parsePosition({string: this.#firstPositionInputWidget.value});
          XcSysAssert({assertion: !isRelative});
          position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
          this.firstPosition = position;
        }

        { // Second position
          const {position, isRelative} = Xc3dUIParser.parsePosition({string: this.#secondPositionInputWidget.value});
          if (isRelative) {
            position.x += this.firstPosition.x;
            position.y += this.firstPosition.y;
            position.z += this.firstPosition.z;
          } else {
            position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
          }
          this.#secondPosition = position;
        }

        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn('Invalid position input.');
        return Xc3dUIGetAxis.CommandState.waitForDirection;
      }
    } else if (event instanceof MouseEvent) {
      const axis = event.target.dataset.axis;
      if (axis === 'Measure') {
        return Xc3dUIGetAxis.CommandState.WaitForFirstPosition;
      } else if (axis === 'X') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 1, y: 0, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (axis === '-X') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: -1, y: 0, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (axis === 'Y') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: 1, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (axis === '-Y') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: -1, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (axis === 'Z') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: 0, z: 1});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (axis === '-Z') {
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: 0, z: -1});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else {
        XcSysAssert({assertion: false});
      }
    }

    return Xc3dUIGetAxis.CommandState.WaitForAxis;
  }

  * onWaitForFirstPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: Xc3dUII18n.i18n.T`Specify the first position of the axis`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAxis.CommandState.Cancel;
    } else {
      this.firstPosition = position;
      return Xc3dUIGetAxis.CommandState.WaitForSecondPosition;
    }
  }

  * onWaitForSecondPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: Xc3dUII18n.i18n.T`Specify the second position of the axis`,
      basePosition: this.firstPosition,
      draggingIntensity: this.#draggingIntensity,
      draggingCallback: (position) => {
        if (this.#draggingCallback) {
          this.#secondPosition = position;
          this.direction = XcGm3dPosition.subtract({
            position: this.#secondPosition,
            positionOrVector: this.firstPosition
          }).normal;
          this.#draggingCallback(this.firstPosition, this.direction);
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAxis.CommandState.Cancel;
    } else {
      this.#secondPosition = position;
      this.direction = XcGm3dPosition.subtract({
        position: this.#secondPosition,
        positionOrVector: this.firstPosition
      }).normal;
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetAxis.CommandState.Done;
    }
  }
}

Xc3dUIManager.getAxis = function* ({
                                             prompt,
                                             allowReturnNull = false,
                                             draggingCallback = null,
                                             draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                           }) {
  const axisGetter = new Xc3dUIGetAxis({prompt, allowReturnNull, draggingCallback, draggingIntensity});

  while ((axisGetter.state !== Xc3dUIGetAxis.CommandState.Ok) &&
  (axisGetter.state !== Xc3dUIGetAxis.CommandState.Cancel) && (axisGetter.state !== Xc3dUIGetAxis.CommandState.Done)) {
    switch (axisGetter.state) {
      case Xc3dUIGetAxis.CommandState.WaitForAxis:
        axisGetter.state = yield* axisGetter.onWaitForAxis();
        break;
      case Xc3dUIGetAxis.CommandState.WaitForFirstPosition:
        axisGetter.state = yield* axisGetter.onWaitForFirstPosition();
        break;
      case Xc3dUIGetAxis.CommandState.WaitForSecondPosition:
        axisGetter.state = yield* axisGetter.onWaitForSecondPosition();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: axisGetter.inputState, position: axisGetter.firstPosition, direction: axisGetter.direction};
};
