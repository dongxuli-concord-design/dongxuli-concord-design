class XcAtCmdSetupRobot {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForGeometryDefinition: Symbol('WaitForGeometryDefinition'),
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
  };

  #i18n;
  #state;

  constructor() {
    this.#state = XcAtCmdSetupRobot.#CommandState.WaitForGeometryDefinition;
    this.#initI18n();
  }

  static* command() {
    const cmd = new XcAtCmdSetupRobot();
    const ret = yield* cmd.run();
    return ret;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    while ((this.#state !== XcAtCmdSetupRobot.#CommandState.Done) && (this.#state !== XcAtCmdSetupRobot.#CommandState.Cancel)) {
      switch (this.#state) {
        case XcAtCmdSetupRobot.#CommandState.WaitForGeometryDefinition:
          this.#state = yield* this.#onWaitForGeometryDefinition();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.clearCustomRenderingObjects();

    return this.#state;
  }

  * #onWaitForGeometryDefinition() {
    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdSetupRobot.#Event.Done});
    });
    widgets.push(doneButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = this.#i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdSetupRobot.#Event.Cancel});
    });
    widgets.push(cancelButton);

    const updateButton = document.createElement('button');
    updateButton.innerHTML = this.#i18n.T`Update`;
    updateButton.addEventListener('click', (event) => {
      try {
        Xc3dUIManager.clearCustomRenderingObjects();
        const geometryDefinition = JSON.parse(geometryDefinitionTextArea.value);
        const robot = new XcAtDoc6DOFRobotArm({geometryDefinition});
        Xc3dUIManager.addCustomRenderingObject({renderingObject: robot.renderingObject});

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.error(error);
      }
    });
    widgets.push(updateButton);

    const geometryDefinitionTextArea = document.createElement('textarea');
    geometryDefinitionTextArea.setAttribute('rows', '7');
    geometryDefinitionTextArea.setAttribute('cols', '35');
    geometryDefinitionTextArea.innerHTML =
      `
      [
      [0, 0, 0.73],
      [0, 0, 0.5],
      [0, 0, 0.2],
      [0.23, 0, 0],
      [0.36, 0, 0]
      ]
    `;
    widgets.push(geometryDefinitionTextArea);

    const uiContext = new XcSysContext({
      prompt: this.#i18n.T`Please input robot geometry definition`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [XcAtCmdSetupRobot.#Event.Done, XcAtCmdSetupRobot.#Event.Cancel]
    });
    if (event === XcAtCmdSetupRobot.#Event.Cancel) {
      return XcAtCmdSetupRobot.#CommandState.Cancel;
    } else if (event === XcAtCmdSetupRobot.#Event.Done) {
      try {
        if (XcRsApp.robot) {
          Xc3dUIManager.document.removeDrawableObject({drawableObject: XcRsApp.robot});
          XcRsApp.robot = null;
        }

        const geometryDefinition = eval(geometryDefinitionTextArea.value);
        XcRsApp.robot = new XcAtDoc6DOFRobotArm({geometryDefinition});
        Xc3dUIManager.document.addDrawableObject({drawableObject: XcRsApp.robot});

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.error(error);
      }
      return XcAtCmdSetupRobot.#CommandState.Done;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }
}
