class Xc3dUIGetInteger {
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

  value;
  inputState;
  state;

  #allowReturnNull;
  #integerInputWidget;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull
              }) {
    this.#allowReturnNull = allowReturnNull;
    const widgets = [];
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.#Event.Done}));
      widgets.push(doneButton);
    }
    this.#integerInputWidget = document.createElement('input');
    this.#integerInputWidget.type = 'number';
    this.#integerInputWidget.addEventListener('input', () => XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.#Event.Input}));
    this.#integerInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.#Event.InputEnter});
      }
    });
    widgets.push(this.#integerInputWidget);

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.value = null;
    this.inputState = Xc3dUIInputState.eInputNormal;

    this.state = Xc3dUIGetInteger.CommandState.WaitForInput;
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dUIGetInteger.#Event.Cancel, Xc3dUIGetInteger.#Event.Done, Xc3dUIGetInteger.#Event.InputEnter]
    });

    if (event === Xc3dUIGetInteger.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetInteger.CommandState.Cancel;
    } else if (event === Xc3dUIGetInteger.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetInteger.CommandState.Done;
    } else if (event === Xc3dUIGetInteger.#Event.InputEnter) {
      try {
        this.value = Xc3dUIParser.parseInteger({string: this.#integerInputWidget.value});
        return Xc3dUIGetInteger.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetInteger.CommandState.WaitForInput;
      }
    }

    return Xc3dUIGetInteger.CommandState.WaitForInput;
  }
}

Xc3dUIManager.getInteger = function* ({
                                                prompt,
                                                allowReturnNull = false
                                              }) {
  const integerGetter = new Xc3dUIGetInteger({prompt, allowReturnNull});

  while ((integerGetter.state !== Xc3dUIGetInteger.CommandState.Ok) &&
  (integerGetter.state !== Xc3dUIGetInteger.CommandState.Cancel) &&
  (integerGetter.state !== Xc3dUIGetInteger.CommandState.Done)) {
    switch (integerGetter.state) {
      case Xc3dUIGetInteger.CommandState.WaitForInput:
        integerGetter.state = yield* integerGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: integerGetter.inputState, value: integerGetter.value};
};
