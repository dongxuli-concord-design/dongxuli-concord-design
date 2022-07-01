class Xc3dCmdAppStore {
  static #CommandState = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel'),
    WaitForInput: Symbol('WaitForInput')
  };

  static #Event = {
    Done: Symbol('Done'),
    Cancel: Symbol('Cancel')
  };

  i18n;
  #dialog;
  #uiContext;

  constructor(dialog) {
    this.#dialog = dialog;

    this.#initI18n();

    const widgets = [];

    const cancelButton = document.createElement('input');
    cancelButton.type = 'button';
    cancelButton.value = this.i18n.T`Cancel`;
    cancelButton.addEventListener('click', (event) => {
      XcSysManager.dispatchEvent({event: Xc3dCmdAppStore.#Event.Cancel});
    });
    widgets.push(cancelButton);

    this.#uiContext = new XcSysContext({
      prompt: this.i18n.T`AppStore Demo`,
      showCanvasElement: true,
      standardWidgets: widgets,
      standardDialog: this.#dialog
    });

    this.state = Xc3dCmdAppStore.#CommandState.WaitForInput;
  }

  #initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'AppStore Demo': '应用商店演示',
    };

    if (XcSysConfig.locale === 'zh') {
      this.i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      this.i18n = new XcSysI18n();
    }
  }

  * onWaitForInput() {
    const event = yield* XcSysManager.waitForEvent({
      uiContext: this.#uiContext,
      expectedEventTypes: [Xc3dCmdAppStore.#Event.Cancel, Xc3dCmdAppStore.#Event.Done],
    });
    if (event === Xc3dCmdAppStore.#Event.Cancel) {
      return Xc3dCmdAppStore.#CommandState.Cancel;
    } else if (event === Xc3dCmdAppStore.#Event.Done) {
      return Xc3dCmdAppStore.#CommandState.Done;
    } else {
      return Xc3dCmdAppStore.#CommandState.WaitForInput;
    }
  }

  static *command() {
    const dialogContent =
      `
  <div class="container">
  <div class="row row-offcanvas row-offcanvas-right">
      <div class="col-xs-12 col-sm-9">
          <div>
              <h1>Design AppStore Demo</h1>
              <p>App Store is a digital distribution platform for design apps on our CAD platform.</p>
          </div>
          <div class="row">
              <div class="col-xs-6 col-lg-4">
                  <h2>Gesture!</h2>
                  <p>Pan, orbit, and zoom the view using your hands!</p>
                  <p><img src="/Apps/Xc3dCmd/res/Xc3dCmdGesture.jpg" alt="App Image" style="width:177px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
              <div class="col-xs-6 col-lg-4">
                  <h2>Chanel Bottle</h2>
                  <p>Create a Vintage Chanel bottle - Citron version! One of the most classic bottles!</p>
                  <p><img src="/Apps/Xc3dCmd/res/Xc3dCmdBottle.jpg" alt="App Image" style="width:98px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
              <div class="col-xs-6 col-lg-4">
                  <h2>Ergonomic Chair</h2>
                  <p>It can eliminate contact stress under the thighs.  </p>
                  <p><img src="/Apps/Xc3dCmd/res/Chair.jpg" alt="App Image" style="width:123px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
              <div class="col-xs-6 col-lg-4">
                  <h2>Gearbox</h2>
                  <p>Increase torque while reducing speed.  </p>
                  <p><img src="/Apps/Xc3dCmd/res/gearbox.jpg" alt="App Image" style="width:130px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
              <div class="col-xs-6 col-lg-4">
                  <h2>Car Door</h2>
                  <p>Car door - Plastic Injection Mould  </p>
                  <p><img src="/Apps/Xc3dCmd/res/cardoor.jpg" alt="App Image" style="width:130px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
              <div class="col-xs-6 col-lg-4">
                  <h2>Kitchen Sink</h2>
                  <p>Great granite sinks with natural texture. </p>
                  <p><img src="/Apps/Xc3dCmd/res/sink.jpg" alt="App Image" style="width:130px;height:100px"> </p>
                  <p><a class="btn btn-default" href="#" role="button">Get App »</a></p>
              </div><!--/.col-xs-6.col-lg-4-->
          </div><!--/row-->
      </div><!--/.col-xs-12.col-sm-9-->
      <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar">
          <div class="list-group">
              <a href="#" class="list-group-item active">Featured</a>
              <a href="#" class="list-group-item">Top Charts</a>
              <a href="#" class="list-group-item">Categories</a>
              <a href="#" class="list-group-item">Purchases</a>
              <a href="#" class="list-group-item">Updates</a>
              <a href="#" class="list-group-item">Redeem</a>
          </div>
      </div><!--/.sidebar-offcanvas-->
  </div><!--/row-->
  <hr>
  </div>
    `;
  
    const appStoreDiv = document.createElement('div');
    appStoreDiv.innerHTML = dialogContent;
    appStoreDiv.addEventListener('close', function (event) {
      console.log('close.....');
      XcSysManager.dispatchEvent({event: Xc3dCmdAppStore.#Event.Cancel});
    });
  
    const dialogGetter = new Xc3dCmdAppStore(appStoreDiv);
  
    while ((dialogGetter.state !== Xc3dCmdAppStore.#CommandState.Done) &&
    (dialogGetter.state !== Xc3dCmdAppStore.#CommandState.Cancel)) {
      switch (dialogGetter.state) {
        case Xc3dCmdAppStore.#CommandState.WaitForInput:
          dialogGetter.state = yield* dialogGetter.onWaitForInput();
          break;
        default:
          XcSysAssert({assertion: false, message: dialogGetter.i18n.T`Internal command state error`});
          break;
      }
    }
  }
}

