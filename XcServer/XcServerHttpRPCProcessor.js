class XcServerHttpRPCProcessor {
  constructor({res, methodName, params}) {
    this.res = res;
    this.methodName = methodName;
    this.params = params;
    this.coroutine = this.run();
  }

  * run () {
    try {

    } catch (error) {
      this.res.status(200).json({error: error});
    }
  }

  * sleep(delay) {
    const timerId = uuidv4();

    setTimeout (()=> {
      this.dispatchEvent(timerId);
    }, delay);

    while (true) {
      const event = yield;
      if (event === timerId) {
        break;
      }
    }
  }

  dispatchEvent(event) {
    setTimeout(()=>{
      this.coroutine.next(event);
    }, 0);
  }
}
