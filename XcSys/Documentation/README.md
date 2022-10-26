# Introduction

The XcSys provides very fundamental classes and functions for the whole system.

The classes in this module include:
* **XcSysApp** Define an application object which can be loaded by the system.
* **XcSysUIContext** Define an user interface context in a system.
* **XcSysI18n** Provide i18n tools.
* **XcSysAssert** Provide assertion functionality.
* **XcSysManager** Provide basic system management functionalities, including user interface, system control flow, load scripts etc.

# XcSysApp

Define an application object. A user-defined application class should be extended from this class.

Example:
```
class HelloApp extends XcSysApp {
  static #CommandState = {
    SayHello: Symbol('SayHello'),
  };
  static #Event = {
    Quit: Symbol('Quit'),
  };
  #state = HelloApp.#CommandState.SayHello;

  constructor() {
    super();
    this.name = 'Hello';
    this.description = 'This is a Hello app!';
    this.icon = 'Apps/Hello/res/icon.png';
    this.entry = Hello_command;
  }

  static init() {
  }

  * sayHello() {
    let helloUI = [];
    let sayHelloButton = document.createElement('button');
    sayHelloButton.innerHTML = `sayHello`;
    sayHelloButton.addEventListener('click', (event) => {
      alert('HelloApp!');
    });
    helloUI.push(sayHelloButton);

    let helloView = document.createElement('div');
    helloView.style.cssText = "display: flex; position: fixed; width: fit-content; max-width: 700px; max-height: 98vh; top: 1em; left: 20em; overflow: auto;";
    helloView.innerHTML = `
        <div>
          <h1>Hello World!</h1>
        </div>        
    `;

    let helloContext = new XcSysUIContext({
      prompt: `Say Hello!`,
      showCanvasElement: true,
      standardWidgets: helloUI,
      customDiv: helloView
    });

    let event = yield* XcSysManager.waitForEvent({
      uiContext: helloContext,
    });

    return HelloApp.#CommandState.SayHello;
  }

  * run() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    XcSysManager.canvasDiv.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    while (true) {
      switch (this.#state) {
        case HelloApp.#CommandState.SayHello:
          this.#state = yield* this.sayHello();
          break;
        default:
          XcSysAssert({assertion: false, message: `Internal command #state error`});
          break;
      }
    }
  }
}

function* Hello_command() {
  let cmd = new HelloApp();
  yield* cmd.run();
}

XcSysManager.registerApp({appClass: HelloApp});
```

## constructor

`constructor({name, description, icon, initGenerator})`

* **name** The app name.
* **description** The app description.
* **icon** The path to the app icon file. e.g., 'Apps/Hello/res/icon.png'.
* **entry** The entry generator function.

## static init()

`static init()`

This initialization function will be called when the application object is loaded by the system.

# XcSysUIContext

Define the system context, including the prompt, canvas, standard widgets, stand dialog, custom HTML Div element, and cursor shape.

The elements in the context look like:

_________________________________________________________
[prompt]

[standard widget]     [standard dialog]
[standard widget]     [background canvas(100% screen size)]
...                   [custom div (could be anywhere)]
[standard widget]
__________________________________________________________

## constructor

```
constructor({
                prompt = null,
                showCanvasElement = false,
                standardWidgets = null,
                standardDialog = null,
                customDiv = null,
                cursor = 'auto'
              } = {})
```

* **prompt** The prompt to be displayed.
* **showCanvasElement** Boolean flag to show or hide canvas element.
* **standardWidgets** Standard HTML widgets to be displayed in the default position.
* **standardDialog** Standard HTML dialog to be displayed in the default position.
* **customDiv** Custom HTML Div to be displayed in the custom position.
* **cursor** The cursor shape.

# XcSysAssert

`function XcSysAssert({assertion, message = 'Unknown'})`

* **assertion** Any boolean assertion. If the assertion is false, the message is reported by the system.
* **message** A description string.

# XcSysConfig

```
class XcSysConfig {
  static title = '协和 Concord';
  static server = 'http://localhost';
  static locale = 'en';
  static apps = [];
  static debug = false;
}
```

XcSysConfig could be configured in the `config.js`.

## title

`static title`

The system title.

## locale

`static locale`

The system language.

## apps

`static apps`

The apps to be loaded by the system. With the provided app name `foo`, the system will try `foo.js` first and then `foo.bin` when `js` file is not there.

Example:
```
XcSysConfig.apps = [
  "Apps/Hello/Hello",
  "Apps/MyApp/MyApp",
];
```


# XcSysI18n

This class provides i18n functionalities.

Example:

```
let messageBundle_zh = {
      'Ready': '就绪',
      'Hello {0}, you have {1} in your bank account.': '你好{0}，你有{1}在您的銀行帳戶。'    
};

  let modulei18n = null;

    if (XcSysConfig.locale === 'zh') {
      modulei18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      modulei18n = new XcSysI18n();
    }

    let message1 = modulei18n.T`Ready`});
    let message2 = modulei18n.T`Hello ${name}, you have ${amount}:c in your bank account.`});

```

## constructor

`constructor({messageBundle = null} = {})`

## T

`T(strings, ...values)`

Get translated string from template keys.

# XcSysManager

The fundalmental class to manage the system, which provides many basic functionalities.

## canvasDiv

`static canvasDiv`

The HTML div element which contains a HTML canvas. This div covers the whole viewport.

## outputDisplay

`static outputDisplay`

The HTML element (`XcUIDisplay`) which is for outputting messages. This element is located on the left top of the viewport.

## promptDiv

`static promptDiv`

The HTML element which is for displaying prompt message. The element is located just below the `outputDisplay` element.

## standardWidgetDiv

`static standardWidgetDiv`

The HTML div container for the standard HTML widgets, which is located at the left side of the viewport.

## standardDialog

`static standardDialog`

The HTML div container for the standard HTML dialog, which is located at the center of the viewport.

## apps (generator)

`static * apps()`

* **return** Array of apps.

Iterate `XcSysApp` objects.

Example:

```
for (let app of XcSysManager.apps()) {
  console.log(app.name, app.description);
}
```

## loadJavascriptAsync

` static loadJavascriptAsync({scriptSrc, doneCallback, asModule = true})`

* **scriptSrc** Source of the script.
* **doneCallback** Callback function when the script loading is done.
* **asModule** Boolean flag indicating if the script is loaded as module.

## run

`static run({customInitFunction = null, customInitFunctionArg = null} = {}) `

It starts the XcSysManager.

* **customInitFunction** The initialization function called when running the system.
* **customInitFunctionArg** The argument for the initialization function.

## registerApp

`static registerApp({appClass})`

Register an `XcSysApp` object.

## dispatchEvent

`static dispatchEvent({event})`

Dispatch an event to the system. The event could be any object.

Example:

```
XcSysManager.#dispatchEvent('stop');

let myEvent = Symbol('my event');
XcSysManager.#dispatchEvent(myEvent);
```

## peekEvent

`static* peekEvent({delay}) `

Wait for some time to check if there is event in the event queue.

* millis milli-seconds Example:

```
      let hasEvent = yield* XcSysManager.peekEvent({delay: 300});
      if (hasEvent) {
        return;
      }
```

## waitForEvent

```
static* waitForEvent({uiContext = new XcSysUIContext(), timeOut = null, expectedEventTypes = null} = {})
```

* **uiContext** XcSysUIContext object representing the context for this call. 
* **timeOut** Time in milliseconds.
* **expectedEventTypes** Array of expected event types.
* **return** Array of apps.


Pause the current generator function and wait for the event. `uiContext` is to set the current context of the moment of waiting events.

If the `timeOut` is set, this function will return after the time is up.

If `expectedEventTypes` is set, this function will return only the expected event types are caught.

Example:

```
    let uiContext = new XcSysUIContext({
      prompt: 'hello',
      showCanvasElement: true,
      cursor: 'pointer',
    });

    let event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext
    });

    // Dispatch event somewhere else
    // XcSysManager.dispatchEvent({event: 'my event'});

```

## sleep

`static* sleep({delay, interruptors = []} = {})`

## htmlToElement

`static htmlToElement({htmlString})`

* **htmlString** An HTML element string.
* **return** An HTML element.

Generate an HTML element from an HTML element string.

Example:
`    let 零件编号输入 = XcSysManager.htmlToElement(`<label>待检验零件编号<input type="text" value=${Vim生成零件编号()} data-id="零件编号"></label>`);`

## htmlToElements

`static htmlToElements({htmlStringArray})`

* **htmlStringArray** An array of HTML element strings.
* **return** Array of HTML elements.

Generate HTML elements from an array of HTML element strings.

Example:
`    let 等待轮廓界面 = XcSysManager.htmlToElements(['<button>button1</button>', '<button>button2</button>']);`
