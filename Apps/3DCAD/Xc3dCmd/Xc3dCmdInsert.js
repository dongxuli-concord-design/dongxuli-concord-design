class Xc3dCmdInsert {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForDocument: Symbol('WaitForDocument'),
    WaitForPosition: Symbol('WaitForPosition')
  };

  static #Event = {
    Cancel: Symbol('Cancel'),
    DocumentSelected: Symbol('DocumentSelected')
  };

  #i18n;
  #state;
  #pathName;
  #externalDocument;
  #position;
  #uiContext;

  constructor() {
    this.#state = Xc3dCmdInsert.#CommandState.WaitForDocument;
    this.#pathName = null;
    this.#externalDocument = null;
    this.#position = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition: new XcGm3dPosition()});

    this.#initI18n();

    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdInsert.#Event.Cancel});
    });
    widgets.push(cancelButton);

    const fileChooser = document.createElement('input');
    fileChooser.setAttribute('type', 'file');
    fileChooser.setAttribute('data-id', 'filedialog');
    fileChooser.style.display = "none";
    widgets.push(fileChooser);
    const fileChooseButton = document.createElement('button');
    fileChooseButton.innerHTML = this.#i18n.T`Select file`;
    fileChooseButton.addEventListener('click', (event) => {
      fileChooser.addEventListener("change", (event) => {
        if (event.target.value) {
          this.#pathName = event.target.value;
          XcSysManager.dispatchEvent({event: Xc3dCmdInsert.#Event.DocumentSelected});
        }
      }, false);

      fileChooser.click();
    });
    widgets.push(fileChooseButton);

    this.#uiContext = new XcSysUIContext({
      prompt: this.#i18n.T`Please select file`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',


    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdInsert();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdInsert.#CommandState.Done) && (this.#state !== Xc3dCmdInsert.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdInsert.#CommandState.WaitForDocument:
          this.#state = yield* this.#onWaitForDocument();
          break;
        case Xc3dCmdInsert.#CommandState.WaitForPosition:
          this.#state = yield* this.#onWaitForPosition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdInsert.#CommandState.Done) {
      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#position.toVector()});
      this.#externalDocument.transform({matrix});

      Xc3dUIManager.document.addDrawableObject({drawableObject: this.#externalDocument});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForDocument() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmdInsert.#Event.Cancel, event === Xc3dCmdInsert.#Event.DocumentSelected]
    });

    if (event === Xc3dCmdInsert.#Event.Cancel) {
      return Xc3dCmdInsert.#CommandState.Cancel;
    } else if (event === Xc3dCmdInsert.#Event.DocumentSelected) {
      this.#externalDocument = new Xc3dDocExternalDocument({filePath: this.#pathName, document: Xc3dUIManager.document});
      return Xc3dCmdInsert.#CommandState.WaitForPosition;
    } else {
      return Xc3dCmdInsert.#CommandState.WaitForDocument;
    }
  }

  * #onWaitForPosition() {
    const renderingObject = this.#externalDocument.generateRenderingObject();
    Xc3dUIManager.addCustomRenderingObject({renderingObject});

    const {inputState, position} = yield* Xc3dUIManager.getPosition({
      prompt: this.#i18n.T`Please specify location`,
      draggingCallback: function (point) {
        //console.log('update graphics in cmd... Screenpoint:', pointInScreen.x, pointInScreen.y,
        //   '3D point ', point.x, point.y, point.z);
        renderingObject.position.copy(point.toThreeVector3());
        Xc3dUIManager.redraw();
      }
    });

    Xc3dUIManager.removeCustomRenderingObject({renderingObject});
    Xc3dUIManager.redraw();

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdInsert.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdInsert.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#position = position;
      return Xc3dCmdInsert.#CommandState.Done;
    }
  }
}
