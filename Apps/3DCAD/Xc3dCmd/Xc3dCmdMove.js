class Xc3dCmdMove {
  static #CommandState = {
    Quit: Symbol('Quit'),
    WaitForObject: Symbol('WaitForObject'),
    WaitForBasePosition: Symbol('WaitForBasePosition'),
    WaitForTransform: Symbol('WaitForTransform'),
  };

  static #Event = {
    Quit: Symbol('Quit')
  };

  #i18n;
  #state;
  #model;
  #basePosition;

  constructor() {
    this.#state = Xc3dCmdMove.#CommandState.WaitForObject;
    this.#model = null;
    this.#basePosition = null;

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Select object to transform': '选择要变换的物体',
      'Please specify base position': '请选择锚点',
      'Please input rotation, scale or translation': '请输入旋转，缩放或平移',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdMove();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while (this.#state !== Xc3dCmdMove.#CommandState.Quit) {
      switch (this.#state) {
        case Xc3dCmdMove.#CommandState.WaitForObject:
          this.#state = yield* this.#onWaitForObject();
          break;
        case Xc3dCmdMove.#CommandState.WaitForBasePosition:
          this.#state = yield* this.#onWaitForBasePosition();
          break;
        case Xc3dCmdMove.#CommandState.WaitForTransform:
          this.#state = yield* this.#onWaitForTransform();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }
  }

  * #onWaitForObject() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select object to transform`,
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdMove.#CommandState.Quit;
    } else {
      this.#model = drawableObject;

      return Xc3dCmdMove.#CommandState.WaitForBasePosition;
    }
  }

  * #onWaitForBasePosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: this.#i18n.T`Please specify base position`});
    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#basePosition = position;
      return Xc3dCmdMove.#CommandState.WaitForTransform;
    } else {
      return Xc3dCmdMove.#CommandState.Quit;
    }
  }

  * #onWaitForTransform() {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: this.#model});
    const renderingObjectCopy = renderingObject.clone();
    const originalMatrix = XcGm3dMatrix.fromThreeMatrix4({threeMatrix4: renderingObjectCopy.matrixWorld});
    Xc3dUIManager.addCustomRenderingObject({renderingObject: renderingObjectCopy});

    Xc3dUIManager.hideDrawableObject({drawableObject: this.#model});

    // TODO: UCS
    const coordinateSystem = new XcGm3dCoordinateSystem({
      origin: this.#basePosition,
    });

    const {inputState, transform} = yield* Xc3dUIManager.getTransform({
      prompt: this.#i18n.T`Please input rotation, scale or translation`,
      coordinateSystem,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
      draggingCallback: (currentMatrix) => {
        renderingObjectCopy.position.set(0, 0, 0);
        renderingObjectCopy.rotation.set(0, 0, 0);
        renderingObjectCopy.scale.set(1, 1, 1);

        renderingObjectCopy.updateMatrix();
        renderingObjectCopy.updateMatrixWorld();

        let finalMatrix = XcGm3dMatrix.multiply({matrix1: currentMatrix, matrix2: originalMatrix});
        renderingObjectCopy.applyMatrix4(finalMatrix.toThreeMatrix4());
        renderingObjectCopy.updateMatrix();
        renderingObjectCopy.updateMatrixWorld();

        Xc3dUIManager.redraw();
      }
    });

    Xc3dUIManager.showDrawableObject({drawableObject: this.#model});
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: renderingObjectCopy});

    if (inputState === Xc3dUIInputState.eInputNormal) {
      this.#model.transform({matrix: transform});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
      return Xc3dCmdMove.#CommandState.Quit;
    } else {
      return Xc3dCmdMove.#CommandState.Quit;
    }
  }
}
