class Xc3dUIGetTransform {
  static CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForInputValue: Symbol('WaitForInputValue'),
    WaitForMoveToPosition: Symbol('WaitForMoveToPosition'),
  };

  static #Event = {
    Input: Symbol('Input'),
    InputEnter: Symbol('InputEnter'),
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    MoveTo: Symbol('MoveTo'),
  };

  hints;

  #prompt;
  #coordinateSystem;
  #origin;
  #mouseIndicator;
  #draggingCallback;
  #draggingIntensity;
  #needTranslation;
  #needRotation;
  #needScale;
  #translationX;
  #translationY;
  #translationZ;
  #rotationAngleX;
  #rotationAngleY;
  #rotationAngleZ;
  #scale;
  #xArrow;
  #yArrow;
  #zArrow;

  constructor({
                prompt,
                coordinateSystem,
                mouseIndicator,
                draggingCallback,
                draggingIntensity,
                needTranslation,
                needRotation,
                needScale
              }) {
    this.#prompt = prompt;
    this.#coordinateSystem = coordinateSystem;
    this.#origin = this.#coordinateSystem.origin.clone();
    this.#mouseIndicator = mouseIndicator;
    this.#draggingCallback = draggingCallback;
    this.#draggingIntensity = draggingIntensity;

    this.#needTranslation = needTranslation;
    this.#needRotation = needRotation;
    this.#needScale = needScale;

    this.inputState = Xc3dUIInputState.eInputNormal;
    this.translationMatrix = new XcGm3dMatrix();
    this.rotationMatrix = new XcGm3dMatrix();
    this.scaleMatrix = new XcGm3dMatrix();
    this.state = Xc3dUIGetTransform.CommandState.WaitForInputValue;

    this.#translationX = 0;
    this.#translationY = 0;
    this.#translationZ = 0;
    this.#rotationAngleX = 0;
    this.#rotationAngleY = 0;
    this.#rotationAngleZ = 0;
    this.#scale = 1;

    this.hints = new THREE.Group();

    // Add axes
    // TODO: Respect UCS
    const zDir = this.#coordinateSystem.zAxisDirection.toThreeVector3();
    const xDir = this.#coordinateSystem.xAxisDirection.toThreeVector3();
    const yDir = this.#coordinateSystem.zAxisDirection.crossProduct({vector: this.#coordinateSystem.xAxisDirection}).normal().toThreeVector3();

    const origin = this.#coordinateSystem.origin.toThreeVector3();
    const axisLength = (XcSysManager.canvasDiv.clientHeight / 4.0) / Xc3dUIManager.getNumPixelsInUnit();

    this.#xArrow = new THREE.ArrowHelper(xDir, origin, axisLength, new THREE.Color('red'));
    this.#yArrow = new THREE.ArrowHelper(yDir, origin, axisLength, new THREE.Color('green'));
    this.#zArrow = new THREE.ArrowHelper(zDir, origin, axisLength, new THREE.Color('blue'));

    this.hints.add(this.#xArrow);
    this.hints.add(this.#yArrow);
    this.hints.add(this.#zArrow);

    Xc3dUIManager.addCustomRenderingObject({renderingObject: this.hints});
  }

  #updateMatrix() {
    // Translation
    const translationVector = new XcGm3dVector({x: this.#translationX, y: this.#translationY, z: this.#translationZ});
    this.translationMatrix = XcGm3dMatrix.translationMatrix({vector: translationVector});

    // Rotation
    const xRotationMatrix = XcGm3dMatrix.rotationMatrix({
      angle: this.#rotationAngleX,
      axis: new XcGm3dAxis({position: this.#origin, direction: this.#coordinateSystem.xAxisDirection})
    });
    const yRotationMatrix = XcGm3dMatrix.rotationMatrix({
      angle: this.#rotationAngleY,
      axis: new XcGm3dAxis({
        position: this.#origin,
        direction: this.#coordinateSystem.zAxisDirection.crossProduct({vector: this.#coordinateSystem.xAxisDirection}).normal()
      })
    });
    const zRotationMatrix = XcGm3dMatrix.rotationMatrix({
      angle: this.#rotationAngleZ,
      axis: new XcGm3dAxis({position: this.#origin, direction: this.#coordinateSystem.zAxisDirection})
    });

    this.rotationMatrix = XcGm3dMatrix.multiply({matrix1: yRotationMatrix, matrix2: xRotationMatrix});
    this.rotationMatrix = XcGm3dMatrix.multiply({matrix1: zRotationMatrix, matrix2: this.rotationMatrix});

    // Scale
    this.scaleMatrix = XcGm3dMatrix.scalingMatrix({scale: this.#scale, center: this.#origin});

    // Final transform
    if (this.#draggingCallback) {
      let currentTransform = XcGm3dMatrix.multiply({matrix1: this.rotationMatrix, matrix2: this.scaleMatrix});
      currentTransform = XcGm3dMatrix.multiply({matrix1: this.translationMatrix, matrix2: currentTransform});
      this.#draggingCallback(currentTransform);
    }
  }

  * onWaitForInputValue() {
    const widgets = [];
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = Xc3dUII18n.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetTransform.#Event.Cancel});
    });
    widgets.push(cancelButton);

    const doneButton = document.createElement('button');
    doneButton.innerHTML = Xc3dUII18n.i18n.T`Done`;
    doneButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dUIGetTransform.#Event.Done});
    });
    widgets.push(doneButton);

    if (this.#needTranslation) {
      const moveToButton = document.createElement('button');
      moveToButton.innerHTML = Xc3dUII18n.i18n.T`Move to`;
      moveToButton.addEventListener('click', (event) => {
        XcSysManager.dispatchEvent({event: Xc3dUIGetTransform.#Event.MoveTo});
      });
      widgets.push(moveToButton);

      const xTranslationStr = Xc3dUII18n.i18n.T`Translation along X`;
      const xTranslationInput = document.createElement('label');
      xTranslationInput.innerHTML = `${xTranslationStr} <input name="xtranslate" type="number" value="${this.#translationX}" step="0.1">`;
      xTranslationInput.querySelector('input').addEventListener('input', (event) => {
        this.#translationX = xTranslationInput.querySelector('input').valueAsNumber;
        this.#updateMatrix();
      });
      widgets.push(xTranslationInput);

      const yTranslationStr = Xc3dUII18n.i18n.T`Translation along Y`;
      const yTranslationInput = document.createElement('label');
      yTranslationInput.innerHTML = `${yTranslationStr} <input name="ytranslate" type="number" value="${this.#translationY}" step="0.1">`;
      yTranslationInput.querySelector('input').addEventListener('input', (event) => {
        this.#translationY = yTranslationInput.querySelector('input').valueAsNumber;
        this.#updateMatrix();
      });
      widgets.push(yTranslationInput);

      const zTranslationStr = Xc3dUII18n.i18n.T`Translation along Z`;
      const zTranslationInput = document.createElement('label');
      zTranslationInput.innerHTML = `${zTranslationStr} <input name="ztranslate" type="number" value="${this.#translationZ}" step="0.1">`;
      zTranslationInput.querySelector('input').addEventListener('input', (event) => {
        this.#translationZ = zTranslationInput.querySelector('input').valueAsNumber;
        this.#updateMatrix();
      });
      widgets.push(zTranslationInput);
    }

    if (this.#needRotation) {
      const xAngleStr = Xc3dUII18n.i18n.T`Rotation around X`;
      const xAngleInput = document.createElement('label');
      xAngleInput.innerHTML = `${xAngleStr} <input name="xangle" type="number" value="0" min="-360" max="360" step="10">`;
      xAngleInput.querySelector('input').addEventListener('input', (event) => {
        this.#rotationAngleX = xAngleInput.querySelector('input').valueAsNumber * Math.PI / 180.0;
        this.#updateMatrix();
      });
      widgets.push(xAngleInput);

      const yAngleStr = Xc3dUII18n.i18n.T`Rotation around Y`;
      const yAngleInput = document.createElement('label');
      yAngleInput.innerHTML = `${yAngleStr} <input name="yangle" type="number" value="0" min="-360" max="360" step="10">`;
      yAngleInput.querySelector('input').addEventListener('input', (event) => {
        this.#rotationAngleY = yAngleInput.querySelector('input').valueAsNumber * Math.PI / 180.0;
        this.#updateMatrix();
      });
      widgets.push(yAngleInput);

      const zAngleStr = Xc3dUII18n.i18n.T`Rotation around Z`;
      const zAngleInput = document.createElement('label');
      zAngleInput.innerHTML = `${zAngleStr} <input name="zangle" type="number" value="0" min="-360" max="360" step="10">`;
      zAngleInput.querySelector('input').addEventListener('input', (event) => {
        this.#rotationAngleZ = zAngleInput.querySelector('input').valueAsNumber * Math.PI / 180.0;
        this.#updateMatrix();
      });
      widgets.push(zAngleInput);
    }

    if (this.#needScale) {
      const scaleStr = Xc3dUII18n.i18n.T`Scale factor`;
      const scaleInput = document.createElement('label');
      scaleInput.innerHTML = `${scaleStr} <input name="scale" type="number" value="1" min="0.001" max="1000" step="0.5">`;
      scaleInput.querySelector('input').addEventListener('input', (event) => {
        this.#scale = scaleInput.querySelector('input').valueAsNumber;
        this.#updateMatrix();
      });
      widgets.push(scaleInput);
    }

    let uiContextForInputValue = new XcSysUIContext({
      prompt: this.#prompt,
      showCanvasElement: true,
      standardWidgets: widgets,
      cursor: 'crosshair'
    });

    const event = yield* XcSysManager.waitForEvent({
      uiContext: uiContextForInputValue,
      expectedEventTypes: [Xc3dUIGetTransform.#Event.Cancel, Xc3dUIGetTransform.#Event.Done, Xc3dUIGetTransform.#Event.MoveTo]
    });
    if (event === Xc3dUIGetTransform.#Event.Cancel) {
      this.inputState = Xc3dUIInputState.eInputCancel;
      return Xc3dUIGetTransform.CommandState.Cancel;
    } else if (event === Xc3dUIGetTransform.#Event.Done) {
      this.inputState = Xc3dUIInputState.eInputNormal;
      return Xc3dUIGetTransform.CommandState.Done;
    } else if (event === Xc3dUIGetTransform.#Event.MoveTo) {
      return Xc3dUIGetTransform.CommandState.WaitForMoveToPosition;
    } else {
      return Xc3dUIGetTransform.CommandState.WaitForInputValue;
    }
  }

  * onWaitForMoveToPosition() {
    const {inputState, position} = yield* Xc3dUIManager.getPosition({prompt: Xc3dUII18n.i18n.T`Point to copy from`});

    if (inputState !== Xc3dUIInputState.eInputNormal) {
      return Xc3dUIGetTransform.CommandState.WaitForInputValue;
    } else {
      const offset = XcGm3dPosition.subtract({position: position, positionOrVector: this.#origin});
      this.#translationX = offset.x;
      this.#translationY = offset.y;
      this.#translationZ = offset.z;
      this.#updateMatrix();

      return Xc3dUIGetTransform.CommandState.WaitForInputValue;
    }
  }
}

Xc3dUIManager.getTransform = function* ({
                                                  prompt,
                                                  coordinateSystem,
                                                  mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                  draggingCallback = null,
                                                  draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM,
                                                  needTranslation = true,
                                                  needRotation = true,
                                                  needScale = true
                                                }) {
  const transformGetter = new Xc3dUIGetTransform({
    prompt,
    coordinateSystem,
    mouseIndicator,
    draggingCallback,
    draggingIntensity,
    needTranslation,
    needRotation,
    needScale
  });

  while ((transformGetter.state !== Xc3dUIGetTransform.CommandState.Cancel) && ((transformGetter.state !== Xc3dUIGetTransform.CommandState.Done))) {
    switch (transformGetter.state) {
      case Xc3dUIGetTransform.CommandState.WaitForInputValue:
        transformGetter.state = yield* transformGetter.onWaitForInputValue();
        break;
      case Xc3dUIGetTransform.CommandState.WaitForMoveToPosition:
        transformGetter.state = yield* transformGetter.onWaitForMoveToPosition();
        break;
      default:
        XcSysAssert({assertion: false, message: Xc3dUII18n.i18n.T`Internal command state error`});
        break;
    }
  }

  Xc3dUIManager.removeCustomRenderingObject({renderingObject: transformGetter.hints});

  const transform = transformGetter.translationMatrix.clone();
  transform.multiply({matrix: transformGetter.rotationMatrix});
  transform.multiply({matrix: transformGetter.scaleMatrix});

  return {inputState: transformGetter.inputState, transform};
};
