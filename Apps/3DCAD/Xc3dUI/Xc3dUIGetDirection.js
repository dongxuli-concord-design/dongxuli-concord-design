class Xc3dUIGetDirection {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForDirection: Symbol('WaitForDirection'),
    WaitForFirstPosition: Symbol('WaitForFirstPosition'),
    WaitForSecondPosition: Symbol('WaitForSecondPosition'),
    WaitForPlanarFace: Symbol('WaitForPlanarFace'),
    WaitForReverseConfirmation: Symbol('WaitForReverseConfirmation'),
    WaitForTextBoxInput: Symbol('WaitForTextBoxInput'),
    WaitForCodeInput: Symbol('WaitForCodeInput'),
  };

  static #Event = {
    TextBoxInputButtonClick: Symbol('TextBoxInputButtonClick'),
    CodeInputButtonClick: Symbol('CodeInputButtonClick'),
    TextBoxInput: Symbol('TextBoxInput'),
    TextBoxInputEnter: Symbol('TextBoxInputEnter'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  direction;
  state;

  #prompt;
  #allowReturnNull;
  #draggingCallback;
  #draggingIntensity;
  #firstPosition;
  #secondPosition;
  #arrowHelper;
  #directionInputWidget;
  #uiContextForTextBoxInput;

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

    this.#firstPosition = null;
    this.#secondPosition = null;
    this.#arrowHelper = null;

    this.state = Xc3dUIGetDirection.CommandState.WaitForDirection;

    // Text box input
    {
      const widgets = [];

      const cancelButton = document.createElement('button');
      cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
      cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDirection.#Event.Cancel}));
      widgets.push(cancelButton);

      if (this.#allowReturnNull) {
        const doneButton = document.createElement('button');
        doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
        doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDirection.#Event.Done}));
        widgets.push(doneButton);
      }

      this.#directionInputWidget = document.createElement('input');
      this.#directionInputWidget.type = 'text';
      this.#directionInputWidget.placeholder = 'Direction';
      this.#directionInputWidget.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
          XcSysManager.dispatchEvent({event: Xc3dUIGetDirection.#Event.TextBoxInputEnter});
        }
      });
      widgets.push(this.#directionInputWidget);

      this.#uiContextForTextBoxInput = new XcSysUIContext({
        prompt: this.#prompt,
        showCanvasElement: true,
        standardWidgets: widgets,
        cursor: 'crosshair'
      });
    }
  }

  * onWaitForDirection() {
    const {inputState, choice} = yield* Xc3dUIManager.getChoice({
      prompt: this.#prompt,
      choices: [Xc3dUII18n.i18n.T`Measure`, Xc3dUII18n.i18n.T`Face`, 'X', '-X', 'Y', '-Y', 'Z', '-Z'],
    });

    if (inputState === Xc3dUIInputState.eInputNormal) {
      if (choice === 0) { // Measure
        return Xc3dUIGetDirection.CommandState.WaitForFirstPosition;
      } else if (choice === 1) { // Face
        return Xc3dUIGetDirection.CommandState.WaitForPlanarFace;
      } else if (choice === 2) { // X
        this.direction = new XcGm3dVector({x: 1, y: 0, z: 0});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else if (choice === 3) { // -X
        this.direction = new XcGm3dVector({x: -1, y: 0, z: 0});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else if (choice === 4) { // Y
        this.direction = new XcGm3dVector({x: 0, y: 1, z: 0});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else if (choice === 5) { // -Y
        this.direction = new XcGm3dVector({x: 0, y: -1, z: 0});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else if (choice === 6) { // Z
        this.direction = new XcGm3dVector({x: 0, y: 0, z: 1});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else if (choice === 7) { // -Z
        this.direction = new XcGm3dVector({x: 0, y: 0, z: -1});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        return Xc3dUIGetDirection.CommandState.Ok;
      } else {
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
      }
    } else {
      return Xc3dUIGetDirection.CommandState.Cancel;
    }
  }

  * #getDirectionFromPlanarFace(face) {
    const uvbox = face.UVBox;
    const midUV = new XcGmUV({u: (uvbox.lowU + uvbox.highU) / 2.0, v: (uvbox.lowV + uvbox.highV) / 2.0});

    const {surf, orientation} = face._pkSurfAndOrientation();
    if (surf instanceof XcGmPlanarSurface) {
      const faceDir = surf.coordinateSystem.zAxisDirection;
      if (!orientation) {
        faceDir.negate();
      }
      faceDir.normalize();

      const position = surf._pkEvaluate({uv: midUV});
      const direction = faceDir;

      return {
        position: position,
        direction: direction
      }
    } else {
      return null;
    }
  }

  * onWaitForFirstPosition() {
    const {
      inputState,
      position
    } = yield* Xc3dUIManager.getPosition({prompt: Xc3dUII18n.i18n.T`Specify the first position of the direction`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDirection.CommandState.Cancel;
    } else {
      this.#firstPosition = position;
      return Xc3dUIGetDirection.CommandState.WaitForSecondPosition;
    }
  }

  * onWaitForSecondPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: Xc3dUII18n.i18n.T`Specify the second position of the direction`,
      basePosition: this.#firstPosition,
      draggingIntensity: this.#draggingIntensity,
      draggingCallback: (position) => {
        if (this.#draggingCallback) {
          this.#secondPosition = position;
          this.direction = XcGm3dVector.subtract({
            position: this.#secondPosition,
            positionOrVector: this.#firstPosition
          }).normal;
          this.#draggingCallback(this.direction);
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDirection.CommandState.Cancel;
    } else {
      this.#secondPosition = position;
      this.direction = XcGm3dPosition.subtract({
        position: this.#secondPosition,
        positionOrVector: this.#firstPosition
      }).normal;
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetDirection.CommandState.Ok;
    }
  }

  * onWaitForPlanarFace() {
    //TODO: we can also allow any planar object, like circle etc.
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: Xc3dUII18n.i18n.T`Specify a planar face`,
      type: Xc3dUIManager.PICK_TYPE.FACE
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dUIGetDirection.CommandState.Cancel;
    } else {
      const posAndDir = this.#getDirectionFromPlanarFace(value);
      if (posAndDir) {
        this.direction = posAndDir.direction.normal;
        this.inputState = Xc3dUIInputState.eInputNormal;

        // Add arrow handle
        this.#arrowHelper = new THREE.ArrowHelper(this.direction.toThreeVector3(), posAndDir.position.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
        Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#arrowHelper});
        Xc3dUIManager.redraw();
        return Xc3dUIGetDirection.CommandState.WaitForReverseConfirmation;
      } else {
        XcSysManager.outputDisplay.info(Xc3dUII18n.i18n.T`Specify a planar face.`);
        return Xc3dUIGetDirection.CommandState.WaitForPlanarFace;
      }
    }
  }

  * onWaitForReverseConfirmation() {
    const {inputState, choice} = yield* Xc3dUIManager.getChoice({
      prompt: Xc3dUII18n.i18n.T`Reverse the direction?`,
      choices: ['Keep the direction', 'Reverse the direction']
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dUIGetDirection.CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dUIGetDirection.CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
      }
    } else {
      switch (choice) {
        case 0:
          return Xc3dUIGetDirection.CommandState.Ok;
          break;
        case 1:
          this.direction.multiply({scale: -1});
          return Xc3dUIGetDirection.CommandState.Ok;
          break;
        case 2:
        default:
          XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
          break;
      }
    }
  }

  * onWaitForTextBoxInput() {
    const event = yield* XcSysManager.waitForEvent({
      prompt: this.#prompt,
      uiContext: this.#uiContextForTextBoxInput,
      expectedEventTypes: [Xc3dUIGetDirection.#Event.Cancel, Xc3dUIGetDirection.#Event.Done, Xc3dUIGetDirection.#Event.TextBoxInput, Xc3dUIGetDirection.#Event.TextBoxInputEnter]
    });

    if (event === Xc3dUIGetDirection.#Event.Cancel) {
      this.direction = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDirection.CommandState.Cancel;
    } else if (event === Xc3dUIGetDirection.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.direction = null;
      return Xc3dUIGetDirection.CommandState.Done;
    } else if (event === Xc3dUIGetDirection.#Event.TextBoxInputEnter) {
      try {
        this.direction = Xc3dUIParser.parseVector({string: this.#directionInputWidget.value});
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction.normalize();
        return Xc3dUIGetDirection.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetDirection.CommandState.WaitForTextBoxInput;
      }
    } else {
      return Xc3dUIGetDirection.CommandState.WaitForTextBoxInput;
    }
  }

  * onWaitForCodeInput() {
    const {inputState, object} = yield* Xc3dUIManager.getObject({prompt: this.#prompt, allowReturnNull: this.#allowReturnNull});
    if (inputState === Xc3dUIInputState.eInputCancel) {
      this.direction = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDirection.CommandState.Cancel;
    } else if (inputState === Xc3dUIInputState.eInputNone) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.direction = null;
      return Xc3dUIGetDirection.CommandState.Done;
    } else if ((inputState === Xc3dUIInputState.eInputNormal) || (inputState === Xc3dUIInputState.eInputTest)) {
      if (object instanceof XcGm3dVector) {
        this.direction = object;
        this.direction.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        this.direction.normalize();

        if (inputState === Xc3dUIInputState.eInputTest) {
          if (this.#draggingCallback) {
            this.#draggingCallback(this.direction);
          }
          this.inputState = Xc3dUIInputState.eInputNormal;
          return Xc3dUIGetDirection.CommandState.WaitForCodeInput;
        } else {
          this.inputState = Xc3dUIInputState.eInputNormal;
          return Xc3dUIGetDirection.CommandState.Ok;
        }
      } else {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetDirection.CommandState.WaitForCodeInput;
      }
    } else {
      XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
    }
  }
}

Xc3dUIManager.getDirection = function* ({
                                                  prompt,
                                                  allowReturnNull = false,
                                                  draggingCallback = null,
                                                  draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                                }) {
  const directionGetter = new Xc3dUIGetDirection({prompt, allowReturnNull, draggingCallback, draggingIntensity});

  while ((directionGetter.state !== Xc3dUIGetDirection.CommandState.Ok) &&
  (directionGetter.state !== Xc3dUIGetDirection.CommandState.Cancel) && (directionGetter.state !== Xc3dUIGetDirection.CommandState.Done)) {
    switch (directionGetter.state) {
      case Xc3dUIGetDirection.CommandState.WaitForDirection:
        directionGetter.state = yield* directionGetter.onWaitForDirection();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForFirstPosition:
        directionGetter.state = yield* directionGetter.onWaitForFirstPosition();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForSecondPosition:
        directionGetter.state = yield* directionGetter.onWaitForSecondPosition();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForPlanarFace:
        directionGetter.state = yield* directionGetter.onWaitForPlanarFace();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForReverseConfirmation:
        directionGetter.state = yield* directionGetter.onWaitForReverseConfirmation();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForTextBoxInput:
        directionGetter.state = yield* directionGetter.onWaitForTextBoxInput();
        break;
      case Xc3dUIGetDirection.CommandState.WaitForCodeInput:
        directionGetter.state = yield* directionGetter.onWaitForCodeInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: directionGetter.inputState, direction: directionGetter.direction};
};
