const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  'Xc3dDocDocument.js',
  'Xc3dDocTexture.js',
  'Xc3dDocDrawableObject.js',
  'Xc3dDocModel.js',
  'Xc3dDocExternalDocument.js',
  'Xc3dDocConstruction.js',
  'Xc3dDocAnnotation.js',
  'Xc3dDocLinearDimension.js',
  'Xc3dDocSTLModel.js',
  'Xc3dDocOperationDelta.js',
  'Xc3dDocReferencePoint.js',
];

const moduleName = 'Xc3dDoc';
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
