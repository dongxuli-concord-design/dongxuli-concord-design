class Xc3dUIGetCommand {
  static CommandState = {
    Ok: Symbol('Ok'),
    Cancel: Symbol('Cancel'),
    WaitForCommand: Symbol('WaitForCommand'),
  };

  static #Event = {
    Cancel: Symbol('Cancel'),
    InputDone: Symbol('InputDone'),
  };
  static lastCommandName = '';

  inputState;
  command;
  state;

  #commands;
  #showCanvasElement;
  #uicontext;

  constructor({
                prompt,
                commands,
                showCanvasElement
              }) {
    this.#commands = commands;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.command = null;
    this.#showCanvasElement = showCanvasElement;

    this.state = Xc3dUIGetCommand.CommandState.WaitForCommand;

    const widgets = [];

    this.commandInputWidget = document.createElement('input');
    this.commandInputWidget.type = 'text';
    this.commandInputWidget.value = Xc3dUIGetCommand.lastCommandName;
    this.commandInputWidget.placeholder = Xc3dUII18n.i18n.T`Command name`;
    this.commandInputWidget.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        XcSysManager.dispatchEvent({event: Xc3dUIGetCommand.#Event.InputDone});
      }
    });
    widgets.push(this.commandInputWidget);

    const commandButtons = commands.map((command, index) => {
      const button = document.createElement('button');
      if (command.icon) {
        button.innerHTML = `<img src="${command.icon}" style="width:32px;height:32px;"> ${command.name}`;
      } else {
        button.innerHTML = command.name;
      }
      button.dataset.index = index;
      button.addEventListener('click', (event) => {
        Xc3dUIGetCommand.lastCommandName = command.name;
        XcSysManager.dispatchEvent({event});
      });
      return button;
    });
    widgets.push(...commandButtons);

    this.#uicontext = new XcSysUIContext({
      prompt,
      standardWidgets: widgets,
      cursor: 'auto',
      showCanvasElement: this.#showCanvasElement,
    });
  }

  * onWaitForCommand() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uicontext,
      expectedEventTypes: [
        Xc3dUIGetCommand.#Event.Cancel, 
        Xc3dUIGetCommand.#Event.InputDone, 
        (event) => event instanceof MouseEvent,
      ],
    });

    if (event === Xc3dUIGetCommand.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetCommand.CommandState.Cancel;
    } else if (event === Xc3dUIGetCommand.#Event.InputDone) {
      const commandName = this.commandInputWidget.value;
      if (commandName && commandName.length > 0) {
        const command = this.#commands.find((element) => element.name.toUpperCase() === commandName.toUpperCase());
        if (command) {
          this.command = command;
          return Xc3dUIGetCommand.CommandState.Ok;
        } else {
          XcSysManager.outputDisplay.warn(Xc3dUII18n.i18n.T`Command not found.`);
          return Xc3dUIGetCommand.CommandState.WaitForCommand;
        }
      } else {
        return Xc3dUIGetCommand.CommandState.WaitForCommand;
      }
    } else if (event instanceof MouseEvent) {
      const commandIndex = parseInt(event.target.dataset.index);
      if ((commandIndex >= 0) && (commandIndex < this.#commands.length)) {
        this.command = this.#commands[parseInt(event.target.dataset.index)];
        return Xc3dUIGetCommand.CommandState.Ok;
      } else {
        return Xc3dUIGetCommand.CommandState.WaitForCommand;
      }
    } else {
      return Xc3dUIGetCommand.CommandState.WaitForCommand;
    }
  }
}

Xc3dUIManager.getCommand = function* ({prompt, commands, showCanvasElement = true}) {
  const commandGetter = new Xc3dUIGetCommand({prompt, commands, showCanvasElement});

  while ((commandGetter.state !== Xc3dUIGetCommand.CommandState.Ok) &&
  (commandGetter.state !== Xc3dUIGetCommand.CommandState.Cancel)) {
    switch (commandGetter.state) {
      case Xc3dUIGetCommand.CommandState.WaitForCommand:
        commandGetter.state = yield* commandGetter.onWaitForCommand();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  return {inputState: commandGetter.inputState, command: commandGetter.command};
};
