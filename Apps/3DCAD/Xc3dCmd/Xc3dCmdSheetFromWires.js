class Xc3dCmdSheetFromWires {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForWireBody: Symbol('WaitForWireBody')
  };

  #i18n;
  #state;
  #wireBodies;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdSheetFromWires.#CommandState.WaitForWireBody;
    this.#wireBodies = [];
    this.#highlightingRenderingObjects = [];

    this.#initI18n();
  }

  static* command() {
    const cmd = new Xc3dCmdSheetFromWires();
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

      'Cannot generate sheet body. Single loop supported only': '不能正确生成薄板体，目前只支持一个环。',
      'Select wire bodies': '请指定线框对象',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  * run() {
    while ((this.#state !== Xc3dCmdSheetFromWires.#CommandState.Done) && (this.#state !== Xc3dCmdSheetFromWires.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdSheetFromWires.#CommandState.WaitForWireBody:
          this.#state = yield* this.#onWaitForWireBody();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdSheetFromWires.#CommandState.Done) {
      const curves = [];
      const bounds = [];

      const edges = this.#wireBodies.map(wireBody => wireBody.edges);
      edges.flat();
      const curveAndBounds = edges.forEach(edge => {
        const curve = edge.curve;
        curves.push(curve);

        const bound = edge.findInterval();
        bounds.push(bound);
      });

      // Make a new wire body from all curves and bounds
      const {wire, newEdges} = XcGm3dCurve.makeWireBodyFromCurves({curves, bounds});
      const faces = XcGmEdge.makeFacesFromEdges({edges: [newEdges[0].edge], senses: [true], sharedLoop: [-1]});
      XcSysAssert({
        assertion: faces.length === 1,
        message: this.#i18n.T`Cannot generate sheet body. Single loop supported only`
      });
      const face = faces[0];
      const localCheckStatus = face.attachSurfFitting({localCheck: true});
      const faceBody = face.body;

      // Delete all selected wire bodies and add the one
      this.#wireBodies.forEach(wireBody => {
        const drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: wireBody});
        Xc3dUIManager.document.removeDrawableObject({drawableObject});
      });
      const newModel = new Xc3dDocModel({body: faceBody});
      Xc3dUIManager.document.addDrawableObject({drawableObject: newModel});
    }

    // Unhighlight everything
    this.#highlightingRenderingObjects.forEach(renderingObject => Xc3dUIManager.removeCustomRenderingObject({renderingObject}));
    this.#highlightingRenderingObjects.length = 0;
    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForWireBody() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Select wire bodies`,
      allowReturnNull: this.#wireBodies.length > 0,
      filter: (object) => {
        if (object instanceof Xc3dDocModel) {
          if (object.body.type === XcGmBody.BODY_TYPE.WIRE) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    });

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdSheetFromWires.#CommandState.Done;
      } else if (inputState === Xc3dUIInputState.eInputCancel) {
        return Xc3dCmdSheetFromWires.#CommandState.Cancel;
      } else {
        XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
      }
    } else {
      const body = drawableObject.body;
      const type = body.type;
      if (type === XcGmBody.BODY_TYPE.WIRE) {
        const index = this.#wireBodies.indexOf(body);
        if (index === -1) {
          this.#wireBodies.push(body);

          const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
          const highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
          Xc3dUIManager.addCustomRenderingObject({renderingObject: highlightingRenderingObject});
          this.#highlightingRenderingObjects.push(highlightingRenderingObject);

          Xc3dUIManager.redraw();
        }

        return Xc3dCmdSheetFromWires.#CommandState.WaitForWireBody;
      } else {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select a wire body.`);
        return Xc3dCmdSheetFromWires.#CommandState.WaitForWireBody;
      }
    }
  }
}
