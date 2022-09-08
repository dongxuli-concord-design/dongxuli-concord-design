class XcServerManager {
  static run({userSSL, portNumber}) {
    process.setMaxListeners(0);

    // TODO
    const httpsServer = null;
    const httpServer = null;

    if (useSSL) {
      const fs = require('fs');
      const options = {
        key: fs.readFileSync(__dirname + '/concord.design.key', 'utf8'),
        cert: fs.readFileSync(__dirname + '/concord.design.ssl.cert', 'utf8'),
        ca: fs.readFileSync(__dirname + '/concord.design.ssl.ca', 'utf8')
      };

      console.log(`Listening https/${httpsPortNumber} and http/${httpPortNumber}.`);

      httpsServer = require('https').createServer(options, httpApp);

      httpsServer.listen(httpsPortNumber);

      // Redirect from http port http 80 to https 403
      const httpServer = require('http').createServer(function (req, res) {
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end()
      });
      httpServer.listen(httpPortNumber);
    } else {

      httpServer = require('http').createServer(httpApp);

      httpServer.listen(httpPortNumber);
    }

    console.log(`Listening on ${portNumber}.`);

    // WebSocket task server
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ server: httpServer });
    console.log(`Listening on Websocket/${httpPortNumber}`);

    const processor = XcServerWebSocketTaskServer.run();
    processor.next();
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        processor.next({ws, message});
      });
    });

    // Http RPC processors
    XcServerHttpRPCServer.registerApp({appName: 'user', processor: XcServerUserRPCProcessor});
    XcServerHttpRPCServer.registerApp({appName: 'mis', processor: XcServerMISRPCProcessor});
  }
}

XcServerManager.run();
