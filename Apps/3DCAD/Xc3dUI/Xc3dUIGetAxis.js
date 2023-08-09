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

  constructor({
                prompt,
                allowReturnNull,
                draggingCallback,
                draggingIntensity
              }) {
    this.#prompt = prompt;
    this.#allowReturnNull = allowReturnNull;

    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.direction = null;

    this.firstPosition = null;
    this.#secondPosition = null;

    this.state = Xc3dUIGetAxis.CommandState.WaitForAxis;
  }

  * onWaitForAxis() {
    const {inputState, choice} = yield* Xc3dUIManager.getChoice({
      prompt: this.#prompt,
      choices: [Xc3dUII18n.i18n.T`Measure`, 'X', '-X', 'Y', '-Y', 'Z', '-Z'],
    });

    if (inputState === Xc3dUIInputState.eInputNormal) {
      if (choice === 0) { // Measure
        return Xc3dUIGetAxis.CommandState.WaitForFirstPosition;
      } else if (choice === 1) { // X
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 1, y: 0, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (choice === 2) { // -X
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: -1, y: 0, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (choice === 3) { // Y
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: 1, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (choice === 4) { // -Y
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: -1, z: 0});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (choice === 5) { // Z
        this.firstPosition = new XcGm3dPosition({x: 0, y: 0, z: 0});
        this.#secondPosition = new XcGm3dPosition({x: 0, y: 0, z: 1});
        this.firstPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.#secondPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction = XcGm3dPosition.subtract({
          position: this.#secondPosition,
          positionOrVector: this.firstPosition
        }).normal;
        return Xc3dUIGetAxis.CommandState.Ok;
      } else if (choice === 6) { // -Z
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
        XcSysAssert({assertion: false, message: 'Internal state error'});
      }
    } else if (event === Xc3dUIGetAxis.#Event.Cancel){
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetAxis.CommandState.Cancel;
    } else if (event === Xc3dUIGetAxis.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetAxis.CommandState.Done;
    } else {
      XcSysAssert({assertion: false, message: 'Internal state error'});
    }
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
