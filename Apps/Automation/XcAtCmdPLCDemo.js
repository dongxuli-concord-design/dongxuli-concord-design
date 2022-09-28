class XcAtCmdPLCDemo {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForRobotReady: Symbol('WaitForRobotReady'),
    WaitForPartReady: Symbol('WaitForPartReady'),
  };

  static Event = {
    Done: 'Done',
    Cancel: 'Cancel',
    PartReady: 'PartReady',
    RobotReady: 'RobotReady',
    PLCServerConnectionError: 'PLCServerConnectionError',
    PLCServerConnectionClose: 'PLCServerConnectionClose',
  };

  static plcServerAddress = 'ws://127.0.0.1';
  static plcWebSocket = null;

  #state;

  constructor() {
    this.#state = XcAtCmdPLCDemo.#CommandState.WaitForRobotReady;
  }

  static createModels() {

  }

  static #startWebSocket() {
    XcAtCmdPLCDemo.#closeWebSocket();
    XcSysAssert({assertion: XcAtCmdPLCDemo.plcWebSocket === null});

    XcAtCmdPLCDemo.plcWebSocket = new WebSocket(XcAtCmdPLCDemo.plcServerAddress);

    XcAtCmdPLCDemo.plcWebSocket.onopen = () => {
      XcSysManager.outputDisplay.info('Connected to PLC WebSocket server.');
    };

    XcAtCmdPLCDemo.plcWebSocket.onmessage = (event) => {
      XcSysManager.outputDisplay.info(`Got message from PLC WebSocket server: ${event.data}.`);
      XcSysManager.dispatchEvent({event: event.data});
    };

    XcAtCmdPLCDemo.plcWebSocket.onclose = (event) => {
      XcSysManager.outputDisplay.error(`Disconnected PLC WebSocket server: ${event}.`);
      XcSysManager.dispatchEvent(XcAtCmdPLCDemo.Event.PLCServerConnectionClose);
    };

    XcAtCmdPLCDemo.plcWebSocket.onerror = (event) => {
      XcSysManager.outputDisplay.error(`Failed to connect PLC WebSocket server: ${event}.`);
      XcSysManager.dispatchEvent(XcAtCmdPLCDemo.Event.PLCServerConnectionError);
    };
  }

  static #closeWebSocket() {
    if (XcAtCmdPLCDemo.plcWebSocket) {
      XcAtCmdPLCDemo.plcWebSocket.onmessage = null;
      XcAtCmdPLCDemo.plcWebSocket.onerror = null;
      XcAtCmdPLCDemo.plcWebSocket.onclose = null;
      XcAtCmdPLCDemo.plcWebSocket.close();
      XcAtCmdPLCDemo.plcWebSocket = null;
    }
  }

  static #createEventButtons({events}) {
    const widgets = [];

    for (const event of events) {
      const button = document.createElement('button');
      button.innerHTML = event;
      button.addEventListener('click', () => {
        XcSysManager.dispatchEvent({event});
      });
      widgets.push(button);
    }

    return widgets;
  }

  static *command() {
    const cmd = new XcAtCmdPLCDemo();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    XcSysManager.outputDisplay.info('系统启动');
    XcSysManager.outputDisplay.info('Use XcSysManager.dispatchEvent({event: foo}) to dispatch an event.');

    try {
      XcAtCmdPLCDemo.#startWebSocket();

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
    } catch (error) {
      XcSysManager.outputDisplay.error(`Exception caught: ${error}`);
    } finally {
      XcAtCmdPLCDemo.#closeWebSocket();
    }

    return this.#state;
  }

  * #onWaitForRobotReady() {
    const expectedEventTypes = [XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.RobotReady, XcAtCmdPLCDemo.Event.PLCServerConnectionClose, XcAtCmdPLCDemo.Event.PLCServerConnectionError];
    const standardWidgets = XcAtCmdPLCDemo.#createEventButtons({events: expectedEventTypes});

    let uiContext = new XcSysContext({
      prompt: 'Waiting for XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.RobotReady',
      showCanvasElement: true,
      standardWidgets,
      cursor: 'pointer',
    });
    
    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes,
    });
    if (event === XcAtCmdPLCDemo.Event.Done) {
      XcSysManager.outputDisplay.info('用户停止系统');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } else if (event === XcAtCmdPLCDemo.Event.Cancel) {
      XcSysManager.outputDisplay.info('系统发生错误');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.PLCServerConnectionClose) {
      XcSysManager.outputDisplay.error('PLC服务器关闭');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.PLCServerConnectionError) {
      XcSysManager.outputDisplay.error('PLC服务器连接错误');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.RobotReady) {
      XcSysManager.outputDisplay.info('机器人就绪');
      return XcAtCmdPLCDemo.#CommandState.WaitForPartReady;
    } else {
      XcSysAssert({assertion: false, message: '系统发生内部异常'});
    }
  }

  * #onWaitForPartReady() {
    const expectedEventTypes = [XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.PartReady, XcAtCmdPLCDemo.Event.PLCServerConnectionClose, XcAtCmdPLCDemo.Event.PLCServerConnectionError];
    const standardWidgets = XcAtCmdPLCDemo.#createEventButtons({events: expectedEventTypes});

    let uiContext = new XcSysContext({
      prompt: 'Waiting for XcAtCmdPLCDemo.Event.Done, XcAtCmdPLCDemo.Event.Cancel, XcAtCmdPLCDemo.Event.PartReady',
      showCanvasElement: true,
      standardWidgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes,
    });
    if (event === XcAtCmdPLCDemo.Event.Done) {
      XcSysManager.outputDisplay.info('用户停止系统');
      return XcAtCmdPLCDemo.#CommandState.Done;
    } else if (event === XcAtCmdPLCDemo.Event.Cancel) {
      XcSysManager.outputDisplay.error('系统发生错误');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.PLCServerConnectionClose) {
      XcSysManager.outputDisplay.error('PLC服务器关闭');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.PLCServerConnectionError) {
      XcSysManager.outputDisplay.error('PLC服务器连接错误');
      return XcAtCmdPLCDemo.#CommandState.Cancel;
    } else if (event === XcAtCmdPLCDemo.Event.PartReady) {
      XcSysManager.outputDisplay.info('零件就绪');

      // Check if the part is good
      const isGoodPart = (Math.floor(Math.random() * 10) % 2 === 0);

      if (isGoodPart) {
        const message = '零件合格，发信号R1：让机器人执行指令（在XX点抓取零件、放入YY点、回到起始位置）';
        XcSysManager.outputDisplay.info(message);
        XcAtCmdPLCDemo.plcWebSocket.send(message)
      } else {
        const message = '零件不合格，发信号R2：让机器人执行指令（在XX点抓取零件、放入ZZ点、回到起始位置）';
        XcSysManager.outputDisplay.info(message);
        XcAtCmdPLCDemo.plcWebSocket.send(message)
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
