class Xc3dCmdMergeWires {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForWireBodies: Symbol('WaitForWireBodies')
  };

  #i18n;
  #state;
  #wireBodies;
  #highlightingRenderingObjects;

  constructor() {
    this.#state = Xc3dCmdMergeWires.#CommandState.WaitForWireBodies;
    this.#wireBodies = [];
    this.#highlightingRenderingObjects = [];

    this.#initI18n();
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Specify wire bodies': '指定线框体',
    };

    if (XcSysConfig.locale === 'zh') {
      this.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.#i18n = new XcSysI18n();
    }
  }

  static *command() {
    const cmd = new Xc3dCmdMergeWires();
    const ret = yield* cmd.run();
    return ret;
  }

  * run() {
    while ((this.#state !== Xc3dCmdMergeWires.#CommandState.Done) && (this.#state !== Xc3dCmdMergeWires.#CommandState.Cancel)) {
      switch (this.#state) {
        case Xc3dCmdMergeWires.#CommandState.WaitForWireBodies:
          this.#state = yield* this.#onWaitForWireBodies();
          break;
        default:
          XcSysAssert({assertion: false, message: this.#i18n.T`Internal command state error`});
          break;
      }
    }

    if (this.#state === Xc3dCmdMergeWires.#CommandState.Done) {
      const curves = [];
      const bounds = [];

      this.#wireBodies.forEach((wireBody) => {
        wireBody.edges.forEach((edge) => {
          const curve = edge.curve;
          curves.push(curve);
          
          const bound = edge.findInterval();
          bounds.push(bound);
        });
      });

      // Make a new wire body from all curves and bounds
      const {wire, newEdges} = XcGm3dCurve.makeWireBodyFromCurves({curves, bounds});

      // Delete all selected wire bodies and add the one
      this.#wireBodies.forEach((wireBody) => {
        const drawableObject = Xc3dDocDocument.getDrawableObjectFromKernelEntity({kernelEntity: wireBody});
        Xc3dUIManager.document.removeDrawableObject({drawableObject});
      });
      const newModel = new Xc3dDocModel({body: wire});
      Xc3dUIManager.document.addDrawableObject({drawableObject: newModel});
    }

    // Unhighlight everything
    this.#highlightingRenderingObjects.forEach((renderingObject) => {
      Xc3dUIManager.removeCustomRenderingObject({renderingObject});
    });
    this.#highlightingRenderingObjects.length = 0;
    Xc3dUIManager.redraw();

    return this.#state;
  }

  * #onWaitForWireBodies() {
    const {inputState, drawableObject} = yield* Xc3dUIManager.getDrawableObject({
      prompt: this.#i18n.T`Specify wire bodies`,
      allowReturnNull: this.#wireBodies.length > 1
    });
    if (inputState !== Xc3dUIInputState.eInputNormal) {
      if (inputState === Xc3dUIInputState.eInputNone) {
        return Xc3dCmdMergeWires.#CommandState.Done;
      } else {
        return Xc3dCmdMergeWires.#CommandState.Cancel;
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
        return Xc3dCmdMergeWires.#CommandState.WaitForWireBodies;
      } else {
        XcSysManager.outputDisplay.warn(this.#i18n.T`Please select a wire body.`);
        return Xc3dCmdMergeWires.#CommandState.WaitForWireBodies;
      }
    }
  }
}
