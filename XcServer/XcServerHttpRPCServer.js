class XcServerHttpRPCServer {
  static #apps = new Map();

  static registerApp({appName, processor}) {
    if (XcServerHttpRPCServer.#apps.has(appName)) {
      return false;
    }

    XcServerHttpRPCServer.#apps.set(appName, processor);
  }

  static processRequest(req, res) {
    try {
      const {appName, methodName, params} = req.body;
      if (!appName) {
        return {error: `Cannot process request: ${appName} is not valid.`};
      }
      if (!methodName) {
        return {error: `Cannot process request: ${methodName} is not valid.`};
      }
      if (!XcServerHttpRPCServer.#apps.has(appName)) {
        return {error: `Cannot process request: ${appName} is not registered.`};
      }

      const processorClassType = XcServerHttpRPCServer.#apps.get(appName);
      const newProcessor = new processorClassType({res, methodName, params});
      const newProcessorCoroutine = newProcessor.run();
      newProcessorCoroutine.next();
    } catch (error) {
      res.status(200).json({error: error});
    }
  }
}
