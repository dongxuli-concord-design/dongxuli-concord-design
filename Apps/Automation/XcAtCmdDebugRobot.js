class XcAtCmdDebugRobot {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForDebugOption: Symbol('WaitForDebugOption'),
    WaitForForwardParameters: Symbol('WaitForForwardParameters'),
    WaitForInverseParameters: Symbol('WaitForInverseParameters'),
    WaitForTransform: Symbol('WaitForTransform'),
    WaitForAnimation: Symbol('WaitForAnimation'),
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    Forward: Symbol('Forward'),
    Inverse: Symbol('Inverse'),
    Transform: Symbol('Transform'),
    Animation: Symbol('Animation'),
    Update: Symbol('Update'),
  };

  #i18n;
  #state;

  constructor() {
    if (XcRsApp.robot) {
      this.#state = XcAtCmdDebugRobot.#CommandState.WaitForDebugOption;
    } else {
      XcSysManager.outputDisplay.error('Please setup robot first.');
      this.#state = XcAtCmdDebugRobot.#CommandState.Cancel;
    }

    this.#initI18n();
  }

  static* command() {
    const cmd = new XcAtCmdDebugRobot();
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
    while ((this.#state !== XcAtCmdDebugRobot.#CommandState.Done) && (this.#state !== XcAtCmdDebugRobot.#CommandState.Cancel)) {
      switch (this.#state) {
        case XcAtCmdDebugRobot.#CommandState.WaitForDebugOption:
          this.#state = yield* this.#onWaitForDebugOption();
          break;
        case XcAtCmdDebugRobot.#CommandState.WaitForForwardParameters:
          this.#state = yield* this.#onWaitForForwardParameters();
          break;
        case XcAtCmdDebugRobot.#CommandState.WaitForInverseParameters:
          this.#state = yield* this.#onWaitForInverseParameters();
          break;
        case XcAtCmdDebugRobot.#CommandState.WaitForTransform:
          this.#state = yield* this.#onWaitForTransform();
          break;
        case XcAtCmdDebugRobot.#CommandState.WaitForAnimation:
          this.#state = yield* this.#onWaitForAnimation();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    return this.#state;
  }

  * #onWaitForDebugOption() {
    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Done});
    });
    widgets.push(doneButton);

    const resetButton = document.createElement('button');
    resetButton.innerHTML = this.#i18n.T`Reset`;
    resetButton.addEventListener('click', (event) => {
      XcRsApp.robot.angles = [0, 0, 0, 0, 0, 0];
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();
    });
    widgets.push(resetButton);

    const forwardButton = document.createElement('button');
    forwardButton.innerHTML = this.#i18n.T`Forward debug`;
    forwardButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Forward});
    });
    widgets.push(forwardButton);

    const inverseButton = document.createElement('button');
    inverseButton.innerHTML = this.#i18n.T`Inverse debug`;
    inverseButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Inverse});
    });
    widgets.push(inverseButton);

    const transformButton = document.createElement('button');
    transformButton.innerHTML = this.#i18n.T`Transform debug`;
    transformButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Transform});
    });
    widgets.push(transformButton);

    const animationButton = document.createElement('button');
    animationButton.innerHTML = this.#i18n.T`Animation debug`;
    animationButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Animation});
    });
    widgets.push(animationButton);

    const uiContext = new XcSysContext({
      prompt: this.#i18n.T`Debug robot`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [XcAtCmdDebugRobot.#Event.Done, XcAtCmdDebugRobot.#Event.Forward, XcAtCmdDebugRobot.#Event.Inverse, XcAtCmdDebugRobot.#Event.Transform, XcAtCmdDebugRobot.#Event.Animation]
    });
    if (event === XcAtCmdDebugRobot.#Event.Done) {
      return XcAtCmdDebugRobot.#CommandState.Done;
    } else if (event === XcAtCmdDebugRobot.#Event.Forward) {
      return XcAtCmdDebugRobot.#CommandState.WaitForForwardParameters;
    } else if (event === XcAtCmdDebugRobot.#Event.Inverse) {
      return XcAtCmdDebugRobot.#CommandState.WaitForInverseParameters;
    } else if (event === XcAtCmdDebugRobot.#Event.Transform) {
      return XcAtCmdDebugRobot.#CommandState.WaitForTransform;
    } else if (event === XcAtCmdDebugRobot.#Event.Animation) {
      return XcAtCmdDebugRobot.#CommandState.WaitForAnimation;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForForwardParameters() {
    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Done});
    });
    widgets.push(doneButton);

    const angles = [...XcRsApp.robot.angles];
    const anglesTextArea = document.createElement('textarea');
    anglesTextArea.setAttribute('rows', '2');
    anglesTextArea.setAttribute('cols', '30');
    anglesTextArea.innerHTML = `[${angles[0]}, ${angles[1]}, ${angles[2]}, ${angles[3]}, ${angles[4]}, ${angles[5]}]`;
    widgets.push(anglesTextArea);

    const updateRobot = () => {
      try {
        Xc3dUIManager.clearCustomRenderingObjects();
        const angles = eval(anglesTextArea.value);
        XcRsApp.robot.angles = angles;
        Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.error(error);
      }
    }

    const updateButton = document.createElement('button');
    updateButton.innerHTML = this.#i18n.T`Update`;
    updateButton.addEventListener('click', (event) => {
      updateRobot();
    });
    widgets.push(updateButton);

    const uiContext = new XcSysContext({
      prompt: this.#i18n.T`Debug robot`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [XcAtCmdDebugRobot.#Event.Done]
    });
    if (event === XcAtCmdDebugRobot.#Event.Done) {
      updateRobot();
      return XcAtCmdDebugRobot.#CommandState.WaitForDebugOption;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForInverseParameters() {
    const widgets = [];

    const doneButton = document.createElement('button');
    doneButton.innerHTML = this.#i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: XcAtCmdDebugRobot.#Event.Done});
    });
    widgets.push(doneButton);

    const tcpTextArea = document.createElement('textarea');
    tcpTextArea.setAttribute('rows', '2');
    tcpTextArea.setAttribute('cols', '30');
    tcpTextArea.innerHTML = `[${XcRsApp.robot.target[0]}, ${XcRsApp.robot.target[1]}, ${XcRsApp.robot.target[2]}, ${XcRsApp.robot.target[3]}, ${XcRsApp.robot.target[4]}, ${XcRsApp.robot.target[5]}]`;
    widgets.push(tcpTextArea);

    const updateButton = document.createElement('button');
    updateButton.innerHTML = this.#i18n.T`Update`;
    updateButton.addEventListener('click', (event) => {
      try {
        Xc3dUIManager.clearCustomRenderingObjects();
        const target = eval(tcpTextArea.value);
        XcRsApp.robot.target = {
          x: target[0],
          y: target[1],
          z: target[2],
          a: target[3],
          b: target[4],
          c: target[5],
        };
        Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});

        Xc3dUIManager.redraw();
      } catch (error) {
        XcSysManager.outputDisplay.error(error);
      }
    });
    widgets.push(updateButton);

    const uiContext = new XcSysContext({
      prompt: this.#i18n.T`Debug robot`,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'pointer',
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContext,
      expectedEventTypes: [XcAtCmdDebugRobot.#Event.Done]
    });
    if (event === XcAtCmdDebugRobot.#Event.Done) {
      return XcAtCmdDebugRobot.#CommandState.WaitForDebugOption;
    } else {
      XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
    }
  }

  * #onWaitForTransform() {
    const target = XcRsApp.robot.target;
    const location = new XcGm3dPosition({x: target[0], y: target[1], z: target[2]});
    const eulerAngles = new THREE.Euler(target[3], target[4], target[5], 'XYZ');
    const xDir = new THREE.Vector3(1, 0, 0);
    const yDir = new THREE.Vector3(0, 1, 0);
    const zDir = new THREE.Vector3(0, 0, 1);
    xDir.applyEuler(eulerAngles);
    yDir.applyEuler(eulerAngles);
    zDir.applyEuler(eulerAngles);
    const xVector = XcGm3dVector.fromThreeVector3({threeVector3: xDir});
    const yVector = XcGm3dVector.fromThreeVector3({threeVector3: yDir});
    const zVector = XcGm3dVector.fromThreeVector3({threeVector3: zDir});

    const coordinateSystem = new XcGmCoordinateSystem({
      origin: location,
      zAxisDirection: zVector,
      xAxisDirection: xVector,
    });

    const axisLength = (XcSysManager.canvasDiv.clientHeight / 8.0) / Xc3dUIManager.getNumPixelsInUnit();
    const xArrow = new THREE.ArrowHelper(xDir, location.toThreeVector3(), axisLength, new THREE.Color('red'));
    const yArrow = new THREE.ArrowHelper(yDir, location.toThreeVector3(), axisLength, new THREE.Color('green'));
    const zArrow = new THREE.ArrowHelper(zDir, location.toThreeVector3(), axisLength, new THREE.Color('blue'));
    const arrows = new THREE.Group();
    arrows.add(xArrow);
    arrows.add(yArrow);
    arrows.add(zArrow);

    Xc3dUIManager.addCustomRenderingObject({renderingObject: arrows});

    const {inputState, transform} = yield* Xc3dUIManager.getTransform({
      prompt: this.#i18n.T`Please input rotation, scale or translation`,
      coordinateSystem,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      draggingCallback: (currentMatrix) => {
        arrows.position.set(0, 0, 0);
        arrows.rotation.set(0, 0, 0);
        arrows.scale.set(1, 1, 1);

        arrows.updateMatrix();
        arrows.updateMatrixWorld();

        arrows.applyMatrix4(currentMatrix.toThreeMatrix4());
        arrows.updateMatrix();
        arrows.updateMatrixWorld();

        Xc3dUIManager.redraw();
      }
    });
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: arrows});

    if (inputState === Xc3dUIInputState.eInputNormal) {
      location.transform({matrix: transform});
      location.transform({matrix: transform});
      xVector.transform({matrix: transform});
      yVector.transform({matrix: transform});
      zVector.transform({matrix: transform});
      xVector.normalize();
      yVector.normalize();
      zVector.normalize();
      const newCoordinateSystem = new XcGmCoordinateSystem({
        origin: location,
        zAxisDirection: zVector,
        xAxisDirection: xVector,
      });
      const rotationMatrix = newCoordinateSystem.toMatrix();
      const newEulerAngle = new THREE.Euler();
      newEulerAngle.setFromRotationMatrix(rotationMatrix.toThreeMatrix4());

      XcRsApp.robot.target = {
        x: location.x,
        y: location.y,
        z: location.z,
        a: newEulerAngle.x,
        b: newEulerAngle.y,
        c: newEulerAngle.z
      };
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();

      return XcAtCmdDebugRobot.#CommandState.WaitForTransform;
    } else {
      return XcAtCmdDebugRobot.#CommandState.WaitForDebugOption;
    }
  }

  * #onWaitForAnimation() {
    const target = XcRsApp.robot.target;
    const location = new XcGm3dPosition({x: target[0], y: target[1], z: target[2]});
    const eulerAngles = new THREE.Euler(target[3], target[4], target[5], 'XYZ');

    for (let i = 0; i < 5; i += 1) {
      location.y += 0.05;
      XcRsApp.robot.target = {
        x: location.x,
        y: location.y,
        z: location.z,
        a: eulerAngles.x,
        b: eulerAngles.y,
        c: eulerAngles.z
      };
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();
      yield* XcSysManager.sleep({delay: 1});
    }

    for (let i = 0; i < 5; i += 1) {
      location.z -= 0.05;
      XcRsApp.robot.target = {
        x: location.x,
        y: location.y,
        z: location.z,
        a: eulerAngles.x,
        b: eulerAngles.y,
        c: eulerAngles.z
      };
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();
      yield* XcSysManager.sleep({delay: 1});
    }

    for (let i = 0; i < 5; i += 1) {
      location.y -= 0.05;
      XcRsApp.robot.target = {
        x: location.x,
        y: location.y,
        z: location.z,
        a: eulerAngles.x,
        b: eulerAngles.y,
        c: eulerAngles.z
      };
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();
      yield* XcSysManager.sleep({delay: 1});
    }

    for (let i = 0; i < 5; i += 1) {
      location.z += 0.05;
      XcRsApp.robot.target = {
        x: location.x,
        y: location.y,
        z: location.z,
        a: eulerAngles.x,
        b: eulerAngles.y,
        c: eulerAngles.z
      };
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: XcRsApp.robot});
      Xc3dUIManager.redraw();
      yield* XcSysManager.sleep({delay: 1});
    }

    return XcAtCmdDebugRobot.#CommandState.WaitForDebugOption;
  }
}
