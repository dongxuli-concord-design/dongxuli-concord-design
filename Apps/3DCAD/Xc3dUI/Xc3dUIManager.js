class Xc3dUIMouseEvent {
  static TYPE = {
    DOWN: Symbol('DOWN'),
    UP: Symbol('UP'),
    ENTER: Symbol('ENTER'),
    LEAVE: Symbol('LEAVE'),
    MOVE: Symbol('MOVE')
  };

  type = null;
  which = null;
  position = null;

  constructor({type, position, which = null}) {
    this.type = type;
    this.which = which;
    this.position = position.clone();
  }
}

class Xc3dUITouchEvent {
  static TYPE = {
    START: Symbol('START'),
    MOVE: Symbol('MOVE'),
    END: Symbol('END')
  };

  type = null;
  touches = null;
  targetTouches = null;
  changedTouches = null;

  constructor({type, touches, targetTouches, changedTouches}) {
    this.type = type;
    this.touches = touches;
    this.targetTouches = targetTouches;
    this.changedTouches = changedTouches;
  };
}

class Xc3dUIManager {
  static renderingFont = null;
  static canvas = null;
  static mainScene = null;
  static overlayScene = null;
  static webGLRenderer = null;
  static renderingCamera = null;
  static #worldCoordinateSystem = new XcGmCoordinateSystem();
  static #userCoordinateSystem = Xc3dUIManager.#worldCoordinateSystem;
  static #needRedraw = true;

  static #axisLength = null;
  static groundPlane = null;
  static ucsAxesHelper = null;

  static document = null;

  static #userData = {};

  static set userData(data) {
    XcSysAssert({assertion: false, message: 'Cannot overwrite userData object.'});
  }

  static get userData() {
    return Xc3dUIManager.#userData;
  }

  static #namedViews = new Map();

  static DraggingIntensity = {
    LOW: Symbol('LOW'),
    MEDIUM: Symbol('MEDIUM'),
    HIGH: Symbol('HIGH')
  };

  static customRenderingObjectGroup = new THREE.Group();
  static customOverlayRenderingObjectGroup = new THREE.Group();
  static highlightsRenderingObjectGroup = new THREE.Group();

  static get ucs() {
    return Xc3dUIManager.#userCoordinateSystem.clone();
  }

  static set ucs(coordinateSystem) {
    Xc3dUIManager.#userCoordinateSystem = coordinateSystem;

    const matrix = this.#userCoordinateSystem.toMatrix().toThreeMatrix4();
    // Ground plane and the axis helper
    Xc3dUIManager.ucsScene.position.set(0,0,0);
    Xc3dUIManager.ucsScene.rotation.set(0,0,0);
    Xc3dUIManager.ucsScene.updateMatrix();
    Xc3dUIManager.ucsScene.updateMatrixWorld();
    
    Xc3dUIManager.ucsScene.applyMatrix4(matrix);

    Xc3dUIManager.redraw();
  }

  static resetUCS() {
    Xc3dUIManager.ucs = Xc3dUIManager.#worldCoordinateSystem;

  }

  static init({document}) {
    Xc3dUIManager.document = document;

    const threeJsFontLoader = new THREE.FontLoader();
    const path = require('path');
    const fs = require('fs');
    const joinedPath = path.join(nw.App.startPath, Xc3dUIConfig.renderingFontPath);
    const fileContents = fs.readFileSync(joinedPath);
    const fontJsonObject = JSON.parse(fileContents);
    Xc3dUIManager.renderingFont = threeJsFontLoader.parse(fontJsonObject);

    Xc3dUII18n.init();

    Xc3dUIManager.unitSpanElement = XcSysManager.htmlToElement({htmlString: ' <p class="text-info" style = "position: absolute; right: 0px; bottom: 0px; width: fit-content; height: fit-content; text-align: center; margin: 1em; padding: 5px; user-select: none; user-drag: none; ">${unitStr} ${Xc3dUIConfig.unit}<span></span></p> '});
    XcSysManager.canvasDiv.append(Xc3dUIManager.unitSpanElement);

    // WebGL
    Xc3dUIManager.mainScene = new THREE.Scene();
    Xc3dUIManager.overlayScene = new THREE.Scene();
    Xc3dUIManager.ucsScene = new THREE.Scene();

    // Lights
    Xc3dUIManager.mainScene.add(new THREE.AmbientLight(0xffffff, 0.2));
    Xc3dUIManager.overlayScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7));

    Xc3dUIManager.overlayScene.add(new THREE.AmbientLight(0xffffff, 0.2));
    Xc3dUIManager.overlayScene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7));

    Xc3dUIManager.webGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
      gammaInput: true,
      gammaOutput: true,
      preserveDrawingBuffer: true,
    });
    Xc3dUIManager.webGLRenderer.autoClear = false;
    Xc3dUIManager.webGLRenderer.localClippingEnabled = true;

    Xc3dUIManager.webGLRenderer.setPixelRatio(window.devicePixelRatio);

    Xc3dUIManager.webGLRenderer.setClearColor(0xf1f1f1, 1);
    XcSysManager.canvasDiv.append(Xc3dUIManager.webGLRenderer.domElement);
    Xc3dUIManager.canvas = Xc3dUIManager.webGLRenderer.domElement;

    Xc3dUIManager.renderingCamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 2000);

    // Camera light
    Xc3dUIManager.renderingCamera.add(new THREE.PointLight(0xffffff));
    Xc3dUIManager.mainScene.add(Xc3dUIManager.renderingCamera);

    Xc3dUIManager.resetCamera();

    Xc3dUIManager.#pumpEvents();
    Xc3dUIManager.mainScene.add(Xc3dUIManager.document.renderingScene);
    Xc3dUIManager.mainScene.add(Xc3dUIManager.customRenderingObjectGroup);
    Xc3dUIManager.overlayScene.add(Xc3dUIManager.customOverlayRenderingObjectGroup);

    function repaint(timestamp) {
      if (Xc3dUIManager.#needRedraw) {
        Xc3dUIManager.#flushRedraw(timestamp);
        Xc3dUIManager.#needRedraw = false;
      }

      requestAnimationFrame(repaint);
    }
    requestAnimationFrame(repaint);

    // Flush anyway after a while
    setInterval(() => Xc3dUIManager.#needRedraw = true, 10 * 1000);

    Xc3dUICameraController.run();
    Xc3dUIManager.xcPadCoroutine = Xc3dUIXcPadCoroutine.run();
    Xc3dUIManager.xcPadCoroutine.next();
  }

  static #pumpEvents() {
    window.addEventListener('resize', function () {
      Xc3dUIManager.#resize();
    });

    Xc3dUIManager.canvas.addEventListener('mousedown', function (event) {
      const position = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
        clientX: event.clientX,
        clientY: event.clientY
      });
      const e = new Xc3dUIMouseEvent({
        type: Xc3dUIMouseEvent.TYPE.DOWN,
        which: event.which,
        position
      });
      XcSysManager.dispatchEvent({event: e});
    });

    Xc3dUIManager.canvas.addEventListener('mouseup', function (event) {
      const position = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
        clientX: event.clientX,
        clientY: event.clientY
      });
      const e = new Xc3dUIMouseEvent({
        type: Xc3dUIMouseEvent.TYPE.UP,
        which: event.which,
        position
      });
      XcSysManager.dispatchEvent({event: e});
    });

    Xc3dUIManager.canvas.addEventListener('mousemove', function (event) {
      const position = Xc3dUIManager.computerScreenPositionFromMouseCoordinates({
        clientX: event.clientX,
        clientY: event.clientY
      });
      const e = new Xc3dUIMouseEvent({
        type: Xc3dUIMouseEvent.TYPE.MOVE,
        which: null,
        position
      });
      XcSysManager.dispatchEvent({event: e});
    });

    Xc3dUIManager.canvas.addEventListener('touchstart', function (event) {
      const originalEvent = event.originalEvent;
      const e = new Xc3dUITouchEvent({
        type: Xc3dUITouchEvent.TYPE.START,
        touches: originalEvent.touches,
        targetTouches: originalEvent.targetTouches,
        changedTouches: originalEvent.changedTouches
      });
      XcSysManager.dispatchEvent({event: e});
    });

    Xc3dUIManager.canvas.addEventListener('touchmove', function (event) {
      const originalEvent = event.originalEvent;
      const e = new Xc3dUITouchEvent({
        type: Xc3dUITouchEvent.TYPE.MOVE,
        touches: originalEvent.touches,
        targetTouches: originalEvent.targetTouches,
        changedTouches: originalEvent.changedTouches
      });
      XcSysManager.dispatchEvent({event: e});
    });

    Xc3dUIManager.canvas.addEventListener('touchend', function (event) {
      const originalEvent = event.originalEvent;

      const e = new Xc3dUITouchEvent({
        type: Xc3dUITouchEvent.TYPE.END,
        touches: originalEvent.touches,
        targetTouches: originalEvent.targetTouches,
        changedTouches: originalEvent.changedTouches
      });
      XcSysManager.dispatchEvent({event: e});
    });

    // XcPad loop
    if (false) {
      // Show local IP address
      // https://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js
      function showIPAddress() {
        const os = require('os');

        const interfaces = os.networkInterfaces();
        const addresses = [];
        for (const k in interfaces) {
          for (const k2 in interfaces[k]) {
            const address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
            }
          }
        }

        // TODO: Should keep this message visible in somewhere.
        XcSysManager.outputDisplay.info(`Viewpad server address: ${addresses.toString()}:8080`);
      }

      showIPAddress();

      // 60 ms is a good frequency to send the data to keep the browser smooth.
      // Value determined by experiments.
      // Also check https://github.com/leapmotion/leapjs/blob/master/leap-0.6.4.js for comments.
      const webSocketMessageQueue = [];
      const socketServerURL = 'ws://localhost:8081';
      const socket = new WebSocket(socketServerURL);
      socket.addEventListener('error', function () {
        XcSysManager.outputDisplay.warn(`Cannot connect to ${socketServerURL}`);
      });
      const socketMessageSpan = 70;
      // Listen for messages
      socket.addEventListener('message', function (event) {
        webSocketMessageQueue.push(JSON.parse(event.data));
      });

      function simplifyTouchEventQueue({queue}) {
        const newQueue = [];
        let lastType = null;
        for (const item of queue) {
          if ((item.type === 'touchmove') && (lastType === 'touchmove')) {
            // Skip

          } else {
            newQueue.push(item);
            lastType = item.type;
          }
        }

        return newQueue;
      }

      setInterval(function () {
        if (webSocketMessageQueue.length > 0) {
          const simplifiedQueue = simplifyTouchEventQueue({queue: webSocketMessageQueue});
          webSocketMessageQueue.length = 0;
          setTimeout(() => {
            Xc3dUIManager.xcPadCoroutine.next(new Xc3dUIXcPadTouchEventQueue({events: simplifiedQueue}));
          }, 0);
        }
      }, socketMessageSpan);
    }
  }

  static resetCamera() {
    const maxSize = 10000; // According to geometric kernel
    Xc3dUIManager.renderingCamera.position.set(maxSize * 2, -maxSize * 2, maxSize * 2);
    Xc3dUIManager.renderingCamera.up.set(0, 0, 1);
    Xc3dUIManager.renderingCameraTarget = new XcGm3dPosition();
    Xc3dUIManager.renderingCamera.lookAt(Xc3dUIManager.renderingCameraTarget.toThreeVector3());

    const halfViewSize = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: Xc3dUIConfig.initialSpaceSize});

    Xc3dUIManager.renderingCamera.left = -halfViewSize;
    Xc3dUIManager.renderingCamera.right = halfViewSize;
    Xc3dUIManager.renderingCamera.top = halfViewSize;
    Xc3dUIManager.renderingCamera.bottom = -halfViewSize;

    // Use large near
    // https://stackoverflow.com/questions/21080619/three-js-webgl-large-spheres-appear-broken-at-intersection
    Xc3dUIManager.renderingCamera.near = maxSize;
    Xc3dUIManager.renderingCamera.far = maxSize * 2 * 2;
    // We also have to resize so that we can adjust the camera field proportional to the canvas
    Xc3dUIManager.#resize();

    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.#updateUCSScene();

    Xc3dUIManager.redraw();
  }

  static orthogonalizeCamera() {
    const cameraDirection = XcGm3dPosition.subtract({
      position: XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position}),
      positionOrVector: Xc3dUIManager.renderingCameraTarget
    });
    const distance = Xc3dUIManager.renderingCameraTarget.distanceToPosition({position: XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position})});
    const ucs = Xc3dUIManager.ucs;
    const xAxisDirection = ucs.xAxisDirection.clone();
    const yAxisDirection = ucs.zAxisDirection.crossProduct({vector: ucs.xAxisDirection}).normal;
    const zAxisDirection = ucs.zAxisDirection.clone();
    const axes = [
      xAxisDirection,
      yAxisDirection,
      zAxisDirection,
      xAxisDirection.negation(),
      yAxisDirection.negation(),
      zAxisDirection.negation(),
    ];

    axes.sort((a, b) => {
      const angleA = cameraDirection.angleTo({vector: a});
      const angleB = cameraDirection.angleTo({vector: b});
      return angleA - angleB;
    });

    const offsetVec = axes[0];
    offsetVec.multiply({scale: distance});

    const newCameraPosition = XcGm3dPosition.add({
      position: Xc3dUIManager.renderingCameraTarget,
      vector: offsetVec
    }).toThreeVector3();

    axes.shift();
    axes.sort((a, b) => {
      const upVec = XcGm3dVector.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.up});
      const angleA = upVec.angleTo({vector: a});
      const angleB = upVec.angleTo({vector: b});
      return angleA - angleB;
    });
    const newCameraUpVec = axes[0];

    Xc3dUIManager.renderingCamera.position.copy(newCameraPosition);
    Xc3dUIManager.renderingCamera.up.copy(newCameraUpVec.toThreeVector3());
    Xc3dUIManager.renderingCamera.lookAt(Xc3dUIManager.renderingCameraTarget.toThreeVector3());
    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.#updateUCSScene();

    Xc3dUIManager.redraw();
  }

  static zoomCamera({factor}) {
    Xc3dUIManager.renderingCamera.left *= factor;
    Xc3dUIManager.renderingCamera.right *= factor;
    Xc3dUIManager.renderingCamera.top *= factor;
    Xc3dUIManager.renderingCamera.bottom *= factor;

    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.#updateUCSScene();
    Xc3dUIManager.redraw();
  }

  static zoomExtent() {
    // TODO: Fix this issue
    const box1 = new THREE.Box3().setFromObject(Xc3dUIManager.mainScene);
    const box2 = new THREE.Box3().setFromObject(Xc3dUIManager.overlayScene);
    const box = box1;
    box.union(box2);
    if (box.isEmpty()) {
      return;
    }

    box.applyMatrix4(Xc3dUIManager.renderingCamera.matrixWorld);
    const size = new THREE.Vector3();
    box.getSize(size);

    Xc3dUIManager.renderingCamera.left = -size.x / 2.0;
    Xc3dUIManager.renderingCamera.right = size.x / 2.0;
    Xc3dUIManager.renderingCamera.top = size.y / 2.0;
    Xc3dUIManager.renderingCamera.bottom = -size.y / 2.0;

    Xc3dUIManager.#resize();

    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.#updateUCSScene();
    Xc3dUIManager.redraw();
  }

  static panCamera({panVector}) {
    const currentWorldPosition = Xc3dUIManager.getPositionWorldFromScreen({screenPosition: panVector, depth: 0});
    const lastWorldPosition = Xc3dUIManager.getPositionWorldFromScreen({
      screenPosition: new XcGm2dVector({x: 0, y: 0}),
      depth: 0
    });
    const deltaVector = XcGm3dPosition.subtract({position: currentWorldPosition, positionOrVector: lastWorldPosition});

    const newPosition = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position});
    newPosition.subtract({positionOrVector: deltaVector});
    Xc3dUIManager.renderingCameraTarget.subtract({positionOrVector: deltaVector});

    Xc3dUIManager.renderingCamera.position.copy(newPosition.toThreeVector3());
    Xc3dUIManager.renderingCamera.lookAt(Xc3dUIManager.renderingCameraTarget.toThreeVector3());

    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.redraw();
  }

  static orbitCamera({orbitVector}) {
    const containerWidth = XcSysManager.canvasDiv.clientWidth;
    const containerHeight = XcSysManager.canvasDiv.clientHeight;
    const deltaXRate = 2.0 * Math.PI / containerWidth;
    const deltaYRate = 2.0 * Math.PI / containerHeight;
    const deltaX = orbitVector.x;
    const deltaY = orbitVector.y;

    const deltaXAngle = -1 * deltaX * deltaXRate;
    const deltaYAngle = deltaY * deltaYRate;

    const newPosition = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position});
    const newUpVector = XcGm3dVector.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.up});

    const target = Xc3dUIManager.renderingCameraTarget.toThreeVector3().clone();

    const n = XcGm3dPosition.subtract({position: newPosition, positionOrVector: target}).normal;

    const u = XcGm3dVector.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.up}).crossProduct({vector: n}).normal;

    const v = n.crossProduct({vector: u});

    const matRotateX = XcGm3dMatrix.rotationMatrix({
      angle: deltaXAngle,
      axis: new XcGm3dAxis({position: target, direction: v})
    });
    const matRotateY = XcGm3dMatrix.rotationMatrix({
      angle: deltaYAngle,
      axis: new XcGm3dAxis({position: target, direction: u.negation()})
    });

    newPosition.transform({matrix: matRotateX});
    newPosition.transform({matrix: matRotateY});

    newUpVector.transform({matrix: matRotateX});
    newUpVector.transform({matrix: matRotateY});
    newUpVector.normalize();

    Xc3dUIManager.renderingCamera.position.copy(newPosition.toThreeVector3());
    Xc3dUIManager.renderingCamera.up.copy(newUpVector.toThreeVector3());
    Xc3dUIManager.renderingCamera.lookAt(target);

    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();

    Xc3dUIManager.redraw();
  }

  static setNamedView({name, viewJSONData}) {
    Xc3dUIManager.#namedViews.set(name, viewJSONData);
  }

  static get namedViews() {
    return Xc3dUIManager.#namedViews;
  }

  static getCurrentViewJSONData() {
    const position = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position});
    const up = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.up});
    const target = Xc3dUIManager.renderingCameraTarget.clone();
    const left = Xc3dUIManager.renderingCamera.left;
    const right = Xc3dUIManager.renderingCamera.right;
    const top = Xc3dUIManager.renderingCamera.top;
    const bottom = Xc3dUIManager.renderingCamera.bottom;
    const near = Xc3dUIManager.renderingCamera.near;
    const far = Xc3dUIManager.renderingCamera.far;

    const viewJSONData = {
      position: position.toJSON(),
      up: up.toJSON(),
      target: target.toJSON(),
      left,
      right,
      top,
      bottom,
      near,
      far,
    };

    return viewJSONData;
  }

  static deleteNamedView({name}) {
    return Xc3dUIManager.#namedViews.delete(name);
  }

  static setCurrentView({name}) {
    if (!Xc3dUIManager.#namedViews.has(name)) {
      return false;
    }

    const viewJSONData = Xc3dUIManager.#namedViews.get(name);

    const position = XcGm3dPosition.fromJSON({json: viewJSONData.position});
    const up = XcGm3dPosition.fromJSON({json: viewJSONData.up});
    const target = XcGm3dPosition.fromJSON({json: viewJSONData.target});
    const left = viewJSONData.left;
    const right = viewJSONData.right;
    const top = viewJSONData.top;
    const bottom = viewJSONData.bottom;
    const near = viewJSONData.near;
    const far = viewJSONData.far;

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
    Xc3dUIManager.#resize();
    Xc3dUIManager.renderingCamera.updateMatrixWorld();
    Xc3dUIManager.renderingCamera.updateProjectionMatrix();
    Xc3dUIManager.#updateUCSScene();

    Xc3dUIManager.redraw();

    return true;
  }

  static *setViewToLookAtUCS() {
    const animationSteps = 24;
    const animationFrameTime = (1/24)*1000;
    const oldRenderingCameraPosition = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position});
    const oldRenderingCameraUp = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.up});
    const oldRenderingCameraTarget = Xc3dUIManager.renderingCameraTarget.clone();

    const coordinateSystem = Xc3dUIManager.ucs;
    const origin = coordinateSystem.origin;
    const xAxisDirection = coordinateSystem.xAxisDirection;
    const zAxisDirection = coordinateSystem.zAxisDirection;
    const yAxisDirection = zAxisDirection.crossProduct({vector: xAxisDirection});
    yAxisDirection.normalize();

    const currentCameraDepth = oldRenderingCameraTarget.distanceToPosition({position: oldRenderingCameraPosition});
    zAxisDirection.multiply({scale: currentCameraDepth});

    const newRenderingCameraPosition = XcGm3dPosition.add({position: origin, vector: zAxisDirection});
    const newRenderingCameraUp = yAxisDirection;
    const newRenderingCameraTarget = origin;

    const positionDiffVector = XcGm3dPosition.subtract({position: newRenderingCameraPosition, positionOrVector: oldRenderingCameraPosition});
    const targetDiffVector = XcGm3dPosition.subtract({position: newRenderingCameraTarget, positionOrVector: oldRenderingCameraTarget});
    const upDiffVector = XcGm3dPosition.subtract({position: newRenderingCameraUp, positionOrVector: oldRenderingCameraUp});

    const positionDiffVectorNormal = positionDiffVector.normal;
    const positionDiffVectorLength = positionDiffVector.length;
    const targetDiffVectorNormal = targetDiffVector.normal;
    const targetDiffVectorLength = targetDiffVector.length;
    const upDiffVectorNormal = upDiffVector.normal;
    const upDiffVectorLength = upDiffVector.length;

    for (let i = 0; i <= animationSteps; i += 1) {
      const intermediatePositionDiff = XcGm3dVector.multiply({vector: positionDiffVectorNormal, scale: (i / animationSteps) * positionDiffVectorLength});
      const intermediateTargetDiff = XcGm3dVector.multiply({vector: targetDiffVectorNormal, scale: (i / animationSteps) * targetDiffVectorLength});
      const intermediateUpDiff = XcGm3dVector.multiply({vector: upDiffVectorNormal, scale: (i / animationSteps) * upDiffVectorLength});

      const intermediateCameraPosition = XcGm3dPosition.add({position: oldRenderingCameraPosition, vector: intermediatePositionDiff});
      const intermediateCameraTarget = XcGm3dPosition.add({position: oldRenderingCameraTarget, vector: intermediateTargetDiff});
      const intermediateCameraUp = XcGm3dPosition.add({position: oldRenderingCameraUp, vector: intermediateUpDiff});

      Xc3dUIManager.renderingCamera.position.copy(intermediateCameraPosition.toThreeVector3());
      Xc3dUIManager.renderingCamera.up.copy(intermediateCameraUp.toThreeVector3());
      Xc3dUIManager.renderingCamera.lookAt(intermediateCameraTarget.toThreeVector3());

      Xc3dUIManager.renderingCamera.updateMatrix();
      Xc3dUIManager.renderingCamera.updateProjectionMatrix();

      Xc3dUIManager.#updateUCSScene();

      Xc3dUIManager.redraw();
      yield* XcSysManager.sleep({delay: animationFrameTime});
    }
  }

  static renderingObjectsOfUCS() {
    return Xc3dUIManager.ucsScene;
  }

  static #resize() {
    const width = XcSysManager.canvasDiv.clientWidth;
    const height = XcSysManager.canvasDiv.clientHeight;
    Xc3dUIManager.webGLRenderer.setSize(width, height);
    const aspect = width / height;
    const viewWidth = Xc3dUIManager.renderingCamera.right - Xc3dUIManager.renderingCamera.left;
    const viewHeight = Xc3dUIManager.renderingCamera.top - Xc3dUIManager.renderingCamera.bottom;

    if (aspect >= 1.0) {
      Xc3dUIManager.renderingCamera.left = -(viewHeight / 2.0) * aspect;
      Xc3dUIManager.renderingCamera.right = (viewHeight / 2.0) * aspect;
    } else {
      Xc3dUIManager.renderingCamera.top = (viewWidth / 2.0) / aspect;
      Xc3dUIManager.renderingCamera.bottom = -(viewWidth / 2.0) / aspect;
    }

    Xc3dUIManager.renderingCamera.updateProjectionMatrix();
    Xc3dUIManager.redraw();
  }

  static #updateUCSScene() {
    if (!Xc3dUIManager.ucsScene.visible) {
      return;
    }

    Xc3dUIManager.ucsScene.remove(...Xc3dUIManager.ucsScene.children);
    Xc3dUIManager.unitSpanElement.innerText = '';

    // UCS: Ground plane, the axis helper, and labels
    const getScaleLength = function () {
      const scaleLength = 100; // The minimal length to show a scale
      const y = scaleLength / Xc3dUIManager.getNumPixelsInUnit();
      if (y < 0.001) {
        return null;
      } else if ((y > 0.001) && (y < 0.01)) {
        return 0.001;
      } else if ((y > 0.01) && (y < 0.1)) {
        return 0.01;
      } else if ((y > 0.1) && (y < 1)) {
        return 0.1;
      } else if ((y > 1) && (y < 10)) {
        return 1;
      } else if ((y > 10) && (y < 100)) {
        return 10;
      } else {
        return null;
      }
    };

    const scaleLength = getScaleLength();
    if (scaleLength !== null) {
      Xc3dUIManager.#axisLength = (XcSysManager.canvasDiv.clientHeight / 2.0) / Xc3dUIManager.getNumPixelsInUnit();
      const scaleNumber = Math.floor(Xc3dUIManager.#axisLength / scaleLength);

      Xc3dUIManager.ucsScene.userData.scaleNumber = scaleNumber;
      Xc3dUIManager.ucsScene.userData.scaleLength = scaleLength;

      const groundPlaneGeometry = new THREE.PlaneGeometry(scaleNumber * scaleLength * 4, scaleNumber * scaleLength * 4, scaleNumber * 4, scaleNumber * 4);
      const groundPlaneMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xC0C0C0),
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      Xc3dUIManager.groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
      Xc3dUIManager.ucsScene.add(Xc3dUIManager.groundPlane);
      Xc3dUIManager.ucsAxesHelper = new THREE.AxesHelper(Xc3dUIManager.#axisLength);
      Xc3dUIManager.ucsScene.add(Xc3dUIManager.ucsAxesHelper);

      const oneGridStr = Xc3dUII18n.i18n.T`One grid`;
      const gridSizeStr = `${Xc3dUIManager.computeValueWithUnitFromStandardValue({value: scaleLength})} ${Xc3dUIConfig.unit}]`;
      let ucsStr = null;
      if (Xc3dUIManager.#userCoordinateSystem === Xc3dUIManager.#worldCoordinateSystem) {
        ucsStr = Xc3dUII18n.i18n.T`WCS`;
      } else {
        ucsStr = Xc3dUII18n.i18n.T`UCS`;
      }
      Xc3dUIManager.unitSpanElement.innerText = `[${ucsStr}] [${oneGridStr} = ${gridSizeStr}]`;
    }
  }

  static redraw() {
    Xc3dUIManager.#needRedraw = true;
  }

  static #flushRedraw(timestamp) {
    Xc3dUIManager.#needRedraw = false;

    Xc3dUIManager.webGLRenderer.clear();
    Xc3dUIManager.webGLRenderer.render(Xc3dUIManager.mainScene, Xc3dUIManager.renderingCamera);
    Xc3dUIManager.webGLRenderer.render(Xc3dUIManager.ucsScene, Xc3dUIManager.renderingCamera);

    Xc3dUIManager.webGLRenderer.clearDepth();
    Xc3dUIManager.webGLRenderer.render(Xc3dUIManager.overlayScene, Xc3dUIManager.renderingCamera);
  }

  static #pickingPrecisionIn3DSpace() {
    const numPixelsInUnit = Xc3dUIManager.getNumPixelsInUnit();
    return (Xc3dUIConfig.pickingPrecisionInPixels * 0.5) / numPixelsInUnit;
  }

  static getNumPixelsInUnit() {
    const pos1 = Xc3dUIManager.renderingCamera.position.clone();
    const upVector = Xc3dUIManager.renderingCamera.up.clone();
    upVector.normalize();
    const pos2 = pos1.clone();
    pos2.add(upVector);

    const posInScreen1 = Xc3dUIManager.getPositionInScreenFromWorld({worldPosition: pos1});
    const posInScreen2 = Xc3dUIManager.getPositionInScreenFromWorld({worldPosition: pos2});

    return posInScreen1.distanceToPosition({position: posInScreen2});
  }

// http://soledadpenades.com/articles/three-js-tutorials/object-picking/
// http://moczys.com/2014/01/09/three-js-experiment-2-selectionhighlighting/
  static getPositionInNDCFromScreen({screenPosition}) {
    // Get NDC coordinates
    const x = 2 * (screenPosition.x / Xc3dUIManager.canvas.clientWidth) - 1;
    const y = 1 - 2 * (screenPosition.y / Xc3dUIManager.canvas.clientHeight);
    return new XcGm2dPosition({x, y});
  }

  static getUCSPositionFromWorldPosition({worldPosition}) {
    const ucsToWorld = Xc3dUIManager.ucs.toMatrix();
    const worldToUcs = ucsToWorld.inverse;

    const ucsPosition = worldPosition.clone();
    ucsPosition.transform({matrix: worldToUcs});
    return ucsPosition;
  }

  static getWorldPositionFromUCSPosition({ucsPosition}) {
    const worldPosition = ucsPosition.clone();
    worldPosition.transform({matrix: Xc3dUIManager.ucs.toMatrix()});
    return worldPosition;
  }

  static getPositionInScreenFromWorld({worldPosition}) {
    let positionInScreen = null;
    if (worldPosition instanceof XcGm3dPosition) {
      positionInScreen = worldPosition.toThreeVector3();
    } else if (worldPosition instanceof THREE.Vector3) {
      positionInScreen = worldPosition.clone();
    } else {
      XcSysAssert({assertion: false, message: 'Expect XcGm3dPosition or THREE.Vector3'});
    }

    const width = Xc3dUIManager.canvas.clientWidth;
    const height = Xc3dUIManager.canvas.clientHeight;

    const widthHalf = width / 2, heightHalf = height / 2;

    positionInScreen.project(Xc3dUIManager.renderingCamera);
    positionInScreen.x = (positionInScreen.x * widthHalf) + widthHalf;
    positionInScreen.y = -(positionInScreen.y * heightHalf) + heightHalf;

    return new XcGm2dPosition({x: positionInScreen.x, y: positionInScreen.y});
  }

// http://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
  static getPositionWorldFromScreen({
                                       screenPosition,
                                       depth = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position}).distanceToPosition({position: Xc3dUIManager.renderingCameraTarget})
                                     }) {
    const positionInNDC = Xc3dUIManager.getPositionInNDCFromScreen({screenPosition});

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(positionInNDC.toThreeVector2(), Xc3dUIManager.renderingCamera);

    const threeVector3 = new THREE.Vector3();
    rayCaster.ray.at(depth, threeVector3);

    return XcGm3dPosition.fromThreeVector3({threeVector3});
  }

  static pick({
                screenPosition,
                targetRenderingObjects
    }) {
    const positionInNDC = Xc3dUIManager.getPositionInNDCFromScreen({screenPosition});

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(positionInNDC.toThreeVector2(), Xc3dUIManager.renderingCamera);
    const pickingPrecision = Xc3dUIManager.#pickingPrecisionIn3DSpace();
    rayCaster.params.Line.threshold = pickingPrecision;
    rayCaster.params.Points.threshold = pickingPrecision;

    const intersects = rayCaster.intersectObjects(targetRenderingObjects, true);

    // Re-sort the intersection according to types
    const getPickingWeight = (renderingObject) => {
      let renderingObjectWeight = 4;
      if (renderingObject instanceof THREE.Points) {
        renderingObjectWeight = 1;
      } else if (renderingObject instanceof THREE.Line) {
        renderingObjectWeight = 2;
      } else if (renderingObject instanceof THREE.Mesh) {
        renderingObjectWeight = 3;
      } else {
        renderingObjectWeight = 4;
      }

      return renderingObjectWeight;
    };

    intersects.sort(function (intersectA, intersectB) {
      const weightA = getPickingWeight(intersectA.object);
      const weightB = getPickingWeight(intersectB.object);
      if (weightA === weightB) {
        if (Math.abs(intersectA.distance - intersectB.distance) === 0) {
          const random = Math.random();
          return random - 0.5;
        } else {
          return intersectA.distance - intersectB.distance;
        }
      } else {
        return weightA - weightB;
      }
    });

    const returnValue = intersects.map(intersect => {
      return {
        renderingObject: intersect.object,
        position: XcGm3dPosition.fromThreeVector3({threeVector3: intersect.point})
      };
    });


    return returnValue;
  }

  static showUCSGrid() {
    Xc3dUIManager.ucsScene.visible = true;
    Xc3dUIManager.redraw();
  }

  static hideUCSGrid() {
    Xc3dUIManager.ucsScene.visible = false;
    Xc3dUIManager.redraw();
  }

  static toggleUCSGrid() {
    Xc3dUIManager.ucsScene.visible = !Xc3dUIManager.ucsScene.visible;
    Xc3dUIManager.redraw();
  }

  //http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
  static computerScreenPositionFromMouseCoordinates({clientX, clientY}) {
    const rect = Xc3dUIManager.canvas.getBoundingClientRect();
    const root = document.documentElement;

    // return relative mouse position
    const screenX = clientX - rect.left - root.scrollLeft;
    const screenY = clientY - rect.top - root.scrollTop;

    return new XcGm2dPosition({x: screenX, y: screenY});
  }

  static showDrawableObject({drawableObject}) {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
    renderingObject.visible = true;
    Xc3dUIManager.redraw();
  }

  static hideDrawableObject({drawableObject}) {
    const renderingObject = Xc3dDocDocument.getRenderingObjectFromDrawableObject({drawableObject});
    renderingObject.visible = false;
    Xc3dUIManager.redraw();
  }

  // Ref: Designing with the Mind in Mind: Simple Guide to Understanding User Interface Design Rules
  // TODO: Rename
  static computeDraggingInterval({draggingIntensity}) {
    //TODO: We should put the parameters in the config
    switch (draggingIntensity) {
      case Xc3dUIManager.DraggingIntensity.LOW:
        // Minimum noticeable lag in ink as someone draws with a stylus
        return 10;
      case Xc3dUIManager.DraggingIntensity.MEDIUM:
        return 200;
      case Xc3dUIManager.DraggingIntensity.HIGH:
        // Visual-motor reaction time (intentional response to unexpected event)
        return 700;
    }
  }

  static generateHighlightingRenderingObject({renderingObject}) {
    const box = new THREE.Box3();
    box.setFromObject(renderingObject);
    box.expandByVector(new THREE.Vector3(0.05, 0.05, 0.05));
    const boxHelper = new THREE.Box3Helper(box, 0xffbf00);
    return boxHelper;
  }
  
  static addCustomRenderingObject({renderingObject}) {
    Xc3dUIManager.customRenderingObjectGroup.add(renderingObject);
    Xc3dUIManager.redraw();
  }

  static removeCustomRenderingObject({renderingObject}) {
    Xc3dUIManager.customRenderingObjectGroup.remove(renderingObject);

    Xc3dUIManager.redraw();
  }

  static clearCustomRenderingObjects() {
    Xc3dUIManager.customRenderingObjectGroup.remove(...Xc3dUIManager.customRenderingObjectGroup.children);
    Xc3dUIManager.redraw();
  }

  static addCustomOverlayRenderingObject({renderingObject}) {
    Xc3dUIManager.customOverlayRenderingObjectGroup.add(renderingObject);
    Xc3dUIManager.redraw();
  }

  static removeCustomOverlayRenderingObject({renderingObject}) {
    Xc3dUIManager.customOverlayRenderingObjectGroup.remove(renderingObject);

    Xc3dUIManager.redraw();
  }

  static clearCustomOverlayRenderingObjects() {
    Xc3dUIManager.customOverlayRenderingObjectGroup.remove(...Xc3dUIManager.customOverlayRenderingObjectGroup.children);
    Xc3dUIManager.redraw();
  }

  static computeStandardValueFromValueWithUnit({
                            value,
                            unit = Xc3dUIConfig.unit
                          }) {
    if (unit === 'mm') {
      return value / 1000;
    } else if (unit === 'cm') {
      return value / 100;
    } else if (unit === 'm') {
      return value;
    } else {
      XcSysAssert({assertion: false});
    }
  }

  static computeValueWithUnitFromStandardValue({
                        value,
                        unit = Xc3dUIConfig.unit
                      } = {}) {
    if (unit === 'mm') {
      return value * 1000;
    } else if (unit === 'cm') {
      return value * 100;
    } else if (unit === 'm') {
      return value;
    } else {
      XcSysAssert({assertion: false});
    }
  }

  static generateTextLabel({text, position, size = 0.1, height = 0.01, color = 0x000000} = {}) {
    const textGeometry = new THREE.TextGeometry(text, {
      font: Xc3dUIManager.renderingFont,
      size: size,
      height: height,
      curveSegments: 3,
      bevelEnabled: false
    });
    const label = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide}));
    label.position.set(position.x, position.y, position.z);

    return label;
  }
}
