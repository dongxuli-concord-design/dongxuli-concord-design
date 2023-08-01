// Singleton
class XcSysMainCoroutineOpenAppEvent {
  constructor({userData = {}} = {}) {
    this.userData = userData;
  }
}

class XcSysMainCoroutine {
  static CommandState = {
    Halt: Symbol('Halt'),
    WaitForApp: Symbol('WaitForApp'),
    WaitForCustomInit: Symbol('WaitForCustomInit'),
  };


  static #i18n = null;

  static #uiContextOfHalt = new XcSysUIContext({
    prompt: 'System is off.',
  });

  static #setupLocale() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',

      'Please select an app': '请选择一个应用',
      'Do not forget to logout if you have finished your tasks.': '任务完成后，别忘了退出登录',
      'Startup app': '启动应用',
    };

    if (XcSysConfig.locale === 'zh') {
      XcSysMainCoroutine.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      XcSysMainCoroutine.#i18n = new XcSysI18n();
    }
  }

  static* run({customInitFunction = null, customInitFunctionArg = null} = {}) {
    XcSysMainCoroutine.#setupLocale();

    if (customInitFunction) {
      XcSysMainCoroutine.customInitFunction = customInitFunction;
      XcSysMainCoroutine.customInitFunctionArg = customInitFunctionArg;
      XcSysMainCoroutine.state = XcSysMainCoroutine.CommandState.WaitForCustomInit;
    } else {
      XcSysMainCoroutine.state = XcSysMainCoroutine.CommandState.WaitForApp;
    }

    while (true) {
      switch (XcSysMainCoroutine.state) {
        case XcSysMainCoroutine.CommandState.WaitForApp:
          XcSysMainCoroutine.state = yield* XcSysMainCoroutine.#onWaitForApp();
          break;
        case XcSysMainCoroutine.CommandState.WaitForCustomInit:
          XcSysMainCoroutine.state = yield* XcSysMainCoroutine.customInitFunction(XcSysMainCoroutine.customInitFunctionArg);
          break;
        case XcSysMainCoroutine.CommandState.Halt:
          XcSysMainCoroutine.state = yield* XcSysMainCoroutine.#onHalt();
          break;
        default:
          XcSysAssert({assertion: false, message: XcSysMainCoroutine.#i18n.T`Internal command state error`});
          break;
      }
    }

    // System stopped.
    // ...
  }

  static* #onHalt() {
    return XcSysMainCoroutine.CommandState.Halt;
  }

  static* #onWaitForApp() {
    const appsDiv = XcSysManager.htmlToElement({
      htmlString: `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: fit-content; height: fit-content; overflow: auto; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; background:rgba(255,255,255,1);z-index:1; margin: auto; padding: auto;"></div>
    `
    });

    const startupAppStr = XcSysMainCoroutine.#i18n.T`Startup app`;
    // For commands
    XcSysManager.apps.forEach(app => {
      const appDiv = XcSysManager.htmlToElement({
        htmlString: `
      <div class="card text-center" style="width: fit-content; height: fit-content; margin: 5em;">
        <img class="card-img-top mx-auto" src="${app.icon}" alt="Card image cap" style="width:150px; height:100px;">
        <div class="card-body mx-auto">
          <h5 class="card-title">${app.name}</h5>
          <p class="card-text">${app.description}</p>
          <button class="btn btn-primary">${startupAppStr}</button>
        </div>
      </div>
      `
      });

      const button = appDiv.querySelector('button');
      button.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({
          event: new XcSysMainCoroutineOpenAppEvent({
            userData: {
              name: app.name,
              description: app.description,
              entry: app.entry,
            }
          })
        });
      });

      appsDiv.append(appDiv);
    });

    const uiContextForWaitingCommands = new XcSysUIContext({
      prompt: XcSysMainCoroutine.#i18n.T`Please select an app`,
      showCanvasElement: false,
      standardWidgets: null,
      standardDialog: null,
      customDiv: appsDiv,
    });

    try {
      const event = yield* XcSysManager.waitForEvent({
        uiContext: uiContextForWaitingCommands,
        expectedEventTypes: [
          (event) => event instanceof XcSysMainCoroutineOpenAppEvent,
        ],
      });

      if (event === null) {
        XcSysManager.outputDisplay.log(XcSysMainCoroutine.#i18n.T`Do not forget to logout if you have finished your tasks.`);
      }

      if (event instanceof XcSysMainCoroutineOpenAppEvent) {
        const entry = event.userData.entry;
        XcSysManager.outputDisplay.clear();
        yield* entry();
        return XcSysMainCoroutine.CommandState.Halt;
      } else {
        // ignore
      }
    } catch (error) {
      XcSysManager.outputDisplay.error(XcSysMainCoroutine.#i18n.T`Internal command state error`);
      console.error(error);
      return XcSysMainCoroutine.CommandState.Halt;
    }

    return XcSysMainCoroutine.CommandState.Halt;
  }
}
