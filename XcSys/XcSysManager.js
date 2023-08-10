// We use static class for the singleton reason.
class XcSysManager {
  static canvasDiv = null;
  static outputDisplay = null;
  static promptDiv = null;
  static standardWidgetDiv = null;
  static standardDialog = null;

  static currentUiContext = null;

  static #platform = require('os').platform();
  static #appClasses = [];
  static #apps = [];
  static #mainCoroutine = null;
  static #eventQueue = null;

  static get apps() {
    return [...XcSysManager.#apps]
  }

  static loadJavaScriptAsync({scriptSrc, doneCallback, asModule = true}) {
    try {
      const {existsSync} = require('fs');
      if (scriptSrc.endsWith('.js')) {
        const script = document.createElement('script');
        // TODO: Use module after we can export symbols and in binary model.
        if (false /*asModule*/) {
          script.setAttribute('type', 'module');
        }
        script.setAttribute('src', scriptSrc);
        script.setAttribute('async', false);
        document.head.append(script);
        script.onload = function () {
          doneCallback();
        }
      } else {
        if (existsSync(`${scriptSrc}.js`)) {
          const script = document.createElement('script');
          // TODO: Use module after we can export symbols and in binary model.
          if (false /*asModule*/) {
            script.setAttribute('type', 'module');
          }

          const path = require('path');
          if (path.isAbsolute(`${scriptSrc}.js`)) {
            script.setAttribute('src', `file://${scriptSrc}.js`);
          } else {
            script.setAttribute('src', `${scriptSrc}.js`);
          }
          script.setAttribute('async', false);
          document.head.append(script);
          script.onload = function () {
            doneCallback();
          }
        } else {
          if (asModule) {
            // TODO: NW.js cannot load binary as module. This bug will be fixed after.
            //nw.Window.get().evalNWBinModule(null, `${scriptSrc}.${XcSysBootloader.platform}.bin`, `${scriptSrc}.js`);
            nw.Window.get().evalNWBin(null, `${scriptSrc}_${XcSysManager.#platform}.bin`);
          } else {
            nw.Window.get().evalNWBin(null, `${scriptSrc}_${XcSysManager.#platform}.bin`);
          }
          doneCallback();
        }
      }
    } catch (error) {
      XcSysBootloader.reportError({error});
    }
  }

  static run({customInitFunction = null, customInitFunctionArg = null} = {}) {
    // Init apps
    XcSysManager.#appClasses.forEach(appClass => {
      const app = new appClass();
      XcSysManager.#apps.push(app);
    });

    XcSysManager.#init({customInitFunction, customInitFunctionArg});
  }

  static #init({customInitFunction = null, customInitFunctionArg = null} = {}) {
    XcSysManager.#initGUI();

    XcSysManager.#eventQueue = [];

    // Process event queue
    setInterval(function () {
      if (XcSysManager.#eventQueue.length > 0) {
        const event = XcSysManager.#eventQueue.shift();

        // This will drive the XcSysManager.waitForEvent.
        XcSysManager.#mainCoroutine.next(event);
      }
    }, 0);

    // Coroutines
    try {
      XcSysManager.#mainCoroutine = XcSysMainCoroutine.run({customInitFunction, customInitFunctionArg});
      XcSysManager.#mainCoroutine.next();
    } catch (error) {
      XcSysManager.outputDisplay.error(error);
      console.error(error);
    }
  }

  static #initGUI() {
    document.body.style.cssText = 'width: 100vw; height: 100vh; min-height: 320px; overflow: auto; margin: 0px; padding: 0px';

    document.body.innerHTML =
      `
      <!-- Drawing -->
      <div style="position: fixed; left: 0px; top: 0px; width: 100vw; height:100vh; margin: 0px; padding: 0px; overflow: hidden; user-select: none; user-drag: none; ">
      </div>

      <!-- Display -->
      <xcui-display autoscroll style="position: fixed; left: 0em; top: 0em; width: fit-content; height: 5em; max-width: 50em; margin: 0.5em; overflow: auto; overflow-wrap: break-word; word-wrap: break-word; word-break:break-word;"></xcui-display>

      <!-- Prompt -->
      <div style="position: fixed; left: 0em; top: 7em; width: fit-content; height: fit-content; max-width: 30em; max-height: 3em; margin: 0.5em; overflow: auto;"></div>

      <!-- GUI div -->
      <div style="display: flex; flex-direction: row; position: fixed; left: 0px; top: 12em; width: fit-content; height: fit-content; margin: 0em; padding: 0em; overflow: hidden;">
        <!-- Standard widgets -->
        <div style = "display:flex; flex-grow: 0; flex-shrink: 0; flex-direction: column; width:15em; height: fit-content; max-height: calc(100vh - 12em); margin: 0.5em; padding-top: 0em; padding-bottom: 1em; padding-left: 0em; padding-right: 1em; overflow: auto; overflow-wrap: break-word; word-wrap:break-word; word-break:break-word;"></div>       
        <!-- Standard Dialog -->
        <div style="flex-grow: 1; flex-shrink: 1; background-color: white; border-style: solid; width: fit-content; height: fit-content; max-height: calc(100vh - 12em); margin: 05em; overflow: auto;"></div>
      </div>
      `;

    XcSysManager.canvasDiv = document.body.children[0];

    XcSysManager.outputDisplay = document.body.children[1];
    XcSysManager.promptDiv = document.body.children[2];

    XcSysManager.standardWidgetDiv = document.body.children[3].children[0];
    XcSysManager.standardDialog = document.body.children[3].children[1];

    // Init with the initial context
    XcSysManager.currentUiContext = new XcSysUIContext();

    XcSysManager.canvasDiv.style.visibility = 'hidden';
    XcSysManager.promptDiv.style.display = 'none';
    XcSysManager.standardWidgetDiv.style.display = 'none';
    XcSysManager.standardDialog.style.display = 'none';
  }

  static registerApp({appClass}) {
    XcSysAssert({assertion: !XcSysManager.#appClasses.includes(appClass)});
    appClass.init();
    XcSysManager.#appClasses.push(appClass);
  }

  static dispatchEvent({event}) {
    XcSysManager.#eventQueue.push(event);
  }

  static* peekEvent({delay}) {
    if (XcSysManager.#eventQueue.length > 0) {
      return XcSysManager.#eventQueue[0];
    }

    const timer = setTimeout(function () {
      XcSysManager.dispatchEvent({event: timer});
    }, delay);

    while (true) {
      const event = yield;
      if (event === timer) {
        return null;
      } else {
        XcSysManager.#eventQueue.push(event);
        clearTimeout(timer);
        return event;
      }
    }
  }

  static* waitForEvent({
                         uiContext,
                         expectedEventTypes,
                         timeOut = null,
                         onloadCallback = null,
                       } = {},
  ) {
    // Setup channels
    // The following IF statements are for the performance optimization purpose.
    if (XcSysManager.currentUiContext.showCanvasElement !== uiContext.showCanvasElement) {
      if (uiContext.showCanvasElement) {
        XcSysManager.canvasDiv.style.visibility = 'visible';
      } else {
        XcSysManager.canvasDiv.style.visibility = 'hidden';
      }
    }

    if (XcSysManager.currentUiContext.prompt !== uiContext.prompt) {
      XcSysManager.promptDiv.innerHTML = uiContext.prompt;
      if (uiContext.prompt) {
        XcSysManager.promptDiv.style.display = 'block';
      } else {
        XcSysManager.promptDiv.style.display = 'none';
      }
    }

    if (XcSysManager.currentUiContext.standardWidgets !== uiContext.standardWidgets) {
      if (uiContext.standardWidgets) {
        XcSysManager.standardWidgetDiv.style.display = 'flex';
      } else {
        XcSysManager.standardWidgetDiv.style.display = 'none';
      }

      XcSysManager.standardWidgetDiv.innerHTML = '';

      if (uiContext.standardWidgets) {
        uiContext.standardWidgets.forEach((widget, index) => {
          if (widget instanceof HTMLButtonElement) {
            widget.classList.add('btn', 'btn-outline-primary');
          } else if (widget instanceof HTMLInputElement) {
            widget.classList.add('form-control');
          }

          // Set some styles
          widget.style.flex = '0 0 auto';
          widget.style.margin = '3px';
          widget.style.tabIndex = index;

          XcSysManager.standardWidgetDiv.append(widget);
        });
      }
    }

    if (XcSysManager.currentUiContext.standardDialog !== uiContext.standardDialog) {
      XcSysManager.standardDialog.innerHTML = null;

      if (uiContext.standardDialog) {
        XcSysManager.standardDialog.style.display = 'block';
        XcSysManager.standardDialog.append(uiContext.standardDialog);
      } else {
        XcSysManager.standardDialog.style.display = 'none';
      }
    }

    if (XcSysManager.currentUiContext.customDiv !== uiContext.customDiv) {
      if (XcSysManager.currentUiContext.customDiv) {
        document.body.removeChild(XcSysManager.currentUiContext.customDiv);
      }

      if (uiContext.customDiv) {
        document.body.append(uiContext.customDiv);
      }
    }

    if (XcSysManager.currentUiContext.cursor !== uiContext.cursor) {
      XcSysManager.canvasDiv.style.cursor = uiContext.cursor;
    }

    XcSysManager.currentUiContext = uiContext;

    if (onloadCallback) {
      onloadCallback();
    }

    function _isQualifedEvent(event) {
      if ((event !== null) && (expectedEventTypes !== null)) {
        return expectedEventTypes.some(type => {
          if (typeof type === 'function') {
            return type(event);
          } else {
            return type === event;
          }
        });
      } else {
        return true;
      }
    }

    let timer = null;
    if (timeOut !== null) {
      // Start timer
      timer = setTimeout(function () {
        XcSysManager.dispatchEvent({event: timer});
      }, timeOut);
    }

    let event = null;
    do {
      event = yield;
    } while (!_isQualifedEvent(event) && (event !== timer));

    if (event === timer) {
      return null;
    } else {
      clearTimeout(timer);
      return event;
    }
  }

  static* sleep({delay, interruptors = []} = {}) {
    const timer = setTimeout(function () {
      XcSysManager.dispatchEvent({event: timer});
    }, delay);

    function _isQualifedEvent(event) {
      if ((event !== null) && (interruptors !== null)) {
        return interruptors.some(type => {
          if (typeof type === 'function') {
            return type(event);
          } else {
            return type === event;
          }
        });
      } else {
        return true;
      }
    }

    let event = null;
    do {
      event = yield;
    } while (!_isQualifedEvent(event) && (event !== timer));

    if (event === timer) {
      return null;
    } else {
      clearTimeout(timer);
      return event;
    }
  }

  static htmlToElement({htmlString}) {
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
    const template = document.createElement('template');
    htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlString;
    return template.content.firstChild;
  }
}
