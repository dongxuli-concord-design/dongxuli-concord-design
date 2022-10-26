class Xc3dApp extends XcSysApp {

  static appName = 'Xc3dApp';
  static appVersion = 1;
  static appUserData = {};
  static document = null;

  static #CommandState = {
    WaitForOpenOrCreate: Symbol('WaitForOpenOrCreate'),
    WaitForLoadingDocument: Symbol('WaitForLoadingDocument'),
    WaitForCommand: Symbol('WaitForCommand'),
  };

  static #Event = {
    Open: Symbol('Open'),
    Create: Symbol('Create'),
    ScriptLoaded: Symbol('ScriptLoaded'),
  };

  static #i18n = null;
  static filePath = null;
  static newFile = false;
  static commands = [];

  name;
  description;
  icon;
  entry;

  constructor() {
    super();
    this.name = Xc3dApp.#i18n.T`3D Modeling`;
    this.description = Xc3dApp.#i18n.T`Let's design!`;
    this.icon = 'Apps/3DCAD/res/3d.png';
    this.entry = Xc3dApp.#run;
  }

  static init() {
    const messageBundle_zh = {
      // All
      'Internal command state error': '内部命令状态错误',
      'Cannot open the file: Incompatible file format or corrupted file.': '无法打开文件：文件不兼容或者被损坏。',
      'Command name': '命令名',
      'Open an existing file ...': '打开一个已有文件',
      'Create a new file ...': '创建一个新文件',
      'Ready': '就绪',
      '3D Modeling': '3D建模',
      "Let's design!": '现在开始设计！',
    };

    if (XcSysConfig.locale === 'zh') {
      Xc3dApp.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      Xc3dApp.#i18n = new XcSysI18n();
    }

    Xc3dApp.filePath = null;
  }

  static* #loadConfig() {
    const uiContext = new XcSysUIContext({
      showOutputElement: false,
      showCanvasElement: false,
      standardWidgets: null,
      standardDialog: null,
    });

    const loadedEvent = Symbol('Loaded');
    XcSysManager.loadJavascriptAsync({
      scriptSrc: 'Apps/3DCAD/res/config.js',
      asModule: false,
      doneCallback: () => {
        XcSysManager.dispatchEvent({event: loadedEvent});
      }
    });   
    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes: [loadedEvent],
    });
    XcSysAssert({assertion: event === loadedEvent});
  }

  static* #loadLibs() {    
    const libs = [
      'Apps/3DCAD/Xc3dDoc',
      'Apps/3DCAD/Xc3dUI',
      'Apps/3DCAD/Xc3dCmd'
    ];

    for (const lib of libs) {
      const loadedEvent = Symbol('Loaded');
      XcSysManager.loadJavascriptAsync({
        scriptSrc: lib, asModule: false, doneCallback: () => {
          XcSysManager.dispatchEvent({event: loadedEvent});
        }
      });

      const uiContext = new XcSysUIContext({
        showOutputElement: false,
        showCanvasElement: false,
        standardWidgets: null,
        standardDialog: null,
      });
      const event = yield* XcSysManager.waitForEvent({
        uiContext,
        expectedEventTypes: [loadedEvent],
      });
      XcSysAssert({assertion: event === loadedEvent});
    }
  }

  static* #loadPlugins() {
    for (const plugin of Xc3dAppConfig.plugins) {
      const loadedEvent = Symbol('Loaded');
      XcSysManager.loadJavascriptAsync({
        scriptSrc: plugin, asModule: false, doneCallback: () => {
          XcSysManager.dispatchEvent({event: loadedEvent});
        }
      });

      const uiContext = new XcSysUIContext({
        showOutputElement: false,
        showCanvasElement: false,
        standardWidgets: null,
        standardDialog: null,
      });      
      const event = yield* XcSysManager.waitForEvent({
        uiContext,
        expectedEventTypes: [loadedEvent],
      });
      XcSysAssert({assertion: event === loadedEvent});
    }
  }

  static* #run({filePath = null} = {}) {
    yield* Xc3dApp.#loadConfig(); 
    yield* Xc3dApp.#loadLibs();
    yield* Xc3dApp.#loadPlugins();

    if (filePath) {
      Xc3dApp.filePath = filePath;
      document.title = `${document.title} - ${filePath}`;
      Xc3dApp.state = Xc3dApp.#CommandState.WaitForLoadingDocument;
    } else {
      Xc3dApp.state = Xc3dApp.#CommandState.WaitForOpenOrCreate;
    }

    while (true) {
      switch (Xc3dApp.state) {
        case Xc3dApp.#CommandState.WaitForOpenOrCreate:
          Xc3dApp.state = yield* Xc3dApp.#onWaitForOpenOrCreate();
          break;
        case Xc3dApp.#CommandState.WaitForLoadingDocument:
          Xc3dApp.state = yield* Xc3dApp.#onWaitForLoadingDocument();
          break;
        case Xc3dApp.#CommandState.WaitForCommand:
          Xc3dApp.state = yield* Xc3dApp.#onWaitForCommand();
          break;
        default:
          XcSysAssert({assertion: false, message: Xc3dApp.#i18n.T`Internal command state error`});
          break;
      }
    }
  };

  static* #onWaitForOpenOrCreate() {
    const openStr = Xc3dApp.#i18n.T`Open an existing file ...`;
    const createStr = Xc3dApp.#i18n.T`Create a new file ...`;

    const divContent = `
    <div style="height:fit-content;">
            <input data-id="openfiledialoginput" style="display:none;" id="fileDialog" type="file" accept=".xc3d"/>
            <input data-id="createfiledialoginput" nwsaveas="Untitled" style="display:none;" id="fileDialog" type="file" accept=".xc3d"/>
            <button data-id="open" class="btn btn-primary btn-lg" style="display:block; margin:  auto; height:10vh;">${openStr}</button>
            <div  style="display:block; margin:  auto; height:10vh; "></div>
            <button data-id="create" class="btn btn-primary btn-lg" style="display:block; margin:  auto; height:10vh; ">${createStr}</button>
    </div>
      `;
    Xc3dApp.openOrCreateFileDiv = document.createElement('div');
    Xc3dApp.openOrCreateFileDiv.innerHTML = divContent;
    Xc3dApp.openOrCreateFileDiv.style.cssText = 'position: fixed; width: 100vw; height: 100vh; overflow: auto; display: flex;flex-direction: column;justify-content: center;background:rgba(255,255,255,1);z-index:1; background-image: url("/Apps/3DCAD/res/background.jpeg"); background-position: center center; background-repeat: no-repeat; background-attachment: fixed; background-size: cover;';
    // REF: background image: https://www.webpagefx.com/blog/web-design/responsive-background-image/

    // Setup listeners
    const onFileSelected = function (event) {
      try {
        event.target.removeEventListener('change', onFileSelected);
        const filePath = event.target.value;
        Xc3dApp.filePath = filePath;
        document.title = `${document.title} - ${filePath}`;
        XcSysManager.dispatchEvent({event: Xc3dApp.#Event.Open});

        Xc3dApp.newFile = false;
      } catch (error) {
        XcSysManager.outputDisplay.fatal(Xc3dApp.#i18n.T`Cannot open the file: Incompatible file format or corrupted file.`);
      } finally {
        event.target.value = '';
      }
    };

    const openFileButton = Xc3dApp.openOrCreateFileDiv.querySelector('[data-id="open"]');
    openFileButton.addEventListener('click', (event) => {
      const chooser = Xc3dApp.openOrCreateFileDiv.querySelector('[data-id="openfiledialoginput"]');
      chooser.addEventListener('change', onFileSelected, false);
      chooser.click();
    });

    const createFileButton = Xc3dApp.openOrCreateFileDiv.querySelector('[data-id="create"]');
    createFileButton.addEventListener('click', (event) => {
      const chooser = Xc3dApp.openOrCreateFileDiv.querySelector('[data-id="createfiledialoginput"]');
      chooser.addEventListener('change', (event) => {
        const filePath = event.target.value;
        Xc3dApp.filePath = filePath;
        document.title = `${document.title} - ${filePath}`;
        XcSysManager.dispatchEvent({event: Xc3dApp.#Event.Create});

        Xc3dApp.newFile = true;
      }, false);

      chooser.click();
    });

    const uiContextForWaitingOpenOrCreate = new XcSysUIContext({
      showOutputElement: false,
      showCanvasElement: false,
      standardWidgets: null,
      standardDialog: null,
      customDiv: Xc3dApp.openOrCreateFileDiv,
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContextForWaitingOpenOrCreate,
      expectedEventTypes: [Xc3dApp.#Event.Open, Xc3dApp.#Event.Create],
    });
    if (event === Xc3dApp.#Event.Open) {
      XcSysManager.outputDisplay.clear();
      try {
        if (!Xc3dApp.newFile) {
          const fs = require('fs');
          const fileContents = fs.readFileSync(Xc3dApp.filePath);
          const fileData = JSON.parse(fileContents);
          const appName = fileData.appName;
          const appVersion = fileData.appVersion;
          const documentData = fileData.documentData;

          Xc3dApp.appUserData = {...fileData.appUserData};
          if (!appName) {
            throw `The app name is not found.`;
          }
          if (!appVersion) {
            throw `The app version is not found.`;
          }
          if (!documentData) {
            throw `The document data is not found.`;
          }

          if (appName !== Xc3dApp.appName) {
            throw `The app name does not match this app.`;
          }
          if (appVersion > Xc3dApp.appVersion) {
            throw `The app version ${appVersion}  is too high.`;
          }
        }
      } catch (error) {
        alert(error);
        return Xc3dApp.#CommandState.WaitForOpenOrCreate;
      }
      return Xc3dApp.#CommandState.WaitForLoadingDocument;
    } else if (event === Xc3dApp.#Event.Create) {
      XcSysManager.outputDisplay.clear();
      return Xc3dApp.#CommandState.WaitForLoadingDocument;
    } else {
      return Xc3dApp.#CommandState.WaitForOpenOrCreate;
    }
  }

  static* #onWaitForLoadingDocument() {
    try {
      if (Xc3dApp.newFile) {
        Xc3dApp.document = new Xc3dDocDocument({filePath: Xc3dApp.filePath});
      } else {
        const fs = require('fs');
        const fileContents = fs.readFileSync(Xc3dApp.filePath);
        const fileData = JSON.parse(fileContents);
        const documentData = fileData.documentData;
        Xc3dApp.document = Xc3dDocDocument.load({json: documentData, filePath: Xc3dApp.filePath});
      }

      Xc3dUIManager.init({document: Xc3dApp.document});
      Xc3dCmdManager.init(Xc3dAppConfig.debug);

      return Xc3dApp.#CommandState.WaitForCommand;
    } catch (error) {
      XcSysManager.outputDisplay.fatal(error);
      return Xc3dApp.#CommandState.WaitForOpenOrCreate;
    }
  }

  static* #onWaitForCommand() {
    const {inputState, command} = yield* Xc3dUIManager.getCommand({
      prompt: Xc3dApp.#i18n.T`Ready`,
      commands: Xc3dApp.commands
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dApp.#CommandState.WaitForCommand;
    }

    // Clear the outputDisplay
    XcSysManager.outputDisplay.clear();

    try {
      yield* command.entry();
    } catch (error) {
      XcSysManager.outputDisplay.error(Xc3dApp.#i18n.T`Internal command state error`, error);
      Xc3dApp.document.cleanRuntimeData();
    } finally {
      Xc3dUIManager.clearCustomRenderingObjects();
      Xc3dUIManager.redraw();

      // Force GC to clean memory
      global.gc();
    }

    return Xc3dApp.#CommandState.WaitForCommand;
  }
}

XcSysManager.registerApp({appClass: Xc3dApp});
