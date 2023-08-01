class Xc3dUICameraController {
  static #i18n = null;

  static #setupLocale() {
    const messageBundle_zh = {
      'Home': '初始',
      'Ortho': '对正',
      'Pan': '平移',
      'Orbit': '旋转',
      'Toggle grid': '网格开关',
    };

    if (XcSysConfig.locale === 'zh') {
      Xc3dUICameraController.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      Xc3dUICameraController.#i18n = new XcSysI18n();
    }
  }

  static run() {
    Xc3dUICameraController.#setupLocale();
    Xc3dUICameraController.cameraDiv = document.createElement(`div`);

    // https://www.w3.org/Style/Examples/007/center.en.html
    Xc3dUICameraController.cameraDiv.style.cssText = 'position: absolute; left: 50%; bottom: 0px; overflow: hidden; margin-right: -50%; margin-bottom: 1em; transform: translateX(-50%); user-select: none; user-drag: none; ';

    const homeStr = Xc3dUICameraController.#i18n.T`Home`;
    const orthoStr = Xc3dUICameraController.#i18n.T`Ortho`;
    const panStr = Xc3dUICameraController.#i18n.T`Pan`;
    const orbitStr = Xc3dUICameraController.#i18n.T`Orbit`;
    const toggleStr = Xc3dUICameraController.#i18n.T`Toggle grid`;

    Xc3dUICameraController.cameraDiv.innerHTML =
      `
      <!-- Camera -->
   <button class="btn btn-outline-primary" style="display:inline-block; margin:auto; vertical-align: middle;" tabIndex="-1">${homeStr}ⓡ</button>
   <button class="btn btn-outline-primary" style="display:inline-block; margin:auto; vertical-align: middle;" tabIndex="-1">
   ${orthoStr}ⓕ</button>
   <div style="display:inline-block; vertical-align: middle;">
      <button class="btn btn-outline-primary" style="margin:auto; display:block;" tabIndex="-1">➕ⓧ</button>
      <button class="btn btn-outline-primary" style="margin:auto; display:block;" tabIndex="-1">🔲ⓔ</button>   
      <button class="btn btn-outline-primary" style="margin:auto; display:block;" tabIndex="-1">➖ⓩ</button>   
   </div>
   <button class="btn btn-outline-primary" style="display:inline-block;" tabIndex="-1">◀ⓐ</button>    
   <div style="display:inline-block; vertical-align: middle;">
      <button class="btn btn-outline-primary" style="display:block;margin:auto;" tabIndex="-1">▲ⓦ</button>     
      <label class="text-primary" style="display:block; vertical-align: middle; margin:auto;text-align:center;" tabIndex="-1">${orbitStr}</label>          
      <button class="btn btn-outline-primary" style="display:block;margin:auto; " tabIndex="-1">▼ⓢ</button>    
   </div>
   <button class="btn btn-outline-primary" style="display:inline-block;" tabIndex="-1">▶ⓓ</button>       
   <button class="btn btn-outline-primary" style="display:inline-block;" tabIndex="-1">◀</button>    
   <div style="display:inline-block; vertical-align: middle;">
      <button class="btn btn-outline-primary" style="display:block;margin:auto; " tabIndex="-1">▲</button>      
      <label class="text-primary" style="display:block; vertical-align: middle; margin:auto;text-align:center;" tabIndex="-1">${panStr}</label>          
      <button class="btn btn-outline-primary" style="display:block;margin:auto; " tabIndex="-1">▼</button>      
   </div>
   <button class="btn btn-outline-primary" style="display:inline-block;" tabIndex="-1">▶</button>       
   <button class="btn btn-outline-primary" style="display:inline-block;" tabIndex="-1">${toggleStr}</button>       
      `;

    // Camera events
    document.body.addEventListener('keydown', function (event) {
      if ((event.target instanceof HTMLInputElement)
        || (event.target instanceof HTMLTextAreaElement)
        || (event.target.getAttribute("contenteditable") === "true")) {
        return;
      }

      switch (event.code) {
        case `KeyR`:
          Xc3dUIManager.resetCamera();
          break;
        case `KeyF`:
          Xc3dUIManager.orthogonalizeCamera();
          break;
        case `KeyW`:
          Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: 0, y: -Xc3dUICameraController.computeCameraChangeDelta()})});
          break;
        case `KeyS`:
          Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: 0, y: Xc3dUICameraController.computeCameraChangeDelta()})});
          break;
        case `KeyD`:
          Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
          break;
        case `KeyA`:
          Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: -Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
          break;
        case `ArrowUp`:
          Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: 0, y: -Xc3dUICameraController.computeCameraChangeDelta()})});
          break;
        case `ArrowDown`:
          Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: 0, y: Xc3dUICameraController.computeCameraChangeDelta()})});
          break;
        case `ArrowRight`:
          Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
          break;
        case `ArrowLeft`:
          Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: -Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
          break;
        case `KeyZ`:
          Xc3dUIManager.zoomCamera({factor: 1.2});
          break;
        case `KeyX`:
          Xc3dUIManager.zoomCamera({factor: 0.8});
          break;
        case `KeyE`:
          Xc3dUIManager.zoomExtent();
          break;
        default:
          break;
      }
    });

    // Home
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(1)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.resetCamera();
    });

    // Ortho
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(2)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.orthogonalizeCamera();
    });

    // Zoom-in
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(3) > button:nth-child(1)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.zoomCamera({factor: 0.8});
    });

    // Zoom-extent
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(3) > button:nth-child(2)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.zoomExtent();
    });

    // Zoom-out
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(3) > button:nth-child(3)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.zoomCamera({factor: 1.2});
    });

    // Orbit-left
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(4)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: -Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
    });

    // Orbit-up
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(5) > button:nth-child(1)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: 0, y: -Xc3dUICameraController.computeCameraChangeDelta()})});
    });

    // Orbit-down
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(5) > button:nth-child(3)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: 0, y: Xc3dUICameraController.computeCameraChangeDelta()})});
    });

    // Orbit-right
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(6)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.orbitCamera({orbitVector: new XcGm2dVector({x: Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
    });

    // Pan-left
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(7)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: -Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
    });

    // Pan-up
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(8) > button:nth-child(1)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: 0, y: -Xc3dUICameraController.computeCameraChangeDelta()})});
    });

    // Pan-down
    Xc3dUICameraController.cameraDiv.querySelector(`div > div:nth-child(8) > button:nth-child(3)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: 0, y: Xc3dUICameraController.computeCameraChangeDelta()})});
    });

    // Pan-right
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(9)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.panCamera({panVector: new XcGm2dVector({x: Xc3dUICameraController.computeCameraChangeDelta(), y: 0})});
    });

    // Toggle grid
    Xc3dUICameraController.cameraDiv.querySelector(`div > button:nth-child(10)`).addEventListener(`click`, function (event) {
      Xc3dUIManager.toggleUCSGrid();
      Xc3dUIManager.redraw();
    });

    XcSysManager.canvasDiv.append(Xc3dUICameraController.cameraDiv);
  }

  static computeCameraChangeDelta() {
    return Math.ceil(XcSysManager.canvasDiv.clientHeight * 0.01);
  }
}
