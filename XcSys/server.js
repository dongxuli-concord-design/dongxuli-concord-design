(function () {
  let http = require('http');
  let url = require('url');
  const WebSocket = require('ws');

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// https://developer.mozilla.org/en-US/docs/Web/API/Touch
// https://www.html5rocks.com/en/mobile/touch/
// https://stackoverflow.com/questions/7056026/variation-of-e-touches-e-targettouches-and-e-changedtouches
  let pageString = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>XcPad</title>
</head>
<body onresize="resizeCanvas()">
<canvas id="canvas" width=1600 height=1200 style="border:solid black 1px;">
    Your browser does not support canvas element.
</canvas>
</body>


<script>
  // Create WebSocket connection.
  const socket = new WebSocket('ws://'+window.location.hostname+':8081');

  // Connection opened
  socket.addEventListener('open', function (event) {
  });

  socket.addEventListener('error', function (event) {
    document.body.innerHTML = 'Cannot connect the server.';
  });
    
  function createJSONObjFromEvent(evt) {
    let jsonObj = {};
    
    jsonObj.type = evt.type;
    jsonObj.which = evt.which;
    
    jsonObj.changedTouches = [];
    for (let touch of evt.changedTouches) {
      jsonObj.changedTouches.push({
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force,
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        screenX: touch.screenX,
        screenY: touch.screenY,
      });
    }
    
    jsonObj.targetTouches = [];
    for (let touch of evt.targetTouches) {
      jsonObj.targetTouches.push({
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force,
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        screenX: touch.screenX,
        screenY: touch.screenY,
      });
    }

    jsonObj.touches = [];
    for (let touch of evt.touches) {
      jsonObj.touches.push({
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force,
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        screenX: touch.screenX,
        screenY: touch.screenY,
      });
    }

    return jsonObj;
  }
  
  function startup() {
    resizeCanvas();
    let canvas = document.getElementsByTagName("canvas")[0];

    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
  }

  function resizeCanvas() {
    let canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
  function handleStart(evt) {
    evt.preventDefault();
    socket.send(JSON.stringify(createJSONObjFromEvent(evt)));
  }

  function handleMove(evt) {
    evt.preventDefault();
    socket.send(JSON.stringify(createJSONObjFromEvent(evt)));
  }

  function handleEnd(evt) {
    evt.preventDefault();
    socket.send(JSON.stringify(createJSONObjFromEvent(evt)));
  }

  function handleCancel(evt) {
    evt.preventDefault();
    socket.send(JSON.stringify(createJSONObjFromEvent(evt)));
  }

  document.addEventListener("DOMContentLoaded", function() {
    startup();
  });

</script>

</html>

`;

  const wss = new WebSocket.Server({port: 8081});

// Broadcast to all.
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      wss.broadcast(message);
    });
  });

  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(pageString);
  }).listen(9090);
})();
