class XcSysBootloader {
  static platform = null;
  static configFileName = './config.js';

  static #i18n = null;
  static #coroutine = null;

  static reportError({error}) {
    console.error(error);
    document.body.innerHTML = `
      <div class="alert alert-danger" role="alert" style="position: absolute; margin: auto; top: 0; right: 0; bottom: 0; left: 0; width: fit-content; height: fit-content;">
        <h4 class="alert-heading">Loading Error</h4>
        <p>Application cannot startup. Please contact your support.</p>
        <hr>
        <p class="mb-0">${error}</p>
      </div>
      `;
  }

  static #setupLocale() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',
      'Done': '完成',
      'Invalid input.': '无效输入',
    };

    if (XcSysConfig.locale === 'zh') {
      XcSysBootloader.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      XcSysBootloader.#i18n = new XcSysI18n();
    }
  }

  static #startup() {
    XcSysManager.run();

    const platform = require('os').platform();

    // Add menu
    const menu = new nw.Menu({type: 'menubar'});

    if (platform === 'darwin') {
      menu.createMacBuiltin('Design');
    }
    const submenu = new nw.Menu();
    submenu.append(new nw.MenuItem({
      label: 'New',
      click: function () {
        nw.Window.open('index.html', {
          "width": 1280,
          "height": 1080
        })
      }
    }));

    submenu.append(new nw.MenuItem({
      label: 'Version',
      click: function () {
        let version = 'Unknown';
        try {
          version = require('fs').readFileSync('version.txt', 'utf8');
        } catch (error) {
          console.error(error);
        }
        alert(`Version: ${version}`);
      }
    }));

    submenu.append(new nw.MenuItem({
      label: 'Exit',
      click: function () {
        nw.App.quit();
      }
    }));

    menu.append(new nw.MenuItem({
      label: 'App',
      submenu: submenu
    }));

    nw.Window.get().menu = menu;
  }

  static #dispatchEvent({event}) {
    setTimeout(() => {
      XcSysBootloader.#coroutine.next(event);
    }, 0);
  }

  static* #run() {
    const loadedEvent = Symbol('Loaded');
    XcSysManager.loadJavaScriptAsync({
      scriptSrc: './config', asModule: false, doneCallback: () => {
        XcSysBootloader.#dispatchEvent({event: loadedEvent});
      }
    });

    const event = yield;
    XcSysAssert({assertion: event === loadedEvent});

    // Load apps
    for (const app of XcSysConfig.apps) {
      const loadedEvent = Symbol('Loaded');
      XcSysManager.loadJavaScriptAsync({
        scriptSrc: app, asModule: false, doneCallback: () => {
          XcSysBootloader.#dispatchEvent({event: loadedEvent});
        }
      });      
      const event = yield;
      XcSysAssert({assertion: event === loadedEvent});
    }

    // Setup title
    document.title = XcSysConfig.title;

    // Setup locale
    XcSysBootloader.#setupLocale();

    XcSysBootloader.#startup();
  }

  static init() {
    nw.App.clearCache();

    XcSysBootloader.#coroutine = XcSysBootloader.#run();
    XcSysBootloader.#coroutine.next();
  }
}

XcSysBootloader.init();
