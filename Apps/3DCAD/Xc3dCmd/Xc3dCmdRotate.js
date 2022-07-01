class Xc3dCmdRotate {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForBody: Symbol('WaitForBody'),
    WaitForAxis: Symbol('WaitForAxis'),
    WaitForAngle: Symbol('WaitForAngle')
  };

  #i18n;
  #state;
  #model;
  #axis;
  #angle;
  #hints;

  constructor() {
    this.#state = Xc3dCmdRotate.#CommandState.WaitForBody;
    this.#model = null;
    this.#axis = new XcGm3dAxis();
    this.#angle = Math.PI * 2.0;
    this.#hints = new THREE.Group();

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Select an object to rotate': '选择要旋转的对象',
      'Specify the rotation axis': '指定旋转轴',
      'Rotation angle': '旋转角度',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdRotate();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdRotate.#CommandState.Done) && (this.#state !== Xc3dCmdRotate.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdRotate.#CommandState.WaitForBody:
          this.#state = yield* this.#onWaitForBody();
          break;
        case Xc3dCmdRotate.#CommandState.WaitForAxis:
          this.#state = yield* this.#onWaitForAxis();
          break;
        case Xc3dCmdRotate.#CommandState.WaitForAngle:
          this.#state = yield* this.#onWaitForAngle();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdRotate.#CommandState.Done) {
      const matrix = XcGm3dMatrix.rotationMatrix({angle: this.#angle, axis: this.#axis});
      this.#model.transform({matrix});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForBody() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({prompt: this.#i18n.T`Select an object to rotate`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdRotate.#CommandState.Cancel;
    } else {
      this.#model = drawableObject;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      this.#hints.add(highlightingRenderingObject);
      Xc3dUIManager.redraw();

      return Xc3dCmdRotate.#CommandState.WaitForAxis;
    }
  }

  * #onWaitForAxis() {
    const {
      inputState,
      position,
      direction
    } = yield* Xc3dUIManager.getAxis({prompt: this.#i18n.T`Specify the rotation axis`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdRotate.#CommandState.Cancel;
    } else {
      this.#axis.position = position;
      this.#axis.direction = direction;
      return Xc3dCmdRotate.#CommandState.WaitForAngle;
    }
  }

  * #onWaitForAngle() {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: this.#model});
    const tmpRenderingObject = renderingObject.clone();
    this.#hints.add(tmpRenderingObject);

    const arrowHelper = new THREE.ArrowHelper(this.#axis.direction.toThreeVector3(), this.#axis.position.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
    this.#hints.add(arrowHelper);

    let lastAngle = 0;

    const {inputState, angle} = yield* Xc3dUIManager.getAngle({
        prompt: this.#i18n.T`Rotation angle`,
        draggingIntensity: Xc3dUIManager.DraggingIntensity.LOW,
        draggingCallback: (angle) => {
          Xc3dUIManager.hideDrawableObject({drawableObject: this.#model});
          const angleDifference = angle - lastAngle;
          const rotationMatrix = XcGm3dMatrix.rotationMatrix({angle: angleDifference, axis: this.#axis});
          tmpRenderingObject.applyMatrix4(rotationMatrix.toThreeMatrix4());
          lastAngle = angle;
          Xc3dUIManager.redraw();
        }
      }
    );

    Xc3dUIManager.showDrawableObject({drawableObject: this.#model});
    this.#hints.remove(tmpRenderingObject);
    this.#hints.remove(arrowHelper);

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdRotate.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdRotate.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#angle = angle;
      return Xc3dCmdRotate.#CommandState.Done;
    }
  }
}
