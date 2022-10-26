class Xc3dUIGetFloat {
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

  #prompt;
  #allowReturnNull;
  #floatInputWidget;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull
              }) {
    this.#allowReturnNull = allowReturnNull;
    const widgets = [];
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetFloat.#Event.Cancel});
    });
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event: Xc3dUIGetFloat.#Event.Done});
      });
      widgets.push(doneButton);
    }
    this.#floatInputWidget = document.createElement('input');
    this.#floatInputWidget.type = 'number';
    this.#floatInputWidget.addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.Event.Input});
    });
    this.#floatInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetFloat.#Event.InputEnter});
      }
    });
    widgets.push(this.#floatInputWidget);

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.value = null;
    this.inputState = Xc3dUIInputState.eInputNormal;
    this.state = Xc3dUIGetFloat.CommandState.WaitForInput;
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
    });

    if (event === Xc3dUIGetFloat.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetFloat.CommandState.Cancel;
    } else if (event === Xc3dUIGetFloat.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetFloat.CommandState.Done;
    } else if (event === Xc3dUIGetFloat.#Event.InputEnter) {
      try {
        this.value = Xc3dUIParser.parseFloat({string: this.#floatInputWidget.value});
        return Xc3dUIGetFloat.CommandState.Ok;
      } catch (error) {
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Invalid input.`);
        return Xc3dUIGetFloat.CommandState.WaitForInput;
      }
    }

    return Xc3dUIGetFloat.CommandState.WaitForInput;
  }
}

Xc3dUIManager.getFloat = function* ({
                                              prompt,
                                              allowReturnNull = false
                                            }) {
  const floatGetter = new Xc3dUIGetFloat({prompt, allowReturnNull});

  while ((floatGetter.state !== Xc3dUIGetFloat.CommandState.Ok) &&
  (floatGetter.state !== Xc3dUIGetFloat.CommandState.Cancel) &&
  (floatGetter.state !== Xc3dUIGetFloat.CommandState.Done)) {
    switch (floatGetter.state) {
      case Xc3dUIGetFloat.CommandState.WaitForInput:
        floatGetter.state = yield* floatGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: floatGetter.inputState, value: floatGetter.value};
};
