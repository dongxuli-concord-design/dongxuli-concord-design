class XcServerManager {
  static run() {
    process.setMaxListeners(0);
    process
      .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
      })
      .on('uncaughtException', error => {
        console.error(error, 'Uncaught Exception thrown', error);
      });

    console.log('Use "export XCSERVER_SSL=true" to enable SSL.');
    const useSSL = (process.env.XCSERVER_SSL === 'true');

    const httpPortNumber = 80;
    const httpsPortNumber = 443;

    const httpApp = XcServerHttpApp.createExpressApp();

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
      console.log(`Listening on http/${httpPortNumber}.`);

      httpServer = require('http').createServer(httpApp);

      httpServer.listen(httpPortNumber);
    }

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
