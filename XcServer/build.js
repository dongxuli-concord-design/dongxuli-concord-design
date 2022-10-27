const fs = require('fs');

// Build single JS file
const scripts = [
  'XcServerLibs.js',
  'XcServerDatabase.js',
  'XcServerHttpRPCServer.js',
  'XcServerHttpRPCProcessor.js',
  'XcServerUserRPCProcessor.js',
  'XcServerMISRPCProcessor.js',
  'XcServerHttpApp.js',
  'XcServerWebSocketTaskServer.js',
  'XcServerManager.js',
  'XcServerDebug.js',
];

function concat(opts) {
  const FILE_ENCODING = 'utf-8';
  const EOL = '\n';

  const fileList = opts.src;
  const distPath = opts.dest;
  const out = fileList.map(function(filePath){
    return fs.readFileSync(filePath, FILE_ENCODING);
  });

  fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
  console.log(distPath +' built.');
}

concat({
  src : scripts,
  dest : 'XcServer.js'
});
