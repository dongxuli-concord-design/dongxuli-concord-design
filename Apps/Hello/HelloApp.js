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

    let helloContext = new XcSysContext({
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
