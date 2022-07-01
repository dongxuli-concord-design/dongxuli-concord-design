class HelloCmd {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForNextPosition: Symbol('WaitForNextPosition'),
  };

  state = HelloCmd.#CommandState.WaitForNextPosition;
  lastPosition = null;

  constructor() {
  }

  static* command() {
    let cmd = new HelloCmd();
    let ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while (this.state !== HelloCmd.#CommandState.Quit) {
      switch (this.state) {
        case HelloCmd.#CommandState.WaitForNextPosition:
          this.state = yield* this.#onWaitForNextPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: 'Internal command state error'});
          break;
      }
    }
    return this.state;
  }

  * #onWaitForNextPosition() {
    let {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: 'Please specify a position',
      basePosition: this.lastPosition
    });

    if (inputState === Xc3dUIInputState.eInputNormal) {
      let ucsPosition = Xc3dUIManager.getUCSPositionFromWorldPosition({worldPosition: position});
      XcSysManager.outputDisplay.info(`Position coordinate: ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.x}).toFixed(3))}, ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.y}).toFixed(3))}, ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: ucsPosition.z}).toFixed(3))}`);

      if (this.lastPosition) {
        XcSysManager.outputDisplay.info(`Distance to last position: ${parseFloat(Xc3dUIManager.computeValueWithUnitFromStandardValue({value: position.distanceToPosition({position: this.lastPosition})}).toFixed(3))}`);
      }

      this.lastPosition = position;
      return HelloCmd.#CommandState.WaitForNextPosition;
    } else {
      return HelloCmd.#CommandState.Quit;
    }
  }
}

Xc3dApp.commands.push(
  new Xc3dUICommand({
    id: '23118ee6d-ef7b-4da9-8cbf-763a09935225',
    name: 'Hello command',
    entry: HelloCmd.command
  }),
);
