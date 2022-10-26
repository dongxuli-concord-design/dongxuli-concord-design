class Xc3dUIGetString {
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
  #stringInputWidget;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull
              }) {
    // get some parameter from the config
    this.#allowReturnNull = allowReturnNull;

    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetString.#Event.Cancel});
    });
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event: Xc3dUIGetString.#Event.Done});
      });
      widgets.push(doneButton);
    }


    this.#stringInputWidget = document.createElement('input');
    this.#stringInputWidget.type = 'text';
    this.#stringInputWidget.addEventListener('input', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetInteger.Event.Input});
    });
    this.#stringInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetString.#Event.InputEnter});
      }
    });
    widgets.push(this.#stringInputWidget);

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.value = null;
    this.inputState = Xc3dUIInputState.eInputNormal;
    this.state = Xc3dUIGetString.CommandState.WaitForInput;
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dUIGetString.#Event.Cancel, Xc3dUIGetString.#Event.Done, Xc3dUIGetString.#Event.InputEnter]
    });

    if (event === Xc3dUIGetString.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetString.CommandState.Cancel;
    } else if (event === Xc3dUIGetString.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetString.CommandState.Done;
    } else if (event === Xc3dUIGetString.#Event.InputEnter) {
      if (this.#stringInputWidget.value && this.#stringInputWidget.value.length > 0) {
        this.value = this.#stringInputWidget.value;
        return Xc3dUIGetString.CommandState.Ok;
      } else {
        this.value = null;
        return Xc3dUIGetString.CommandState.WaitForInput;
      }
    }

    return Xc3dUIGetString.CommandState.WaitForInput;
  }
}

Xc3dUIManager.getString = function* ({
                                               prompt,
                                               allowReturnNull = false
                                             }) {
  const stringGetter = new Xc3dUIGetString({prompt, allowReturnNull});

  while ((stringGetter.state !== Xc3dUIGetString.CommandState.Ok) &&
  (stringGetter.state !== Xc3dUIGetString.CommandState.Cancel) &&
  (stringGetter.state !== Xc3dUIGetString.CommandState.Done)) {
    switch (stringGetter.state) {
      case Xc3dUIGetString.CommandState.WaitForInput:
        stringGetter.state = yield* stringGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: stringGetter.inputState, value: stringGetter.value};
};
