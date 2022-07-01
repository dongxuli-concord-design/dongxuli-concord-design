class XcServerHttpApp {
  static createExpressApp() {
    const express = require('express');
    const bodyParser = require('body-parser');

    const expressApp = express();

    expressApp.use(express.json());
    expressApp.use(express.urlencoded({extended: false}));
    // initialize body-parser to parse incoming parameters requests to req.body
    expressApp.use(bodyParser.urlencoded({extended: true}));

    // error handler
    expressApp.use(function (error, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = error.message;
      res.locals.error = req.app.get('env') === 'development' ? error : {};

      // render the error page
      res.status(error.status || 500);
      res.render('error');
    });

    expressApp.get('/', function (req, res) {
      res.status(200).json('');
    });

    expressApp.post('/api', function (req, res) {
      try {
        req.setTimeout(0); // no timeout

        XcServerHttpRPCServer.processRequest(req, res);
      } catch (error) {
        res.status(200).json({error: error});
      }
    });

    return expressApp;
  }
}
