class Xc3dCmdPressPullPlanarFace {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForFace: Symbol('WaitForFace'),
    WaitForDistance: Symbol('WaitForDistance')
  };

  #i18n;
  #state;
  #body;
  #model;
  #face;
  #direction;
  #position;
  #distance;
  #hints;

  constructor() {
    this.#state = Xc3dCmdPressPullPlanarFace.#CommandState.WaitForFace;
    this.#body = null;
    this.#model = null;
    this.#face = null;
    this.#direction = null;
    this.#position = null;
    this.#distance = 1;
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

      'Select a planar face': '选择一个平面',
      'The face is not a planar.': '该面不是平面。',
      'Specify distance': '指定距离',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdPressPullPlanarFace();
    const ret = yield* cmd.run();
    return ret;
  }

  #getDirectionFromPlanarFace(face) {
    const uvbox = face.UVBox;
    const midUV = new XcGmUV({
      u: (uvbox.lowU + uvbox.highU) / 2.0,
      v: (uvbox.lowV + uvbox.highV) / 2.0
    });
    const {surf, orientation} = face.surfAndOrientation();
    if (surf instanceof XcGmPlanarSurface) {
      const coordinateSystem = surf.coordinateSystem;
      const faceDir = coordinateSystem.zAxisDirection;
      if (!orientation) {
        faceDir.negate();
      }
      faceDir.normalize();

      const position = surf.evaluate({uv: midUV});
      const direction = faceDir;

      return {
        position: position,
        direction: direction
      }
    } else {
      return null;
    }
  }

  * run() {
    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.#hints});

    while ((this.#state !== Xc3dCmdPressPullPlanarFace.#CommandState.Done) && (this.#state !== Xc3dCmdPressPullPlanarFace.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdPressPullPlanarFace.#CommandState.WaitForFace:
          this.#state = yield* this.#onWaitForFace();
          break;
        case Xc3dCmdPressPullPlanarFace.#CommandState.WaitForDistance:
          this.#state = yield* this.#onWaitForDistance();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.#hints});
    Xc3dUIManager.redraw();

    if (this.#state === Xc3dCmdPressPullPlanarFace.#CommandState.Done) {
      this.#direction.multiply({scale: this.#distance});

      const matrix = XcGm3dMatrix.translationMatrix({vector: this.#direction});
      XcGmFace.transform({
        facesAndMatrices: [{face: this.#face, matrix}],
        tolerance: 1e-5
      });
      Xc3dUIManager.document.modifyDrawableObject({drawableObject: this.#model});
    }

    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForFace() {
    const {inputState, value} = yield* Xc3dUIManager.getFaceEdgeVertex({
      prompt: this.#i18n.T`Select a planar face`,
      type: Xc3dUIManager.PICK_TYPE.FACE
    });

    this.#face = value;
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        if (this.faces.length === 0) {
          return Xc3dCmdPressPullPlanarFace.#CommandState.Cancel;
        } else {
          return Xc3dCmdPressPullPlanarFace.#CommandState.Done;
        }
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdPressPullPlanarFace.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      // Show the direction
      const posAndDir = this.#getDirectionFromPlanarFace(this.#face);
      if (posAndDir) {
        this.#position = posAndDir.position;
        this.#direction = posAndDir.direction;

        this.#body = this.#face.body;
        this.#model = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: this.#body});

        const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromModelingKernelEntity({kernelEntity: this.#face});
        const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
        this.#hints.add(highlightingRenderingObject);

        Xc3dUIManager.redraw();

        return Xc3dCmdPressPullPlanarFace.#CommandState.WaitForDistance;
      } else {
        XcSysManager.outputDisplay.warn(this.#i18n.T`The face is not a planar.`);
        return Xc3dCmdPressPullPlanarFace.#CommandState.WaitForFace;
      }
    }
  }

  * #onWaitForDistance() {
    const newModel = this.#model.clone();
    const newBody = newModel.body;
    // Find the "same" face in the new body by the identifier
    const positionsOfVerticesOfFace = this.#face.vertices.map(vertex => vertex.point.position);
    const verticesOfNewBody = positionsOfVerticesOfFace.map(position => newBody.findVertexByPosition({position}));
    const newFace = newBody.findFaceByVertices({vertices: verticesOfNewBody})[0];

    let tmpRenderingObject = null;
    const arrowHelper = new THREE.ArrowHelper(this.#direction.toThreeVector3(), this.#position.toThreeVector3(), 100 / Xc3dUIManager.getNumPixelsInUnit(), 0xFF69B4);
    this.#hints.add(arrowHelper);
    
    let lastDistance = 0;
    const {inputState, distance} = yield* Xc3dUIManager.getDistance({
      prompt: this.#i18n.T`Specify distance`,
      draggingIntensity: Xc3dUIManager.DraggingIntensity.MEDIUM,
      draggingCallback: (length) => {
        Xc3dUIManager.hideDrawableObject({drawableObject: this.#model});

        this.#distance = length;
        const deltaDistance = this.#distance - lastDistance;
        const direction = this.#direction.clone();
        direction.multiply({scale: deltaDistance});
        const matrix = XcGm3dMatrix.translationMatrix({vector: direction});
        lastDistance = length;
        XcGmFace.transform({
          facesAndMatrices: [{face: newFace, matrix}],
          tolerance: 1e-5
        });

        if (tmpRenderingObject) {
          this.#hints.remove(tmpRenderingObject);
        }
        
        tmpRenderingObject = newModel.generateRenderingObject();
        this.#hints.add(tmpRenderingObject);
        Xc3dUIManager.redraw();
      }
    });


    Xc3dUIManager.showDrawableObject({drawableObject: this.#model});
    if (tmpRenderingObject) {
      this.#hints.remove(tmpRenderingObject);
    }
    this.#hints.remove(arrowHelper);

    Xc3dUIManager.redraw();

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdPressPullPlanarFace.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdPressPullPlanarFace.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      this.#distance = distance;
      return Xc3dCmdPressPullPlanarFace.#CommandState.Done;
    }
  }
}
