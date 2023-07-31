class Xc3dUIGetFaceEdgeVertex {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPickingFaceEdgeVertex: Symbol('WaitForPickingFaceEdgeVertex')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  value;
  highlightingRenderingObject;
  inputState;
  state;

  #allowReturnNull;
  #targetRenderingObjects;
  #type;

  constructor({
                prompt,
                allowReturnNull,
                targetRenderingObjects,
                type,
              }) {
    this.#allowReturnNull = allowReturnNull;
    this.#type = type;
    this.#targetRenderingObjects = targetRenderingObjects;

    this.value = null;
    this.highlightingRenderingObject = null;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.state = Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex;

    //TODO: Prompt
    // this.#prompt = Xc3dUII18n.i18n.T`Pick`+' ';
    // let typeStrings = [];
    // if (type & Xc3dUIManager.PICK_TYPE.FACE) {
    //   typeStrings.push(Xc3dUII18n.i18n.T`Face`);
    // }
    // if (type & Xc3dUIManager.PICK_TYPE.EDGE) {
    //   typeStrings.push(Xc3dUII18n.i18n.T`Edge`);
    // }
    // if (type & Xc3dUIManager.PICK_TYPE.VERTEX) {
    //   typeStrings.push(Xc3dUII18n.i18n.T`Vertex`);
    // }
    // this.#prompt += typeStrings.join('|');

    const widgets = [];
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetFaceEdgeVertex.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetFaceEdgeVertex.#Event.Done}));
      widgets.push(doneButton);
    }
    this.uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets
    });
  }

  * onWaitForPickingFaceEdgeVertex() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.uiContext,
      expectedEventTypes: [
        Xc3dUIGetFaceEdgeVertex.#Event.Cancel,
        Xc3dUIGetFaceEdgeVertex.#Event.Done,
        event => event instanceof Xc3dUIMouseEvent,
      ],
    });
    if (event === Xc3dUIGetFaceEdgeVertex.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetFaceEdgeVertex.CommandState.Cancel;
    } else if (event === Xc3dUIGetFaceEdgeVertex.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetFaceEdgeVertex.CommandState.Done;
    } else if (event instanceof Xc3dUIMouseEvent) {
      const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: Xc3dUIManager.DraggingIntensity.MEDIUM})});

      if (nextEvent) {
        return Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex;
      }

      const screenPosition = event.position;
      const intersects = Xc3dUIManager.pick({
        screenPosition,
        targetRenderingObjects: this.#targetRenderingObjects,
      });
      const qualifiedIntersect = intersects.find((intersect) => {
        const renderingObject = intersect.renderingObject;
        const associatedModelingKernelEntity = Xc3dDocDocument.getModelingKernelEntityFromRenderingObject({renderingObject});

        if (associatedModelingKernelEntity) {
          if ((associatedModelingKernelEntity instanceof XcGmVertex) && (this.#type & Xc3dUIManager.PICK_TYPE.VERTEX)) {
            return true;
          } else if ((associatedModelingKernelEntity instanceof XcGmEdge) && (this.#type & Xc3dUIManager.PICK_TYPE.EDGE)) {
            return true;
          } else if ((associatedModelingKernelEntity instanceof XcGmFace) && (this.#type & Xc3dUIManager.PICK_TYPE.FACE)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });

      if (qualifiedIntersect) {
        const oldValue = this.value;

        this.value = Xc3dDocDocument.getModelingKernelEntityFromRenderingObject({renderingObject: qualifiedIntersect.renderingObject});

        if (oldValue !== this.value) {
          if (this.highlightingRenderingObject) {
            Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.highlightingRenderingObject});
            this.highlightingRenderingObject = null;
          }

          this.highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: qualifiedIntersect.renderingObject});
          Xc3dUIManager.addCustomRenderingObject({renderingObject: this.highlightingRenderingObject});
        }

        Xc3dUIManager.redraw();

        if ((event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
          return Xc3dUIGetFaceEdgeVertex.CommandState.Ok;
        } else {
          return Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex;
        }
      } else {
        if (this.value) {
          if (this.highlightingRenderingObject) {
            Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.highlightingRenderingObject});
            this.highlightingRenderingObject = null;
          }
          Xc3dUIManager.redraw();
          this.value = null;
        }

        if ((event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
          XcSysManager.outputDisplay.info(Xc3dUII18n.i18n.T`This object type is not supported.`);
        }
        return Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex;
      }
    } else {
      return Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex;
    }
  }
}

Xc3dUIManager.getFaceEdgeVertex = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       targetRenderingObjects = [Xc3dUIManager.document.renderingScene],
                                                       type = Xc3dUIManager.PICK_TYPE.VERTEX | Xc3dUIManager.PICK_TYPE.EDGE | Xc3dUIManager.PICK_TYPE.FACE,
                                                     }) {
  const faceEdgeVertexGetter = new Xc3dUIGetFaceEdgeVertex({prompt, allowReturnNull, targetRenderingObjects, type});

  while ((faceEdgeVertexGetter.state !== Xc3dUIGetFaceEdgeVertex.CommandState.Ok) &&
  (faceEdgeVertexGetter.state !== Xc3dUIGetFaceEdgeVertex.CommandState.Cancel) &&
  (faceEdgeVertexGetter.state !== Xc3dUIGetFaceEdgeVertex.CommandState.Done)) {
    switch (faceEdgeVertexGetter.state) {
      case Xc3dUIGetFaceEdgeVertex.CommandState.WaitForPickingFaceEdgeVertex:
        faceEdgeVertexGetter.state = yield* faceEdgeVertexGetter.onWaitForPickingFaceEdgeVertex();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  if (faceEdgeVertexGetter.highlightingRenderingObject) {
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: faceEdgeVertexGetter.highlightingRenderingObject});
    faceEdgeVertexGetter.highlightingRenderingObject = null;
  }

  Xc3dUIManager.redraw();

  return {inputState: faceEdgeVertexGetter.inputState, value: faceEdgeVertexGetter.value};
};

Xc3dUIManager.PICK_TYPE = {
  VERTEX: 1,
  EDGE: 2,
  FACE: 4
};
