class Xc3dUIGetScreenPosition {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForInput: Symbol('WaitForInput')
  };

  static #Event = {
    Input: Symbol('Input'),
    InputEnter: Symbol('InputEnter'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  #prompt;
  #allowReturnNull;
  #mouseIndicator;
  #touchIndicator;
  #depth;
  #draggingCallback;
  #draggingIntensity;
  #positionInputWidget;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull,
                mouseIndicator,
                touchIndicator,
                depth,
                draggingCallback,
                draggingIntensity
              }) {
    this.#allowReturnNull = allowReturnNull;
    this.#mouseIndicator = mouseIndicator;
    this.#touchIndicator = touchIndicator;
    this.#depth = depth;
    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetScreenPosition.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetScreenPosition.#Event.Done}));
      widgets.push(doneButton);
    }

    this.#positionInputWidget = document.createElement('input');
    this.#positionInputWidget.type = 'text';
    this.#positionInputWidget.placeholder = 'Position coordinate';
    this.#positionInputWidget.addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dUIGetScreenPosition.#Event.Input}));
    this.#positionInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetScreenPosition.#Event.InputEnter});
      }
    });
    widgets.push(this.#positionInputWidget);

    this.dragObjects = new THREE.Group();

    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.dragObjects});

    // get some parameter from the config
    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.position = null;

    this.state = Xc3dUIGetScreenPosition.CommandState.WaitForInput;
  }

  * #getValueFromScreenPosition(positionInScreen) {
    if (this.#draggingCallback) {
      const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: this.#draggingIntensity})});
      if (nextEvent) {
        return;
      }
    }

    this.dragObjects.children.length = 0;
    this.position = positionInScreen;

    if (this.#draggingCallback) {
      this.#draggingCallback(positionInScreen.clone());
    }
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [
        Xc3dUIGetScreenPosition.#Event.Cancel, 
        Xc3dUIGetScreenPosition.#Event.Done, 
        (event) => event instanceof Xc3dUIMouseEvent,
        (event) => event instanceof Xc3dUITouchEvent,
      ],
    });

    if (event === Xc3dUIGetScreenPosition.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetScreenPosition.CommandState.Cancel;
    } else if (event === Xc3dUIGetScreenPosition.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetScreenPosition.CommandState.Done;
    } else if (event === Xc3dUIGetScreenPosition.#Event.InputEnter) {
      try {
        this.position = Xc3dUIParser.parseScreenPosition({string: this.#positionInputWidget.value});
        return Xc3dUIGetScreenPosition.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetScreenPosition.CommandState.WaitForInput;
      }
    } else if (event instanceof Xc3dUIMouseEvent) {
      if (event.type === Xc3dUIMouseEvent.TYPE.MOVE) {
        yield* this.#getValueFromScreenPosition(event.position);
        return Xc3dUIGetScreenPosition.CommandState.WaitForInput;
      } else if ((this.#mouseIndicator === Xc3dUIMouseEvent.TYPE.DOWN) && (event.type === Xc3dUIMouseEvent.TYPE.DOWN) && (event.which === 1)) {
        yield* this.#getValueFromScreenPosition(event.position);
        return Xc3dUIGetScreenPosition.CommandState.Ok;
      } else if ((this.#mouseIndicator === Xc3dUIMouseEvent.TYPE.UP) && (event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
        yield* this.#getValueFromScreenPosition(event.position);
        return Xc3dUIGetScreenPosition.CommandState.Ok;
      }
    } else if (event instanceof Xc3dUITouchEvent) {
      if ((event.type === Xc3dUITouchEvent.TYPE.MOVE) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        yield* this.#getValueFromScreenPosition(positionInScreen);

        return Xc3dUIGetScreenPosition.CommandState.WaitForInput;
      } else if ((this.#touchIndicator === Xc3dUITouchEvent.TYPE.START) && (event.type === Xc3dUITouchEvent.TYPE.START) &&
        (event.targetTouches.length === 1) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        yield* this.#getValueFromScreenPosition(positionInScreen);

        return Xc3dUIGetScreenPosition.CommandState.Ok;
      } else if ((this.#touchIndicator === Xc3dUITouchEvent.TYPE.END) && (event.type === Xc3dUITouchEvent.TYPE.END) &&
        (event.targetTouches.length === 0) && (event.changedTouches.length === 1)) {
        const touch = event.changedTouches[0];
        const positionInScreen = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        yield* this.#getValueFromScreenPosition(positionInScreen);
        return Xc3dUIGetScreenPosition.CommandState.Ok;
      }
    }

    return Xc3dUIGetScreenPosition.CommandState.WaitForInput;
  }
}

Xc3dUIManager.getScreenPosition = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                       touchIndicator = Xc3dUITouchEvent.TYPE.END,
                                                       depth = Xc3dUIManager.renderingCamera.position.distanceTo(new THREE.Vector3(0, 0, 0)),
                                                       draggingCallback = null,
                                                       draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                                     }) {
  const screenPositionGetter = new Xc3dUIGetScreenPosition({
    prompt,
    allowReturnNull,
    mouseIndicator,
    touchIndicator,
    depth,
    draggingCallback,
    draggingIntensity
  });
  while ((screenPositionGetter.state !== Xc3dUIGetScreenPosition.CommandState.Ok) &&
  (screenPositionGetter.state !== Xc3dUIGetScreenPosition.CommandState.Cancel) &&
  (screenPositionGetter.state !== Xc3dUIGetScreenPosition.CommandState.Done)) {
    switch (screenPositionGetter.state) {
      case Xc3dUIGetScreenPosition.CommandState.WaitForInput:
        screenPositionGetter.state = yield* screenPositionGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  Xc3dUIManager.removeCustomRenderingObject({renderingObject: screenPositionGetter.dragObjects});

  return {inputState: screenPositionGetter.inputState, position: screenPositionGetter.position};
};
