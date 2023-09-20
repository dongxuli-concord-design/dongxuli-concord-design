class Xc3dCmdExtrude {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForProfile: Symbol('WaitForProfile'),
    WaitForDirection: Symbol('WaitForDirection'),
    WaitForDistance: Symbol('WaitForDistance')
  };

  #i18n;
  #state;
  #profileBody;
  #model;
  #extrusionDirection;
  #basePosition;
  #distance;
  #hints;

//TODO: check if the profile is sheet or wire body.
  constructor() {
    this.#state = Xc3dCmdExtrude.#CommandState.WaitForProfile;
    this.#profileBody = null;
    this.#model = null;
    this.#extrusionDirection = null;
    this.#distance = 1.0;
    this.#hints = new THREE.Group();

    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdExtrude();
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

      'Select a profile (point, wire or sheet)': '选择要拉伸的物体（点体，线体，或者薄面体）',
      'Please select a point, a wire or a sheet body.': '请选择一个点体，线体，或者薄面体。',
      'Specify the extrusion direction': '指定拉伸方向',
      'Extrusion length': '拉伸长度',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdExtrude.#CommandState.Done) && (this.#state !== Xc3dCmdExtrude.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdExtrude.#CommandState.WaitForProfile:
          this.#state = yield* this.#onWaitForProfile();
          break;
        case Xc3dCmdExtrude.#CommandState.WaitForDirection:
          this.#state = yield* this.#onWaitForDirection();
          break;
        case Xc3dCmdExtrude.#CommandState.WaitForDistance:
          this.#state = yield* this.#onWaitForDistance();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }


    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdExtrude.#CommandState.Done) {
      const extrudedBody = this.#profileBody.extrude({
        direction: this.#extrusionDirection,
        distance: this.#distance,
      });

      Xc3dUIManager.document.startTransaction();
      Xc3dUIManager.document.removeDrawableObject({drawableObject: this.#model});
      const extrudedObject = new Xc3dDocModel({body: extrudedBody});
      Xc3dUIManager.document.addDrawableObject({drawableObject: extrudedObject});
      Xc3dUIManager.document.endTransaction();
    }

    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForProfile() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select a profile (point, wire or sheet)`,
      filter: (object) => {
        if (!(object instanceof Xc3dDocModel)) {
          return false;
        }
        if ((object.body.type === XcGmBody._PKBodyType.MINIMUM) ||
          (object.body.type === XcGmBody._PKBodyType.WIRE) ||
          (object.body.type === XcGmBody._PKBodyType.SHEET)) {
          return true;
        } else {
          return false;
        }
      }
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdExtrude.#CommandState.Cancel;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdExtrude.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      const profile = drawableObject.body;

      const type = profile.type;
      if ((type === XcGmBody._PKBodyType.SHEET) ||
        (type === XcGmBody._PKBodyType.WIRE) ||
        (type === XcGmBody._PKBodyType.MINIMUM)) {
        this.#profileBody = profile;
        this.#model = drawableObject;

        const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
        const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
        this.#hints.add(highlightingRenderingObject);

        Xc3dUIManager.redraw();

        return Xc3dCmdExtrude.#CommandState.WaitForDirection;
      } else {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select a point, a wire or a sheet body.`);
        return Xc3dCmdExtrude.#CommandState.WaitForProfile;
      }
    }
  }

  * #onWaitForDirection() {
    const {
      inputState,
      direction
    } = yield* Xc3dUIManager.getDirection({prompt: this.#i18n.T`Specify the extrusion direction`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dCmdExtrude.#CommandState.Cancel;
    } else {
      this.#extrusionDirection = direction;

      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: this.#model});
      const box = new THREE.Box3();
      box.setFromObject(renderingObjectOfDrawable);
      const boxCenter = new THREE.Vector3();
      box.getCenter(boxCenter);

      this.#basePosition = XcGm3dPosition.fromThreeVector3({threeVector3: boxCenter});

      Xc3dUIManager.redraw();
      return Xc3dCmdExtrude.#CommandState.WaitForDistance;
    }
  }

  * #onWaitForDistance() {
    let tmpRenderingObject = null;
    const arrowHelper = new THREE.ArrowHelper(this.#extrusionDirection.toThreeVector3(), this.#basePosition.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
    this.#hints.add(arrowHelper);

    const {inputState, distance} = yield* Xc3dUIManager.getDistance({
      prompt: this.#i18n.T`Extrusion length`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.MEDIUM,
      draggingCallback: (length) => {
        this.#distance = Math.abs(length);
        if (this.#distance < 1e-1) {
          // Too small
          return null;
        }
        if (length < 0) {
          this.#extrusionDirection.multiply({scale: -1});
        }

        const extrudedBody = this.#profileBody.extrude({
          direction: this.#extrusionDirection,
          distance: this.#distance,
        });

        if (tmpRenderingObject) {
          this.#hints.remove(tmpRenderingObject);
        }

        tmpRenderingObject = Xc3dDocDocument.generateRenderingForBody({body: extrudedBody, color: new THREE.Color('lightblue')});
        this.#hints.add(tmpRenderingObject);
        Xc3dUIManager.redraw();
      }
    });

    if (tmpRenderingObject) {
      this.#hints.remove(tmpRenderingObject);
    }
    this.#hints.remove(arrowHelper);

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        this.#distance = 1.0;
        return Xc3dCmdExtrude.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdExtrude.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#distance = Math.abs(distance);
      if (this.#distance < 1e-5) {
        // Too small
        XcSysManager.outputDisplay.warn(this.#i18n.T`Extrusion length is too small.`);
        return Xc3dCmdExtrude.#CommandState.WaitForDistance;
      }
      if (distance < 0) {
        this.#extrusionDirection.multiply({scale: -1});
      }
      return Xc3dCmdExtrude.#CommandState.Done;
    }
  }
}
