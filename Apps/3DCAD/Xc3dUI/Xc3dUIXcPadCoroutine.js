// Singleton
class Xc3dUIXcPadTouchEventQueue {
  events = null;

  constructor({events}) {
    this.events = events;
  }
}

class Xc3dUIXcPadCoroutine {
  static #CommandState = {
    WaitForTouchInput: Symbol('WaitForTouchInput'),
  };

  static #Mode = {
    Orbit: Symbol('Orbit'),
    Zoom: Symbol('Zoom'),
    Pan: Symbol('Pan'),
    Unknown: Symbol('Unknown'),
  };

  static #eventQueue = null;
  static #currentMode = Xc3dUIXcPadCoroutine.#Mode.Orbit;
  static #orbitLastPosition = null;
  static #panLastPosition = null;
  static #zoomLastPosition0 = null;
  static #zoomLastPosition1 = null;
  static #zoomLastDistance = null;
  static #lastTargetTouchLength = null;

  static #i18n = null;

  static #setupLocale() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
    };

    if (XcSysConfig.locale === 'zh') {
      Xc3dUIXcPadCoroutine.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      Xc3dUIXcPadCoroutine.#i18n = new XcSysI18n();
    }
  }

  static* run() {
    Xc3dUIXcPadCoroutine.#setupLocale();

    Xc3dUIXcPadCoroutine.state = Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
    while (true) {
      switch (Xc3dUIXcPadCoroutine.state) {
        case Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput:
          Xc3dUIXcPadCoroutine.state = yield* Xc3dUIXcPadCoroutine.#onWaitForTouchInput();
          break;
        default:
          XcSysAssert({assertion: false, message: Xc3dUIXcPadCoroutine.#i18n.T`Internal command state error`});
          break;
      }
    }
  };

  static* #onWaitForTouchInput() {
    if ((Xc3dUIXcPadCoroutine.#eventQueue === null) || (Xc3dUIXcPadCoroutine.#eventQueue.events.length === 0)) {
      Xc3dUIXcPadCoroutine.#eventQueue = yield;
    }

    const event0 = Xc3dUIXcPadCoroutine.#eventQueue.events.shift();

    // We add "(Xc3dUIXcPadCoroutine.#lastTargetTouchLength !== event0.targetTouches.length)" because
    // sometime touchstart/touchend/touchcancel are not fired.
    if ((event0.type === 'touchstart') || (event0.type === 'touchend') || (event0.type === 'touchcancel') || (Xc3dUIXcPadCoroutine.#lastTargetTouchLength !== event0.targetTouches.length)) {
      Xc3dUIXcPadCoroutine.#lastTargetTouchLength = event0.targetTouches.length;
      // The number of touches changes
      // Reset the data
      if (event0.targetTouches.length === 1) {
        Xc3dUIXcPadCoroutine.#currentMode = Xc3dUIXcPadCoroutine.#Mode.Orbit;
        Xc3dUIXcPadCoroutine.#orbitLastPosition = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else if (event0.targetTouches.length === 2) {
        Xc3dUIXcPadCoroutine.#currentMode = Xc3dUIXcPadCoroutine.#Mode.Zoom;
        Xc3dUIXcPadCoroutine.#zoomLastPosition0 = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        Xc3dUIXcPadCoroutine.#zoomLastPosition1 = new XcGm2dVector({x: event0.targetTouches[1].pageX, y: event0.targetTouches[1].pageY});
        Xc3dUIXcPadCoroutine.#zoomLastDistance = Xc3dUIXcPadCoroutine.#zoomLastPosition0.distanceTo(Xc3dUIXcPadCoroutine.#zoomLastPosition1);
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else if (event0.targetTouches.length === 3) {
        Xc3dUIXcPadCoroutine.#currentMode = Xc3dUIXcPadCoroutine.#Mode.Pan;
        Xc3dUIXcPadCoroutine.#panLastPosition = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else {
        Xc3dUIXcPadCoroutine.#currentMode = Xc3dUIXcPadCoroutine.#Mode.Unknown;
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      }
    } else if (event0.type === 'touchmove') {
      if (Xc3dUIXcPadCoroutine.#currentMode === Xc3dUIXcPadCoroutine.#Mode.Orbit) {
        const currentPosition = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        const diffVector = new XcGm2dVector({x: currentPosition.x - Xc3dUIXcPadCoroutine.#orbitLastPosition.x, y: currentPosition.y - Xc3dUIXcPadCoroutine.#orbitLastPosition.y});
        Xc3dUIXcPadCoroutine.#orbitLastPosition = currentPosition;
        Xc3dUIManager.orbitCamera({orbitVector: diffVector});
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else if (Xc3dUIXcPadCoroutine.#currentMode === Xc3dUIXcPadCoroutine.#Mode.Zoom) {
        const currentZoomLastPosition0 = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        const currentZoomLastPosition1 = new XcGm2dVector({x: event0.targetTouches[1].pageX, y: event0.targetTouches[1].pageY});
        const currentZoomDistance = currentZoomLastPosition0.distanceTo(currentZoomLastPosition1);

        Xc3dUIXcPadCoroutine.#zoomLastPosition0 = currentZoomLastPosition0;
        Xc3dUIXcPadCoroutine.#zoomLastPosition1 = currentZoomLastPosition1;

        const zoomFactor = Xc3dUIXcPadCoroutine.#zoomLastDistance / currentZoomDistance;
        Xc3dUIXcPadCoroutine.#zoomLastDistance = currentZoomDistance;
        Xc3dUIManager.zoomCamera({factor: zoomFactor});

        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else if (Xc3dUIXcPadCoroutine.#currentMode === Xc3dUIXcPadCoroutine.#Mode.Pan) {
        const currentPosition = new XcGm2dVector({x: event0.targetTouches[0].pageX, y: event0.targetTouches[0].pageY});
        const diffVector = new XcGm2dVector({x: currentPosition.x - Xc3dUIXcPadCoroutine.#panLastPosition.x, y: currentPosition.y - Xc3dUIXcPadCoroutine.#panLastPosition.y});
        Xc3dUIXcPadCoroutine.#panLastPosition = currentPosition;
        Xc3dUIManager.panCamera({panVector: diffVector});
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      } else {
        return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
      }
    } else {
      XcSysAssert({assertion: false});
      return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
    }

    return Xc3dUIXcPadCoroutine.#CommandState.WaitForTouchInput;
  }
}
