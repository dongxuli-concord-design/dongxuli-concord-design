class XcAtCmdPLCDemo {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForRobotReady: Symbol('WaitForRobotReady'),
    WaitForPartReady: Symbol('WaitForPartReady'),
  };

  static Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    PartReady: Symbol('PartReady'),
    RobotReady: Symbol('RobotReady'),
  };

  #state;

  constructor() {
    this.#state = XcAtCmdPLCDemo.#CommandState.WaitForRobotReady;
  }

  static createModels() {
    
  }

  static *command() {
    const cmd = new XcAtCmdPLCDemo();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    XcSysManager.outputDisplay.info('系统启动');
    XcSysManager.outputDisplay.info('Use XcSysManager.dispatchEvent({event: foo}) to dispatch an event.');

    while ((this.#state !== XcAtCmdPLCDemo.#CommandState.Done) && (this.#state !== XcAtCmdPLCDemo.#CommandState.Cancel)) {
      switch (this.#state) {
        case XcAtCmdPLCDemo.#CommandState.WaitForRobotReady:
          this.#state = yield* this.#onWaitForRobotReady();
          break;
        case XcAtCmdPLCDemo.#CommandState.WaitForPartReady:
          this.#state = yield* this.#onWaitForPartReady();
          break;
        default:
          XcSysAssert({assertion: false});
          break;
      }
    }

    if (this.#state === XcAtCmdPLCDemo.#CommandState.Done) {
      // Done
      XcSysManager.outputDisplay.info('系统正常停止');
    } else {
      XcSysAssert({assertion: false});
    }

    return this.#state;
  }

  * #onWaitForRobotReady() {
    let uiContext = new XcSysContext({
      prompt: 'Waiting for XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.RobotReady',
      showCanvasElement: true,
      cursor: 'pointer',
    });
    
    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes: [XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.RobotReady],
    });
    if (event === XcAtCmdPLCDemo.Event.Done) {
      XcSysManager.outputDisplay.info('用户停止系统');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } else if (event === XcAtCmdPLCDemo.Event.Cancel) {
      XcSysManager.outputDisplay.info('系统发生错误');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } else if (event === XcAtCmdPLCDemo.Event.RobotReady) {
      XcSysManager.outputDisplay.info('机器人就绪');
      return XcAtCmdPLCDemo.#CommandState.WaitForPartReady;
    } else {
      XcSysAssert({assertion: false, message: '系统发生内部异常'});
    }
  }

  * #onWaitForPartReady() {
    let uiContext = new XcSysContext({
      prompt: 'Waiting for XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.PartReady',
      showCanvasElement: true,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes: [XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.PartReady],
    });
    if (event === XcAtCmdPLCDemo.Event.Done) {
      XcSysManager.outputDisplay.info('用户停止系统');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } else if (event === XcAtCmdPLCDemo.Event.Cancel) {
      XcSysManager.outputDisplay.info('系统发生错误');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } if (event === XcAtCmdPLCDemo.Event.PartReady) {
      XcSysManager.outputDisplay.info('零件就绪');

      // Check if the part is good
      const isGoodPart = (Math.floor(Math.random() * 10) % 2 === 0);

      if (isGoodPart) {
        XcSysManager.outputDisplay.info('零件合格，发信号R1：让机器人执行指令（在XX点抓取零件、放入YY点、回到起始位置）');
      } else {
        XcSysManager.outputDisplay.info('零件不合格，发信号R2：让机器人执行指令（在XX点抓取零件、放入ZZ点、回到起始位置）');
      }

      return XcAtCmdPLCDemo.#CommandState.WaitForRobotReady;
    } else {
      XcSysAssert({assertion: false, message: '系统发生内部异常'});
    }
  }
}

Xc3dApp.commands.push(
  new Xc3dUICommand({
    name: 'PLC Demo',
    entry: XcAtCmdPLCDemo.command
  }),
);
