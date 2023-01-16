class Xc3dCmdView {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForMouseDown: Symbol('WaitForMouseDown'),
    WaitForMouseMoveOrUp: Symbol('WaitForMouseMoveOrUp'),
    WaitForLookAtUCS: Symbol('WaitForLookAtUCS'),
  };

  static #Event = {
    Quit: Symbol('Quit'),
    LooKAtUCS: Symbol('LooKAtUCS'),
  };

  static Model = {
    Orbit: Symbol('Orbit'),
    Pan: Symbol('Pan'),
    Zoom: Symbol('Zoom'),
  };

  #i18n;
  #state;
  #model;
  #uiContext;
  #viewManagementDiv;

  constructor() {
    this.#state = Xc3dCmdView.#CommandState.WaitForMouseDown;
    this.#model = Xc3dCmdView.Model.Orbit;

    this.#initI18n();

    const widgets = [];

    const quitButton = document.createElement('button');
    quitButton.innerHTML = this.#i18n.T`Quit`;
    quitButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdView.#Event.Quit});
    });
    widgets.push(quitButton);

    const orbitStr = this.#i18n.T`Orbit`;
    const orbitDiv = document.createElement('div');
    orbitDiv.classList.add('radio');
    orbitDiv.innerHTML = '<label><input type="radio" name="mode" checked> ' + `${orbitStr}` + '</label>';
    orbitDiv.querySelector('input').addEventListener('click', (event) => {
      this.#model = Xc3dCmdView.Model.Orbit;
    });
    widgets.push(orbitDiv);

    const panStr = this.#i18n.T`Pan`;
    const panDiv = document.createElement('div');
    panDiv.classList.add('radio');
    panDiv.innerHTML = '<label><input type="radio" name="mode"> ' + `${panStr}` + '</label>';
    panDiv.querySelector('input').addEventListener('click', (event) => {
      this.#model = Xc3dCmdView.Model.Pan;
    });
    widgets.push(panDiv);

    const zoomStr = this.#i18n.T`Zoom`;
    const zoomDiv = document.createElement('div');
    zoomDiv.classList.add('radio');
    zoomDiv.innerHTML = '<label><input type="radio" name="mode"> ' + `${zoomStr}` + '</label>';
    zoomDiv.querySelector('input').addEventListener('click', (event) => {
      this.#model = Xc3dCmdView.Model.Zoom;
    });
    widgets.push(zoomDiv);

    const lookAtUCSButton = document.createElement('button');
    lookAtUCSButton.innerHTML = this.#i18n.T`Look at UCS`;
    lookAtUCSButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdView.#Event.LooKAtUCS});
    });
    widgets.push(lookAtUCSButton);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = this.#i18n.T`Save current view`;
    saveButton.addEventListener('click', (event) => {
      const name = prompt(this.#i18n.T`Please input view name`, '');
      if (name) {
        const viewJSONData = Xc3dUIManager.getCurrentViewJSONData();
        Xc3dUIManager.setNamedView({name, viewJSONData});
        this.#updateViewManagementDiv();
      }
    });
    widgets.push(saveButton);

    // Show and delete
    this.#viewManagementDiv = document.createElement('div');
    widgets.push(this.#viewManagementDiv);
    this.#updateViewManagementDiv();

    this.#uiContext = new XcSysUIContext({
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer'
    });

    this.lastPosition = null;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Orbit': '旋转',
      'Pan': '平移',
      'Zoom': '缩放',
      'Click a position to start': '单击一个位置开始',
      'Hold and drag': '按住并拖动',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdView();
    const ret = yield* cmd.run();
    return ret;
  }

  #updateViewManagementDiv() {
    this.#viewManagementDiv.innerHTML = '';
    for (const [name, viewJSONData] of Xc3dUIManager.namedViews.entries()) {
      const setViewButton = document.createElement('button');
      setViewButton.innerHTML = name;
      setViewButton.addEventListener('click', (event) => {
        Xc3dUIManager.setCurrentView({name});
      });
      setViewButton.classList.add('btn', 'btn-outline-secondary');
      setViewButton.style.margin = '2px';

      const deleteViewButton = document.createElement('button');
      deleteViewButton.innerHTML = this.#i18n.T`Delete`;
      deleteViewButton.addEventListener('click', (event) => {
        Xc3dUIManager.deleteNamedView({name});
        this.#updateViewManagementDiv();
      });
      deleteViewButton.classList.add('btn', 'btn-outline-danger');
      deleteViewButton.style.margin = '2px';
      
      const viewDiv = document.createElement('div');
      viewDiv.appendChild(setViewButton);
      viewDiv.appendChild(deleteViewButton);
      viewDiv.classList.add('border-top');
      viewDiv.classList.add('border-bottom');
      viewDiv.style.margin = '3px';

      this.#viewManagementDiv.appendChild(viewDiv);
    }
  }

  * run() {
    while (this.#state !== Xc3dCmdView.#CommandState.Quit) {
      switch (this.#state) {
        case Xc3dCmdView.#CommandState.WaitForMouseDown:
          this.#state = yield* this.#onWaitForMouseDown();
          break;
        case Xc3dCmdView.#CommandState.WaitForMouseMoveOrUp:
          this.#state = yield* this.#onWaitForMouseMoveOrUp();
          break;
        case Xc3dCmdView.#CommandState.WaitForLookAtUCS:
          this.#state = yield* this.#onWaitForLookAtUCS();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }
  }

  * #onWaitForLookAtUCS() {
    yield* Xc3dUIManager.setViewToLookAtUCS();
    return Xc3dCmdView.#CommandState.WaitForMouseDown;
  }

  * #onWaitForMouseDown() {
    this.#uiContext.prompt = this.#i18n.T`Click a position to start`;
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [
        Xc3dCmdView.#Event.Quit, 
        Xc3dCmdView.#Event.LooKAtUCS, 
        (event) => { return event instanceof Xc3dUIMouseEvent; },
      ]
    });
    if (event === Xc3dCmdView.#Event.Quit) {
      return Xc3dCmdView.#CommandState.Quit;
    } else if (event === Xc3dCmdView.#Event.LooKAtUCS) {
      return Xc3dCmdView.#CommandState.WaitForLookAtUCS;
    } else if ((event instanceof Xc3dUIMouseEvent) && (event.type === Xc3dUIMouseEvent.TYPE.DOWN) && (event.which === 1)) {
      this.lastPosition = event.position;
      return Xc3dCmdView.#CommandState.WaitForMouseMoveOrUp;
    } else {
      return Xc3dCmdView.#CommandState.WaitForMouseDown;
    }
  }

  * #onWaitForMouseMoveOrUp() {
    this.#uiContext.prompt = this.#i18n.T`Hold and drag`;

    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [
        Xc3dCmdView.#Event.Quit, 
        Xc3dCmdView.#Event.LooKAtUCS, 
        (event) => { return event instanceof Xc3dUIMouseEvent; },
      ],
    });
    if (event === Xc3dCmdView.#Event.Quit) {
      return Xc3dCmdView.#CommandState.Quit;
    } else if ((event instanceof Xc3dUIMouseEvent) && (event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
      return Xc3dCmdView.#CommandState.WaitForMouseDown;
    } else if ((event instanceof Xc3dUIMouseEvent) && (event.type === Xc3dUIMouseEvent.TYPE.MOVE)) {
      const currentPosition = event.position;

      // Change the camera
      if (this.#model === Xc3dCmdView.Model.Orbit) {
        const orbitVector = XcGm2dPosition.subtract({position: currentPosition, positionOrVector: this.lastPosition});
        Xc3dUIManager.orbitCamera({orbitVector});
      } else if (this.#model === Xc3dCmdView.Model.Pan) {
        const panVector = XcGm2dPosition.subtract({position: currentPosition, positionOrVector: this.lastPosition});
        Xc3dUIManager.panCamera({panVector});
      } else if (this.#model === Xc3dCmdView.Model.Zoom) {
        const clientHeight = XcSysManager.canvasDiv.clientHeight;
        const deltaY = currentPosition.y - this.lastPosition.y;
        if (Math.abs(deltaY) > 1) {
          if (deltaY > 0) {
            const factor = 1 + Math.abs(deltaY) / clientHeight;
            Xc3dUIManager.zoomCamera({factor});
          } else {
            const factor = 1 - Math.abs(deltaY) / clientHeight;
            Xc3dUIManager.zoomCamera({factor});
          }
        }
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }

      this.lastPosition = currentPosition;
      Xc3dUIManager.redraw();
      return Xc3dCmdView.#CommandState.WaitForMouseMoveOrUp;
    } else {
      return Xc3dCmdView.#CommandState.WaitForMouseMoveOrUp;
    }
  }
}
