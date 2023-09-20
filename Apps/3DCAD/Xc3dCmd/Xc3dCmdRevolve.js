class Xc3dCmdRevolve {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForProfile: Symbol('WaitForProfile'),
    WaitForAxis: Symbol('WaitForAxis'),
    WaitForAngle: Symbol('WaitForAngle')
  };

  #i18n;
  #state;
  #profileBody;
  #model;
  #axis;
  #angle;
  #hints;

  constructor() {
    this.#state = Xc3dCmdRevolve.#CommandState.WaitForProfile;
    this.#profileBody = null;
    this.#model = null;
    this.#axis = new XcGm3dAxis();
    this.#angle = Math.PI * 2.0;
    this.#hints = new THREE.Group();
    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdRevolve();
    const ret = yield* cmd.run();
    return ret;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Select an object to revolve': '选择要旋转的对象',
      'Specify the revolving axis': '指定旋转轴',
      'Revolution angle': '旋转角度',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdRevolve.#CommandState.Done) && (this.#state !== Xc3dCmdRevolve.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdRevolve.#CommandState.WaitForProfile:
          this.#state = yield* this.#onWaitForProfile();
          break;
        case Xc3dCmdRevolve.#CommandState.WaitForAxis:
          this.#state = yield* this.#onWaitForAxis();
          break;
        case Xc3dCmdRevolve.#CommandState.WaitForAngle:
          this.#state = yield* this.#onWaitForAngle();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdRevolve.#CommandState.Done) {
      this.#profileBody.spin({axis: this.#axis, angle: this.#angle});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
      Xc3dUIManager.redraw();
    }

    return this.#state;
  }

  * #onWaitForProfile() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select an object to revolve`,
      filter: (object) => object instanceof Xc3dDocModel,
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdRevolve.#CommandState.Cancel;
    } else {
      this.#profileBody = drawableObject.body;
      this.#model = drawableObject;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
      const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      this.#hints.add(highlightingRenderingObject);
      Xc3dUIManager.redraw();

      return Xc3dCmdRevolve.#CommandState.WaitForAxis;
    }
  }

  * #onWaitForAxis() {
    const {
      inputState,
      position,
      direction
    } = yield* Xc3dUIManager.getAxis({prompt: this.#i18n.T`Specify the revolving axis`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdRevolve.#CommandState.Cancel;
    } else {
      this.#axis.position = position;
      this.#axis.direction = direction;
      return Xc3dCmdRevolve.#CommandState.WaitForAngle;
    }
  }

  * #onWaitForAngle() {
    let tmpRenderingObject = null;

    const arrowHelper = new THREE.ArrowHelper(this.#axis.direction.toThreeVector3(), this.#axis.position.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
    this.#hints.add(arrowHelper);

    Xc3dUIManager.hideDrawableObject({drawableObject: this.#model});
    const {inputState, angle} = yield* Xc3dUIManager.getAngle({
        prompt: this.#i18n.T`Revolution angle`,
        draggingIntensity: Xc3dUIManager.DraggingIntensity.MEDIUM,
        draggingCallback: (angle) => {

          const newProfile = this.#profileBody._pkClone();
          newProfile.spin({axis: this.#axis, angle});

          if (tmpRenderingObject) {
            this.#hints.remove(tmpRenderingObject);
          }

          tmpRenderingObject = Xc3dDocDocument.generateRenderingForBody({body: newProfile, color: new THREE.Color('lightblue')});
          this.#hints.add(tmpRenderingObject);
          Xc3dUIManager.redraw();
        }
      }
    );

    Xc3dUIManager.showDrawableObject({drawableObject: this.#model});
    if (tmpRenderingObject) {
      this.#hints.remove(tmpRenderingObject);
    }
    this.#hints.remove(arrowHelper);

    Xc3dUIManager.redraw();

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdRevolve.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdRevolve.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#angle = angle;
      return Xc3dCmdRevolve.#CommandState.Done;
    }
  }
}
