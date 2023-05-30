class Xc3dUIGetDialog {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForEndDialogOrOtherTask: Symbol('WaitForEndDialogOrOtherTask')
  };

  static #Event = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  value;
  inputState;
  state;

  #allowReturnNull;
  #dialog;
  #uiContext;

  constructor({
                prompt,
                dialog,
                allowReturnNull
              }) {
    this.#dialog = dialog;
    const widgets = [];

    const okButton = document.createElement('button');
    okButton.innerHTML = Xc3dUII18n.i18n.T`Ok`;
    okButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDialog.#Event.Ok}));
    widgets.push(okButton);


    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDialog.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDialog.#Event.Done}));
      widgets.push(doneButton);
    }

    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      customDiv: this.#dialog
    });

    this.value = null;
    this.inputState = Xc3dUIInputState.eInputNormal;

    this.state = Xc3dUIGetDialog.CommandState.WaitForEndDialogOrOtherTask;
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dUIGetDialog.#Event.Cancel, Xc3dUIGetDialog.#Event.Done, Xc3dUIGetDialog.#Event.Ok]
    });
    if (event === Xc3dUIGetDialog.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDialog.CommandState.Cancel;
    } else if (event === Xc3dUIGetDialog.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetDialog.CommandState.Done;
    } else if (event === Xc3dUIGetDialog.#Event.Ok) {
      this.inputState = Xc3dUIInputState.eInputNormal;
      this.value = this.#dialog;
      return Xc3dUIGetDialog.CommandState.Ok;
    } else {
      return Xc3dUIGetDialog.CommandState.WaitForEndDialogOrOtherTask;
    }
  }
}

Xc3dUIManager.getDialog = function* ({prompt, dialog, allowReturnNull = false}) {
  const dialogGetter = new Xc3dUIGetDialog({prompt, dialog, allowReturnNull});

  while ((dialogGetter.state !== Xc3dUIGetDialog.CommandState.Ok) &&
  (dialogGetter.state !== Xc3dUIGetDialog.CommandState.Cancel) && (dialogGetter.state !== Xc3dUIGetDialog.CommandState.Done)) {
    switch (dialogGetter.state) {
      case Xc3dUIGetDialog.CommandState.WaitForEndDialogOrOtherTask:
        dialogGetter.state = yield* dialogGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: dialogGetter.inputState, value: dialogGetter.value};
};
