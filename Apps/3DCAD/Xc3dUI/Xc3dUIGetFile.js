class Xc3dUIGetFile {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForInput: Symbol('WaitForInput')
  };

  static #Event = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  files;
  inputState;
  state;

  #prompt;
  #allowReturnNull;

  #accept;
  #multiple;
  #nwdirectory;
  #nwdirectorydesc;
  #nwsaveas;
  #nwworkingdir;

  constructor({
                prompt,
                allowReturnNull,
                accept = undefined,
                multiple = undefined,
                nwdirectory = undefined,
                nwdirectorydesc = undefined,
                nwsaveas = undefined,
                nwworkingdir = undefined,
              }) {
    this.#prompt = prompt;
    this.#allowReturnNull = allowReturnNull;

    this.files = null;
    this.inputState = Xc3dUIInputState.eInputNormal;
    this.state = Xc3dUIGetFile.CommandState.WaitForInput;

    this.#accept = accept;
    this.#multiple = multiple;
    this.#nwdirectory = nwdirectory;
    this.#nwdirectorydesc = nwdirectorydesc;
    this.#nwsaveas = nwsaveas;
    this.#nwworkingdir = nwworkingdir;
  }

  * onWaitForInput() {
    const widgets = [];

    const okButton = document.createElement('button');
    okButton.innerHTML = Xc3dUII18n.i18n.T`Ok`;
    okButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetFile.#Event.Ok}));
    widgets.push(okButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetFile.#Event.Done}));
      widgets.push(doneButton);
    }

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetFile.#Event.Cancel}));
    widgets.push(cancelButton);

    const fileChooser = document.createElement('input');
    fileChooser.setAttribute('type', 'file');

    if (this.#accept !== undefined) {
      fileChooser.setAttribute('accept', this.#accept);
    }
    if (this.#multiple !== undefined) {
      fileChooser.setAttribute('multiple', this.#multiple);
    }
    if (this.#nwdirectory !== undefined) {
      fileChooser.setAttribute('nwdirectory', this.#nwdirectory);
    }
    if (this.#nwdirectorydesc !== undefined) {
      fileChooser.setAttribute('nwdirectorydesc', this.#nwdirectorydesc);
    }
    if (this.#nwsaveas !== undefined) {
      fileChooser.setAttribute('nwsaveas', this.#nwsaveas);
    }
    if (this.#nwworkingdir !== undefined) {
      fileChooser.setAttribute('nwworkingdir', this.#nwworkingdir);
    }

    fileChooser.addEventListener('change', (event) => {
      if (event.target.files) {
        this.files = [...event.target.files];
      }
    }, false);
    widgets.push(fileChooser);

    const uiContext = new XcSysUIContext({
      prompt: this.#prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes: [Xc3dUIGetFile.#Event.Ok, Xc3dUIGetFile.#Event.Done, Xc3dUIGetFile.#Event.Cancel],
    });

    if (event === Xc3dUIGetFile.#Event.Cancel) {
      this.files = null;
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetFile.CommandState.Cancel;
    } else if (event === Xc3dUIGetFile.#Event.Done) {
      this.files = null;
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetFile.CommandState.Done;
    } else if (event === Xc3dUIGetFile.#Event.Ok) {
      if (this.files) {
        this.inputState = Xc3dUIInputState.eInputNormal;
        return Xc3dUIGetFile.CommandState.Ok;
      } else {
        this.inputState = Xc3dUIInputState.eInputNone;
        XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`No file specified`);
        return Xc3dUIGetFile.CommandState.WaitForInput;
      }
    } else {
      XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
    }
  }
}

Xc3dUIManager.getFile = function* ({
                                     prompt,
                                     allowReturnNull = false,
                                     accept = undefined,
                                     multiple = undefined,
                                     nwdirectory = undefined,
                                     nwdirectorydesc = undefined,
                                     nwsaveas = undefined,
                                     nwworkingdir = undefined,
                                   }) {
  const fileGetter = new Xc3dUIGetFile({
    prompt,
    allowReturnNull,
    accept,
    multiple,
    nwdirectory,
    nwdirectorydesc,
    nwsaveas,
    nwworkingdir,
  });

  while ((fileGetter.state !== Xc3dUIGetFile.CommandState.Ok) &&
  (fileGetter.state !== Xc3dUIGetFile.CommandState.Done) &&
  (fileGetter.state !== Xc3dUIGetFile.CommandState.Cancel)) {
    switch (fileGetter.state) {
      case Xc3dUIGetFile.CommandState.WaitForInput:
        fileGetter.state = yield* fileGetter.onWaitForInput();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: fileGetter.inputState, files: fileGetter.files};
};
