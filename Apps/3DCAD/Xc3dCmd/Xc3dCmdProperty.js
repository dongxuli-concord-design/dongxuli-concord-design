class Xc3dCmdProperty {
  static #CommandState = {
    Cancel: Symbol('Cancel'),
    Done: Symbol('Done'),
    WaitForModel: Symbol('WaitForModel'),
    WaitForProperty: Symbol('WaitForProperty'),
  };

  static #Event = {
    Cancel: Symbol('Cancel'),
    Done: Symbol('Done'),
  };

  #i18n;
  #state;
  #model;
  #oldName;
  #oldColor;
  #highlightingRenderingObject;

  constructor() {
    this.#state = Xc3dCmdProperty.#CommandState.WaitForModel;
    this.#model = null;
    this.#highlightingRenderingObject = null;

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Specify the object to set property': '选择要修改属性的物体',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Done': '完成',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdProperty();
    yield* cmd.run();
  }

  * run() {
    while ((this.#state !== Xc3dCmdProperty.#CommandState.Done) && (this.#state !== Xc3dCmdProperty.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdProperty.#CommandState.WaitForModel:
          this.#state = yield* this.#onWaitForModel();
          break;
        case Xc3dCmdProperty.#CommandState.WaitForProperty:
          this.#state = yield* this.#onWaitForProperty();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#highlightingRenderingObject) {
      Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#highlightingRenderingObject});
      this.#highlightingRenderingObject = null;
    }
  }

  * #onWaitForModel() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Specify the object to set property`
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdProperty.#CommandState.Cancel;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdProperty.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#model = drawableObject;
      this.#oldName = this.#model.name;
      this.#oldColor = this.#model.color;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      this.#highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#highlightingRenderingObject});

      Xc3dUIManager.redraw();

      return Xc3dCmdProperty.#CommandState.WaitForProperty;
    }
  }

  * #onWaitForProperty() {
    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdProperty.#Event.Cancel});
    });
    widgets.push(cancelButton);

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdProperty.#Event.Done});
    });
    widgets.push(doneButton);

    this.nameInput = document.createElement('label');
    this.nameInput.innerHTML = 'Name <input name="name" type="text" >';
    this.nameInput.querySelector('input').value = this.#model.name;
    widgets.push(this.nameInput);

    this.colorInput = document.createElement('label');
    this.colorInput.innerHTML = 'Color <input name="color" type="color" style="width:8em;">';
    this.colorInput.querySelector('input').addEventListener('input', (event) => {
      this.#model.color = new THREE.Color(this.colorInput.querySelector('input').value);
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
    });
    this.colorInput.querySelector('input').value = `#${this.#model.color? this.#model.color.getHexString() : ''}`;
    widgets.push(this.colorInput);

    const uiContext = new XcSysContext({
      prompt: this.#i18n.T`Please select object`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext,
      expectedEventTypes: [Xc3dCmdProperty.#Event.Cancel, Xc3dCmdProperty.#Event.Done]
    });

    if (event === Xc3dCmdProperty.#Event.Cancel) {
      this.#model.name = this.#oldName;
      this.#model.color = this.#oldColor;
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
      return Xc3dCmdProperty.#CommandState.Cancel;
    } else if (event === Xc3dCmdProperty.#Event.Done) {
      this.#model.name = this.nameInput.querySelector('input').value;
      this.#model.color = new THREE.Color(this.colorInput.querySelector('input').value);
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
      return Xc3dCmdProperty.#CommandState.Done;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }
}
