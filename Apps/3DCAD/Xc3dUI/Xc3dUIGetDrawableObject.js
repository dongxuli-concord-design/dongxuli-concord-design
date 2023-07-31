class Xc3dUIGetDrawableObject {
  static CommandState = {
    Ok: Symbol('Ok'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForPickingDrawableObject: Symbol('WaitForPickingDrawableObject')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  value;
  inputState;
  state;
  highlightingRenderingObject;

  #allowReturnNull;
  #filter;
  #uiContext;

  constructor({
                prompt,
                allowReturnNull,
                filter,
              }) {
    this.#allowReturnNull = allowReturnNull;
    this.#filter = filter;

    this.value = null;
    this.highlightingRenderingObject = null;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.state = Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject;

    const widgets = [];

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDrawableObject.#Event.Cancel}));
    widgets.push(cancelButton);

    if (this.#allowReturnNull) {
      const doneButton = document.createElement('button');
      doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
      doneButton.addEventListener('click', () => XcSysManager.dispatchEvent({event: Xc3dUIGetDrawableObject.#Event.Done}));
      widgets.push(doneButton);
    }
    this.#uiContext = new XcSysUIContext({
      prompt,
      showCanvasElement: true,
      standardWidgets: widgets
    });
  }

  * onWaitForPickingPart() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [
        Xc3dUIGetDrawableObject.#Event.Cancel, 
        Xc3dUIGetDrawableObject.#Event.Done, 
        event => event instanceof Xc3dUIMouseEvent,
      ],
    });
    if (event === Xc3dUIGetDrawableObject.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetDrawableObject.CommandState.Cancel;
    } else if (event === Xc3dUIGetDrawableObject.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNone;
      return Xc3dUIGetDrawableObject.CommandState.Done;
    } else if (event instanceof Xc3dUIMouseEvent) {
      const nextEvent = yield* XcSysManager.peekEvent({delay: Xc3dUIManager.computeDraggingInterval({draggingIntensity: Xc3dUIManager.DraggingIntensity.MEDIUM})});
      if (nextEvent) {
        return Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject;
      }

      if (this.highlightingRenderingObject) {
        Xc3dUIManager.removeCustomRenderingObject({renderingObject: this.highlightingRenderingObject});
        this.highlightingRenderingObject = null;
      }

      const filteredDrawableObjects = Xc3dUIManager.document.drawableObjects.filter(this.#filter);
      const targetRenderingObjects = filteredDrawableObjects.map(drawableObject => Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject}));

      const intersects = Xc3dUIManager.pick({
        screenPosition: event.position,
        targetRenderingObjects,
      });

      const filteredIntersects = intersects.filter( (intersect, index, array) => {
        const associatedDocumentDrawableObject = Xc3dDocDocument.getDrawableObjectFromRenderingObject({renderingObject: intersect.renderingObject});
        if (associatedDocumentDrawableObject) {
          return true;
        } else {
          return false;
        }
      });
      
      if (filteredIntersects.length === 0) {
        return Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject;
      }

      const intersect = filteredIntersects[0];
      const associatedDocumentDrawableObject = Xc3dDocDocument.getDrawableObjectFromRenderingObject({renderingObject: intersect.renderingObject});

      this.value = associatedDocumentDrawableObject;
      const renderingObjectOfDrawable = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject: this.value});
      this.highlightingRenderingObject = Xc3dUIManager.generateHighlightingRenderingObject({renderingObject: renderingObjectOfDrawable});
      Xc3dUIManager.addCustomRenderingObject({renderingObject: this.highlightingRenderingObject});
      Xc3dUIManager.redraw();

      if ((event.type === Xc3dUIMouseEvent.TYPE.UP) && (event.which === 1)) {
        return Xc3dUIGetDrawableObject.CommandState.Ok;
      } else {
        return Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject;
      }
    } else {
      return Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject;
    }
  }
}

Xc3dUIManager.getDrawableObject = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       filter = ()=>{return true;},
                                                     }) {
  const partGetter = new Xc3dUIGetDrawableObject({prompt, allowReturnNull, filter});

  while ((partGetter.state !== Xc3dUIGetDrawableObject.CommandState.Ok) &&
  (partGetter.state !== Xc3dUIGetDrawableObject.CommandState.Cancel) &&
  (partGetter.state !== Xc3dUIGetDrawableObject.CommandState.Done)) {
    switch (partGetter.state) {
      case Xc3dUIGetDrawableObject.CommandState.WaitForPickingDrawableObject:
        partGetter.state = yield* partGetter.onWaitForPickingPart();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  if (partGetter.highlightingRenderingObject) {
    Xc3dUIManager.removeCustomRenderingObject({renderingObject: partGetter.highlightingRenderingObject});
    partGetter.highlightingRenderingObject = null;
  }

  Xc3dUIManager.redraw();

  return {inputState: partGetter.inputState, drawableObject: partGetter.value};
};
