class Xc3dUIAnimation {
  static StopEvent = Symbol('StopEvent');
  static animationDelay = (1.0 / 24.0) * 1000; // ms

  static* runParallelAnimations({actions}) {
    try {
      while (actions.length > 0) {
        for (let i = actions.length - 1; i >= 0; --i) {
          const action = actions[i];
          let ret = action.next();
          if (ret.done) {
            actions.splice(i, 1);
          }
        }

        Xc3dUIManager.redraw();

        const event = yield* XcSysManager.sleep({
          delay: Xc3dUIAnimation.animationDelay,
          interruptors: [Xc3dUIAnimation.StopEvent]
        });

        if (event === Xc3dUIAnimation.StopEvent) {
          throw 'Animation interrupted';
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static* runSerialAnimations({actions}) {
    try {
      for (const action of actions) {
        let ret = null;

        do {
          ret = action.next();

          Xc3dUIManager.redraw();
          yield* XcSysManager.sleep({
            delay: Xc3dUIAnimation.animationDelay,
            interruptors: [Xc3dUIAnimation.StopEvent]
          });
        }
        while (!ret.done);
      }
    } catch (error) {
      throw error;
    }
  }

  static* setView({name}) {
    XcSysAssert({assertion: !Xc3dUIManager.document.userData.XcNamedViews, message: 'Cannot find named views.'});
    const namedViews = new Map(Object.entries(Xc3dUIManager.document.userData.XcNamedViews));
    const cameraJSONData = namedViews.get(name);

    XcSysAssert({assertion: !cameraJSONData, message: 'Cannot find named views.'});

    const position = XcGm3dPosition.fromJSON({json: cameraJSONData.position});
    const up = XcGm3dPosition.fromJSON({json: cameraJSONData.up});
    const target = XcGm3dPosition.fromJSON({json: cameraJSONData.target});
    const left = cameraJSONData.left;
    const right = cameraJSONData.right;
    const top = cameraJSONData.top;
    const bottom = cameraJSONData.bottom;
    const near = cameraJSONData.near;
    const far = cameraJSONData.far;

    Xc3dUIManager.renderingCamera.position.set(position.x, position.y, position.z);
    Xc3dUIManager.renderingCamera.up.set(up.x, up.y, up.z);
    Xc3dUIManager.renderingCameraTarget = target;
    Xc3dUIManager.renderingCamera.lookAt(Xc3dUIManager.renderingCameraTarget.toThreeVector3());
    Xc3dUIManager.renderingCamera.left = left;
    Xc3dUIManager.renderingCamera.right = right;
    Xc3dUIManager.renderingCamera.top = top;
    Xc3dUIManager.renderingCamera.bottom = bottom;
    Xc3dUIManager.renderingCamera.near = near;
    Xc3dUIManager.renderingCamera.far = far;
    Xc3dUIManager.resize();
    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();
    Xc3dUIManager.updateUCSScene();

    Xc3dUIManager.redraw();
  }

  static* orbitView({vector, duration}) {
    const orbitVector = new XcGm3dVector({x: vector.x, y: vector.y, z: vector.z});
    const normalizedOrbitVector = orbitVector.normal;
    const vectorLength = orbitVector.length;

    const steps = duration / Xc3dUIAnimation.animationDelay;
    const stepLength = vectorLength / steps;
    for (let i = 0; i < steps; ++i) {
      const stepOrbitVector = XcGm3dVector.multiply({vector: normalizedOrbitVector, scale: stepLength});
      Xc3dUIManager.orbitCamera({orbitVector: new THREE.Vector2(stepOrbitVector.x, stepOrbitVector.y)});

      Xc3dUIManager.redraw();

      let event = yield;
    }
  }

  static* panView({vector, duration}) {
    const panVector = new XcGm3dVector({x: vector.x, y: vector.y, z: vector.z});
    const normalizedOrbitVector = panVector.normal;
    const vectorLength = panVector.length;

    const steps = duration / Xc3dUIAnimation.animationDelay;
    const stepLength = vectorLength / steps;
    for (let i = 0; i < steps; ++i) {
      const stepOrbitVector = XcGm3dVector.multiply({vector: normalizedOrbitVector, scale: stepLength});
      Xc3dUIManager.panCamera({panVector: new THREE.Vector2(stepOrbitVector.x, stepOrbitVector.y)});

      Xc3dUIManager.redraw();

      let event = yield;
    }
  }

  static* zoomView({factor, duration}) {
    const steps = duration / Xc3dUIAnimation.animationDelay;
    const stepZoomFactor = Math.pow(factor, 1 / steps);

    for (let i = 0; i < steps; ++i) {
      Xc3dUIManager.zoomCamera({factor: stepZoomFactor});

      Xc3dUIManager.redraw();

      let event = yield;
    }
  }

  static* translate({drawableObject, distance, direction, duration}) {
    const steps = duration / Xc3dUIAnimation.animationDelay;
    const distanceStep = distance / steps;

    for (let i = 0; i < steps; ++i) {
      const matrix = XcGm3dMatrix.translationMatrix({
        vector: XcGm3dVector.multiply({
          vector: direction,
          scale: distanceStep
        })
      });
      drawableObject.transform({matrix});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject});
      Xc3dUIManager.redraw();

      yield;
    }
  }

  static* rotate({drawableObject, angle, axis, duration}) {
    const steps = duration / Xc3dUIAnimation.animationDelay;
    const angeleStep = angle / steps;

    for (let i = 0; i < steps; ++i) {
      const matrix = XcGm3dMatrix.rotationMatrix({angle: angeleStep * i, axis});
      drawableObject.transform({matrix});
      Xc3dUIManager.document.modifyDrawableObject({drawableObject});
      Xc3dUIManager.redraw();

      yield;
    }
  }

  static* transparentize({drawableObject, start, end, duration}) {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
    XcSysAssert({assertion: renderingObject});

    const steps = duration / Xc3dUIAnimation.animationDelay;
    const delta = (end - start) / steps;

    for (let i = 0; i < steps; ++i) {
      renderingObject.material.transparent = true;
      renderingObject.material.opacity = start + i * delta;

      Xc3dUIManager.redraw();

      yield;
    }
  }

  static* runCustomAction({action}) {
    let ret = null;
    do {
      ret = action.next();
      if (ret.value) {
        Xc3dUIManager.document.modifyDrawableObject({drawableObject: ret.value});
        Xc3dUIManager.redraw();
      }

      yield;
    }
    while (!ret.done);
  }
}
