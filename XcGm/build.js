const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  'XcGmAssert.js',
  'XcGmPrecision.js',
  'XcGmContext.js',

  'XcGm2dPosition.js',
  'XcGm2dVector.js',
  'XcGm2dMatrix.js',
  'XcGm2dAxis.js',

  'XcGmEulerAngles.js',

  'XcGm3dPosition.js',
  'XcGm3dVector.js',
  'XcGm3dMatrix.js',
  'XcGm3dAxis.js',
  'XcGmCoordinateSystem.js',
  'XcGmInterval.js',
  'XcGmUV.js',
  'XcGmUVBox.js',
  'XcGm3dBox.js',
  'XcGmPkRequest.js',
  'XcGmEntity.js',

  'XcGmPkTokens.js',
  'XcGmPkParams.js',

  'XcGmTransf.js',
  'XcGmTopology.js',
  'XcGmPart.js',
  'XcGmBody.js',
  'XcGmAssembly.js',
  'XcGmInstance.js',
  'XcGmLoop.js',
  'XcGmFace.js',
  'XcGmEdge.js',
  'XcGmVertex.js',
  'XcGmGeometry.js',
  'XcGm3dPoint.js',
  'XcGmSurface.js',
  'XcGmPlane.js',
  'XcGmTorus.js',
  'XcGmSpun.js',
  'XcGmSphere.js',
  'XcGmCone.js',
  'XcGmOffset.js',
  'XcGmCylinder.js',
  'XcGmSwept.js',
  'XcGmBlendSurface.js',
  'XcGmBSurface.js',
  'XcGm3dCurve.js',
  'XcGm3dBCurve.js',
  'XcGm3dLine.js',
  'XcGm3dCircle.js',
  'XcGm3dEllipse.js',
  'XcGmQuaternion.js'
];

const moduleName = 'XcGm';
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
