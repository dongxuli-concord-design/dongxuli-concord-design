// TODO:
// Add option to:
// Snap circle center point
// Grip points of spline
// etc.

class Xc3dUIGetPosition {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPosition: Symbol('WaitForPosition'),
    WaitForObjectToGetCenter: Symbol('WaitForObjectToGetCenter'),
    WaitForTextBoxInput: Symbol('WaitForTextBoxInput'),
    WaitForCodeInput: Symbol('WaitForCodeInput'),
  };

  static #Event = {
    TextBoxInputButtonClick: Symbol('TextBoxInputButtonClick'),
    CodeInputButtonClick: Symbol('CodeInputButtonClick'),

    TextBoxInput: Symbol('TextBoxInput'),
    TextBoxInputEnter: Symbol('TextBoxInputEnter'),
    Origin: Symbol('Origin'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    ObjectCenter: Symbol('ObjectCenter'),
  };

  state;
  inputState;
  position;

  #prompt;
  #allowReturnNull;
  #basePosition;
  #mouseIndicator;
  #touchIndicator;
  #draggingCallback;
  #draggingIntensity;
  #positionInputWidget;
  #uiContextForInput;
  #uiContextForTextBoxInput;
  #positionSnapper;
  #touchFingerIdentifier;

  constructor({
                prompt,
                allowReturnNull,
                basePosition,
                mouseIndicator,
                touchIndicator,
                draggingCallback,
                draggingIntensity,
              }) {
    this.#prompt = prompt;
    this.#allowReturnNull = allowReturnNull;
    this.#basePosition = basePosition;
    this.#mouseIndicator = mouseIndicator;
    this.#touchIndicator = touchIndicator;
    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    // Initial input context
    {
      const widgets = [];

      const cancelButton = document.createElement('button');
      cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
      cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.Cancel}));
      widgets.push(cancelButton);

      if (this.#allowReturnNull) {
        const doneButton = document.createElement('button');
        doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
        doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.Done}));
        widgets.push(doneButton);
      }

      const originButton = document.createElement('button');
      originButton.innerHTML = Xc3dUII18n.i18n.T`Origin`;
      originButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.Origin}));
      widgets.push(originButton);

      const objectCenterButton = document.createElement('button');
      objectCenterButton.innerHTML = Xc3dUII18n.i18n.T`Object center`;
      objectCenterButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.ObjectCenter}));
      widgets.push(objectCenterButton);

      const textBoxInputButton = document.createElement('button');
      textBoxInputButton.innerHTML = Xc3dUII18n.i18n.T`Input Coordinate`;
      textBoxInputButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.TextBoxInputButtonClick}));
      widgets.push(textBoxInputButton);

      const codeInputButton = document.createElement('button');
      codeInputButton.innerHTML = Xc3dUII18n.i18n.T`Input Coordinate Object`;
      codeInputButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.CodeInputButtonClick}));
      widgets.push(codeInputButton);

      this.snappingMarkGroup = new THREE.Group();
      Xc3dUIManager.addCustomOverlayRenderingObject({renderingObject: this.snappingMarkGroup});

      this.draggingRubberLine = null;
      if (this.#basePosition) {
        const rubberLineGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          ...this.#basePosition.toArray(),
          ...this.#basePosition.toArray(),
        ]);
        rubberLineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.draggingRubberLine = new THREE.Line(rubberLineGeometry, new THREE.LineDashedMaterial({
          color: new THREE.Color('rgb(0, 0, 255)'),
          linewidth: 2,
          scale: 1,
          dashSize: 0.01,
          gapSize: 0.01
        }), THREE.LineStrip);
        this.draggingRubberLine.computeLineDistances();

        Xc3dUIManager.addCustomRenderingObject({renderingObject: this.draggingRubberLine});
      }

      this.#uiContextForInput = new XcSysUIContext({
        prompt: this.#prompt,
        showCanvasElement: true,
        standardWidgets: widgets,
        cursor: 'crosshair'
      });
    }

    // Text box input
    {
      const widgets = [];

      const cancelButton = document.createElement('button');
      cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
      cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.Cancel}));
      widgets.push(cancelButton);

      if (this.#allowReturnNull) {
        const doneButton = document.createElement('button');
        doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
        doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.Done}));
        widgets.push(doneButton);
      }

      this.#positionInputWidget = document.createElement('input');
      this.#positionInputWidget.type = 'text';
      this.#positionInputWidget.placeholder = Xc3dUII18n.i18n.T`Position coordinate`;
      this.#positionInputWidget.addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.TextBoxInput}));
      this.#positionInputWidget.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
          XcSysManager.dispatchEvent({event: Xc3dUIGetPosition.#Event.TextBoxInputEnter});
        }
      });
      widgets.push(this.#positionInputWidget);

      this.#uiContextForTextBoxInput = new XcSysUIContext({
        prompt: this.#prompt,
        showCanvasElement: true,
        standardWidgets: widgets,
        cursor: 'crosshair'
      });
    }


    this.inputState = Xc3dUIInputState.eInputNormal;
    this.position = null;

    this.#positionSnapper = new Xc3dUIPositionSnapper();
    this.#touchFingerIdentifier = null;

    this.state = Xc3dUIGetPosition.CommandState.WaitForPosition;
  }

  * #getValueFromScreenPosition(positionInScreen) {
    if (this.#draggingCallback) {
      const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: this.#draggingIntensity})});
      if (nextEvent) {
        return false;
      }
    }

    // Remove all generated 3D elements
    this.snappingMarkGroup.remove(...this.snappingMarkGroup.children);
    this.position = null;

    const positionAndMark = this.#positionSnapper.snapAt({
      currentScreenPosition: positionInScreen,
      basePosition: this.#basePosition,
    });

    if (!positionAndMark) {
      return false;
    }

    this.position = positionAndMark.position;
    if (positionAndMark.mark) {
      this.snappingMarkGroup.add(positionAndMark.mark);
    }

    if (this.#basePosition) {
      const positions = this.draggingRubberLine.geometry.attributes.position.array;
      positions[3] = this.position.x;
      positions[4] = this.position.y;
      positions[5] = this.position.z;
      this.draggingRubberLine.geometry.attributes.position.needsUpdate = true;
      this.draggingRubberLine.computeLineDistances();
    }

    if (this.#draggingCallback) {
      this.#draggingCallback(this.position);
    }

    // Need redraw since we may have snapping marks or sampling objects
    Xc3dUIManager.redraw();

    return true;
  }

  * _getAccuratePoint() {
    //TODO
    // We can use the kernel's accurate picking
  }

  * onWaitForPosition() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContextForInput,
      expectedEventTypes: [
        Xc3dUIGetPosition.#Event.Cancel, 
        Xc3dUIGetPosition.#Event.Done, 
        Xc3dUIGetPosition.#Event.Origin, 
        Xc3dUIGetPosition.#Event.ObjectCenter, 
        Xc3dUIGetPosition.#Event.TextBoxInputButtonClick, 
        Xc3dUIGetPosition.#Event.CodeInputButtonClick, 
        event => event instanceof Xc3dUIMouseEvent,
        event => event instanceof Xc3dUITouchEvent,
      ],
    });

    if (event === Xc3dUIGetPosition.#Event.Cancel) {
      this.position = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetPosition.CommandState.Cancel;
    } else if (event === Xc3dUIGetPosition.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.position = null;
      return Xc3dUIGetPosition.CommandState.Done;
    } else if (event === Xc3dUIGetPosition.#Event.Origin) {
      this.inputState = Xc3dUIInputState.eInputNormal;
      this.position = new XcGm3dPosition();
      this.position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
      return Xc3dUIGetPosition.CommandState.Ok;
    } else if (event === Xc3dUIGetPosition.#Event.ObjectCenter) {
      const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
        prompt: Xc3dUII18n.i18n.T`Please select an object`,
        filter: (object) => object instanceof Xc3dDocModel,
      });
      if (inputState === Xc3dUIInputState.eInputNormal) {
        let box = null;
        if (drawableObject instanceof Xc3dDocModel) {
          box = drawableObject.body.box;
        } else {
          XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        }
        this.position = new XcGm3dPosition({
          x: (box.minimumX + box.maximumX) / 2.0,
          y: (box.minimumY + box.maximumY) / 2.0,
          z: (box.minimumZ + box.maximumZ) / 2.0
        });

        this.inputState = Xc3dUIInputState.eInputNormal;

        return Xc3dUIGetPosition.CommandState.Ok;
      } else {
        this.inputState = Xc3dUIInputState.eInputCancel;
        return Xc3dUIGetPosition.CommandState.Cancel;
      }
    } else if (event === Xc3dUIGetPosition.#Event.TextBoxInputButtonClick) {
      this.#positionInputWidget.value = '';
      return Xc3dUIGetPosition.CommandState.WaitForTextBoxInput;
    } else if (event === Xc3dUIGetPosition.#Event.CodeInputButtonClick) {
      return Xc3dUIGetPosition.CommandState.WaitForCodeInput;
    } else if (event instanceof Xc3dUIMouseEvent) {
      const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW})});

      if (nextEvent) {
        return Xc3dUIGetPosition.CommandState.WaitForPosition;
      }

      if (event.type === Xc3dUIMouseEvent.TYPE.MOVE) {
        const ret = yield* this.#getValueFromScreenPosition(event.position);
        return Xc3dUIGetPosition.CommandState.WaitForPosition;
      } else if ((this.#mouseIndicator === Xc3dUIMouseEvent.TYPE.DOWN) && (event.type === Xc3dUIMouseEvent.TYPE.DOWN) && (event.which === 1)) {
        const ret = yield* this.#getValueFromScreenPosition(event.position);
        if (ret) {
          return Xc3dUIGetPosition.CommandState.Ok;
        } else {
          return Xc3dUIGetPosition.CommandState.WaitForPosition;
        }
      } else if ((this.#mouseIndicator === Xc3dUIMouseEvent.TYPE.UP) && (event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
        const ret = yield* this.#getValueFromScreenPosition(event.position);
        if (ret) {
          return Xc3dUIGetPosition.CommandState.Ok;
        } else {
          return Xc3dUIGetPosition.CommandState.WaitForPosition;
        }
      }
    } else if (event instanceof Xc3dUITouchEvent) {
      if ((event.type === Xc3dUITouchEvent.TYPE.MOVE) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        const ret = yield* this.#getValueFromScreenPosition(positionInScreen);
        return Xc3dUIGetPosition.CommandState.WaitForPosition;
      } else if ((this.#touchIndicator === Xc3dUITouchEvent.TYPE.START) && (event.type === Xc3dUITouchEvent.TYPE.START) &&
        (event.targetTouches.length === 1) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        const ret = yield* this.#getValueFromScreenPosition(positionInScreen);
        if (ret) {
          return Xc3dUIGetPosition.CommandState.Ok;
        } else {
          return Xc3dUIGetPosition.CommandState.WaitForPosition;
        }
      } else if ((this.#touchIndicator === Xc3dUITouchEvent.TYPE.END) && (event.type === Xc3dUITouchEvent.TYPE.END) &&
        (event.targetTouches.length === 0) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        const ret = yield* this.#getValueFromScreenPosition(positionInScreen);
        if (ret) {
          return Xc3dUIGetPosition.CommandState.Ok;
        } else {
          return Xc3dUIGetPosition.CommandState.WaitForPosition;
        }
      }
    }

    return Xc3dUIGetPosition.CommandState.WaitForPosition;
  }

  * onWaitForTextBoxInput() {
    const event = yield* XcSysManager.waitForEvent({
      prompt: this.#prompt,
      uiContext: this.#uiContextForTextBoxInput,
      expectedEventTypes: [Xc3dUIGetPosition.#Event.Cancel, Xc3dUIGetPosition.#Event.Done, Xc3dUIGetPosition.#Event.TextBoxInput, Xc3dUIGetPosition.#Event.TextBoxInputEnter]
    });

    if (event === Xc3dUIGetPosition.#Event.Cancel) {
      this.position = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetPosition.CommandState.Cancel;
    } else if (event === Xc3dUIGetPosition.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.position = null;
      return Xc3dUIGetPosition.CommandState.Done;
    } else if (event === Xc3dUIGetPosition.#Event.TextBoxInput) {
      if (this.#draggingCallback) {
        const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: this.#draggingIntensity})});
        if (nextEvent) {
          return Xc3dUIGetPosition.CommandState.WaitForTextBoxInput;
        }
      }

      try {
        const {position, isRelative} = Xc3dUIParser.parsePosition({string: this.#positionInputWidget.value});
        position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

        if (isRelative) {
          XcSysAssert({
            assertion: this.#basePosition,
            message: Xc3dUII18n.i18n.T`Base position expected for relative coordinates`
          });
          position.x += this.#basePosition.x;
          position.y += this.#basePosition.y;
          position.z += this.#basePosition.z;
          this.position = position;
        } else {
          this.position = position;
        }

        if (this.#basePosition) {
          const positions = this.rubberLineGeometry.geometry.attributes.position.array;
          positions[3] = this.position.x;
          positions[4] = this.position.y;
          positions[5] = this.position.z;
          this.rubberLineGeometry.geometry.attributes.position.needsUpdate = true;
        }

        if (this.#draggingCallback) {
          this.#draggingCallback(this.position);
        }

        Xc3dUIManager.redraw();
      } catch (error) {

      }
      return Xc3dUIGetPosition.CommandState.WaitForTextBoxInput;
    } else if (event === Xc3dUIGetPosition.#Event.TextBoxInputEnter) {
      try {
        const {position, isRelative} = Xc3dUIParser.parsePosition({string: this.#positionInputWidget.value});
        position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
        if (isRelative) {
          //TODO: i18n
          XcSysAssert({
            assertion: this.#basePosition,
            message: Xc3dUII18n.i18n.T`Base position expected for relative coordinates`
          });
          position.x += this.#basePosition.x;
          position.y += this.#basePosition.y;
          position.z += this.#basePosition.z;
        }
        this.position = position;
        return Xc3dUIGetPosition.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetPosition.CommandState.WaitForMouseInput;
      }
    } else {
      return Xc3dUIGetPosition.CommandState.WaitForTextBoxInput;
    }
  }

  * onWaitForCodeInput() {
    const {inputState, object} = yield* Xc3dUIManager.getObject({prompt: this.#prompt, allowReturnNull: this.#allowReturnNull});
    if (inputState === Xc3dUIInputState.eInputCancel) {
      this.position = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetPosition.CommandState.Cancel;
    } else if (inputState === Xc3dUIInputState.eInputNone) {
      this.inputState = Xc3dUIInputState.eInputNone;
      this.position = null;
      return Xc3dUIGetPosition.CommandState.Done;
    } else if ((inputState === Xc3dUIInputState.eInputNormal) || (inputState === Xc3dUIInputState.eInputTest)) {
      if (object instanceof XcGm3dPosition) {
        this.position = object;

        if (inputState === Xc3dUIInputState.eInputTest) {
          this.position.transform({matrix: Xc3dUIManager.ucs.toMatrix()});

          if (this.#basePosition) {
            const positions = this.rubberLineGeometry.geometry.attributes.position.array;
            positions[3] = this.position.x;
            positions[4] = this.position.y;
            positions[5] = this.position.z;
            this.rubberLineGeometry.geometry.attributes.position.needsUpdate = true;
          }

          if (this.#draggingCallback) {
            this.#draggingCallback(this.position);
          }
          Xc3dUIManager.redraw();
        }

        if (inputState === Xc3dUIInputState.eInputNormal) {
          this.inputState = Xc3dUIInputState.eInputNormal;
          return Xc3dUIGetPosition.CommandState.Done;
        } else {
          return Xc3dUIGetPosition.CommandState.WaitForCodeInput;
        }
      } else {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetPosition.CommandState.WaitForCodeInput;
      }
    } else {
      XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
    }
  }
}

Xc3dUIManager.getPosition = function* ({
                                                 prompt,
                                                 allowReturnNull = false,
                                                 basePosition = null,
                                                 mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                 touchIndicator = Xc3dUITouchEvent.TYPE.END,
                                                 draggingCallback = null,
                                                 draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM,
                                               }) {
  const positionGetter = new Xc3dUIGetPosition({
    prompt,
    allowReturnNull,
    basePosition,
    mouseIndicator,
    touchIndicator,
    draggingCallback,
    draggingIntensity,
  });
  while ((positionGetter.state !== Xc3dUIGetPosition.CommandState.Ok) &&
  (positionGetter.state !== Xc3dUIGetPosition.CommandState.Cancel) &&
  (positionGetter.state !== Xc3dUIGetPosition.CommandState.Done)) {
    switch (positionGetter.state) {
      case Xc3dUIGetPosition.CommandState.WaitForPosition:
        positionGetter.state = yield* positionGetter.onWaitForPosition();
        break;
      case Xc3dUIGetPosition.CommandState.WaitForTextBoxInput:
        positionGetter.state = yield* positionGetter.onWaitForTextBoxInput();
        break;
      case Xc3dUIGetPosition.CommandState.WaitForCodeInput:
        positionGetter.state = yield* positionGetter.onWaitForCodeInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  if (basePosition) {
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: positionGetter.draggingRubberLine});
  }
  Xc3dUIManager.removeCustomOverlayRenderingObject({renderingObject: positionGetter.snappingMarkGroup});
  Xc3dUIManager.redraw();``

  return {inputState: positionGetter.inputState, position: positionGetter.position};
};
