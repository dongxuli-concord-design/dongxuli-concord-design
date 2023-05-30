class Xc3dUIGetChoice {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForChoice: Symbol('WaitForChoice')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  inputState;
  choice;
  state;

  #allowReturnNull;
  #uicontext;

  constructor({
                prompt,
                choices,
                allowReturnNull
              }) {
    this.#allowReturnNull = allowReturnNull;
    this.inputState = Xc3dUIInputState.eInputNormal;
    this.choice = null;

    this.state = Xc3dUIGetChoice.CommandState.WaitForChoice;

    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetChoice.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetChoice.#Event.Done}));
      widgets.push(doneButton);
    }

    const choiceButtons = choices.map((choice, index) => {
      const button = document.createElement('button');
      button.innerHTML = choice;
      button.dataset.index = index;
      button.addEventListener('click', (event) =>XcSysManager.dispatchEvent({event}));
      return button;
    });
    widgets.push(...choiceButtons);

    this.#uicontext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });
  }

  * onWaitForChoice() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uicontext,
      expectedEventTypes: [
        Xc3dUIGetChoice.#Event.Cancel, 
        Xc3dUIGetChoice.#Event.Done, 
        (event) => event instanceof MouseEvent,
      ]
    });

    if (event === Xc3dUIGetChoice.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetChoice.CommandState.Cancel;
    } else if (event === Xc3dUIGetChoice.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetChoice.CommandState.Done;
    } else if (event instanceof MouseEvent) {
      this.choice = parseInt(event.target.dataset.index);
      return Xc3dUIGetChoice.CommandState.Ok;
    } else {
      return Xc3dUIGetChoice.CommandState.WaitForChoice;
    }
  }
}

Xc3dUIManager.getChoice = function* ({prompt, choices, allowReturnNull = false}) {
  const choiceGetter = new Xc3dUIGetChoice({prompt, choices, allowReturnNull});

  while ((choiceGetter.state !== Xc3dUIGetChoice.CommandState.Ok) &&
  (choiceGetter.state !== Xc3dUIGetChoice.CommandState.Cancel) && (choiceGetter.state !== Xc3dUIGetChoice.CommandState.Done)) {
    switch (choiceGetter.state) {
      case Xc3dUIGetChoice.CommandState.WaitForChoice:
        choiceGetter.state = yield* choiceGetter.onWaitForChoice();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: choiceGetter.inputState, choice: choiceGetter.choice};
};
