class Xc3dUIGetObject {
  static inputObject = null;

  static CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    Ok: Symbol('Ok'),
    Input: Symbol('Input'),
    WaitForInput: Symbol('WaitForInput')
  };

  static #Event = {
    Input: Symbol('Input'),
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  state;

  #prompt;
  #allowReturnNull;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull
              }) {
    this.#prompt = prompt;
    this.#allowReturnNull = allowReturnNull;
    const widgets = [];
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => XcSysManager.dispatchEvent({event: Xc3dUIGetObject.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetObject.#Event.Done}));
      widgets.push(doneButton);
    }

    const inputButton = document.createElement('button');
    inputButton.innerHTML = Xc3dUII18n.i18n.T`Input`;
    inputButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetObject.#Event.Input}));
    widgets.push(inputButton);

    const okButton = document.createElement('button');
    okButton.innerHTML = Xc3dUII18n.i18n.T`Ok`;
    okButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetObject.#Event.Ok}));
    widgets.push(okButton);

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    this.inputState = Xc3dUIInputState.eInputNormal;

    this.state = Xc3dUIGetObject.CommandState.WaitForInput;
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dUIGetObject.#Event.Cancel, Xc3dUIGetObject.#Event.Done, Xc3dUIGetObject.#Event.Input, Xc3dUIGetObject.#Event.Ok]
    });

    if (event === Xc3dUIGetObject.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetObject.CommandState.Cancel;
    } else if (event === Xc3dUIGetObject.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetObject.CommandState.Done;
    } else if (event === Xc3dUIGetObject.#Event.Input) {
      this.inputState = Xc3dUIInputState.eInputTest;
      return Xc3dUIGetObject.CommandState.Input;
    } else if (event === Xc3dUIGetObject.#Event.Ok) {
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetObject.CommandState.Ok;
    } else {
      XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
    }

    return Xc3dUIGetObject.CommandState.WaitForInput;
  }
}

Xc3dUIManager.getObject = function* ({
                                                prompt,
                                                allowReturnNull = false
                                              }) {
  const objectGetter = new Xc3dUIGetObject({prompt, allowReturnNull});

  while ((objectGetter.state !== Xc3dUIGetObject.CommandState.Ok) &&
  (objectGetter.state !== Xc3dUIGetObject.CommandState.Input) &&
  (objectGetter.state !== Xc3dUIGetObject.CommandState.Cancel)&&
  (objectGetter.state !== Xc3dUIGetObject.CommandState.Done)) {
    switch (objectGetter.state) {
      case Xc3dUIGetObject.CommandState.WaitForInput:
        objectGetter.state = yield* objectGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: objectGetter.inputState, object: Xc3dUIGetObject.inputObject};
};
