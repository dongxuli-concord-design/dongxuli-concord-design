class XcSysContext {
  constructor({
                prompt = null,
                showCanvasElement = false,
                standardWidgets = null,
                standardDialog = null,
                customDiv = null,
                cursor = 'auto'
              } = {}) {
    this.prompt = prompt;
    this.showCanvasElement = showCanvasElement;
    this.standardWidgets = standardWidgets;
    this.standardDialog = standardDialog;
    this.customDiv = customDiv;
    this.cursor = cursor;
  }
}
