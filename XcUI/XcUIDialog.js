class XcUIDialog extends HTMLDialogElement {
  #content;

  constructor({content = '', title = ''} = {}) {
    super();
    this.#content = content;

    this.innerHTML = `
        <div style="height: 50px; background-color: #c09853">${title}</div>
        <div>Content</div>
      `;

    this.titleElement = this.querySelector('div:nth-of-type(1)');
    this.contentElement = this.querySelector('div:nth-of-type(2)');

    this.titleElement.style.cursor = 'move';
    this.contentElement.innerHTML = this.#content;

    // Interested events
    this.titleElement.addEventListener('mousedown', (event) => this.processor.next(event), false);
    this.titleElement.addEventListener('mouseup', (event) => this.processor.next(event), false);
    this.titleElement.addEventListener('mousemove', (event) => this.processor.next(event), false);
    this.titleElement.addEventListener('mouseout', (event) => this.processor.next(event), false);

    // TODO: Native dialog is not mature yet.

    // Start the coroutine
    this.state = XcUIDialog.CommandState.WaitForMouseDown;
    this.processor = this.#run();
    this.processor.next();

    this.basePosition = [0, 0];
    this.startPosition = [];
  }

  static get observedAttributes() {
    return ['title'];
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(val) {
    this.setAttribute('title', val);
    if (this.titleElement) {
      this.titleElement.innerHTML = val;
    }
  }

  connectedCallback() {
    this.style.margin = '1em';
    this.style.border = '1px solid #428bca';
    this.style.borderRadius = '5px';
    this.style.padding = '1em';
  }

  disconnectedCallback() {
    // ...
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // ...
  }

  * waitForMouseDown(event) {
    if ((event instanceof MouseEvent) && (event.which === 1)) {
      // Left button down
      if (event.type === 'mousedown') {
        this.startPosition = [event.screenX, event.screenY];
        return XcUIDialog.CommandState.WaitForMouseMoveOrMouseUp;
      }
    }

    return XcUIDialog.CommandState.WaitForMouseDown;
  }

  * waitForMouseMoveOrMouseUp(event) {
    if ((event instanceof MouseEvent) && (event.which === 1)) {
      const deltaX = this.basePosition[0] + event.screenX - this.startPosition[0];
      const deltaY = this.basePosition[1] + event.screenY - this.startPosition[1];

      switch (event.type) {
        case 'mousemove':
          this.style.transform = `translate(${deltaX}px,${deltaY}px)`;
          return XcUIDialog.CommandState.WaitForMouseMoveOrMouseUp;
        case 'mouseup':
          this.basePosition[0] = deltaX;
          this.basePosition[1] = deltaY;
          return XcUIDialog.CommandState.WaitForMouseDown;
        default:
          this.basePosition[0] = deltaX;
          this.basePosition[1] = deltaY;
          return XcUIDialog.CommandState.WaitForMouseDown;
      }
    }

    return XcUIDialog.CommandState.WaitForMouseMoveOrMouseUp;
  }

  * #run() {
    while (true) {
      const event = yield;

      switch (this.state) {
        case XcUIDialog.CommandState.WaitForMouseDown:
          this.state = yield* this.waitForMouseDown(event);
          break;
        case XcUIDialog.CommandState.WaitForMouseMoveOrMouseUp:
          this.state = yield* this.waitForMouseMoveOrMouseUp(event);
          break;
        default:
          throw new Error('Internal state error');
          break;
      }
    }
  }

  setContent(content) {
    this.#content = content;
    if (this.contentElement) {
      this.contentElement.innerHTML = content;
    }
  }
}

XcUIDialog.CommandState = {
  WaitForMouseDown: Symbol('WaitForMouseDown'),
  WaitForMouseMoveOrMouseUp: Symbol('WaitForMouseMoveOrMouseUp')
};

customElements.define('xcui-dialog', XcUIDialog, {extends: 'dialog'});
  