const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  'XcGsAssert.js',
  'XcGsPrecision.js',
  'XcGsContext.js',
  'XcGsColor.js',
  'XcGs3dPosition.js',
  'XcGs3dVector.js',
  'XcGs3dMatrix.js',
  'XcGsQuaternion.js',
  'XcGsRaycaster.js',
  'XcGsMeshTexture.js',
  'XcGsMeshMaterial.js',
  'XcGsScene.js',
  'XcGs3dObject.js',
  'XcGs3dGroup.js',
  'XcGs3dLine.js',
  'XcGs3dMesh.js',
  'XcGs3dPoints.js',
  'XcGs3dSprite.js',
  'XcGsLight.js',
  'XcGsAmbientLight.js',
  'XcGsCamera.js',
  'XcGsOrthographicCamera.js',
  'XcGsPerspectiveCamera.js',
  'XcGsRender.js'
];

const moduleName = 'XcGs';
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
  execSync(`../XcExternal/nwjs.sdk.${platform}/nwjc ./build/${buildSourceName} ./build/${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
  });
} else if (platform === 'win32') {
  execSync(`..\\XcExternal\\nwjs.sdk.${platform}\\nwjc .\\build\\${buildSourceName} .\\build\\${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
  });
} else {
  throw 'Unsupported platform.';
}
