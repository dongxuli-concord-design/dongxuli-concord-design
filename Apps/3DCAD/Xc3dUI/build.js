const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  'Xc3dUIConfig.js',
  'Xc3dUII18n.js',
  'Xc3dUICameraController.js',
  'Xc3dUIXcPadCoroutine.js',
  'Xc3dUIInputState.js',
  'Xc3dUIParser.js',
  'Xc3dUICommand.js',
  'Xc3dUIManager.js',
  'Xc3dUIPositionSnapper.js',
  'Xc3dUIGetDrawableObject.js',
  'Xc3dUIGetFaceEdgeVertex.js',
  'Xc3dUIGetString.js',
  'Xc3dUIGetPosition.js',
  'Xc3dUIGetScreenPosition.js',
  'Xc3dUIGetInteger.js',
  'Xc3dUIGetFloat.js',
  'Xc3dUIGetDialog.js',
  'Xc3dUIGetAngle.js',
  'Xc3dUIGetDistance.js',
  'Xc3dUIGetTransform.js',
  'Xc3dUIGetDirection.js',
  'Xc3dUIGetAxis.js',
  'Xc3dUIGetChoice.js',
  'Xc3dUIGetCommand.js',
  'Xc3dUIGetObject.js',
  'Xc3dUIGetFile.js',

  'Xc3dUIAnimation.js',
];

const moduleName = 'Xc3dUI';
const buildSourceName = `${moduleName}.js`;
const buildTargetName = `${moduleName}_${platform}.bin`;

function concat({opts}) {
  const FILE_ENCODING = 'utf-8';
  const EOL = '\n';

  const fileList = opts.src;
  const distPath = opts.dest;
  const out = fileList.map(function (filePath) {
    return fs.readFileSync(filePath, FILE_ENCODING);
  });

  fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
}

concat({
  opts: {
    src: scripts,
    dest: `./build/${buildSourceName}`
  }
});

// Build binary file
if (platform === 'darwin') {
  execSync(`../../../XcExternal/nwjs.sdk.${platform}/nwjc ./build/${buildSourceName} ./build/${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
  });
} else if (platform === 'win32') {
  execSync(`..\\..\\..\\XcExternal\\nwjs.sdk.${platform}\\nwjc .\\build\\${buildSourceName} .\\build\\${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
  });
} else {
  throw 'Unsupported platform.';
}
