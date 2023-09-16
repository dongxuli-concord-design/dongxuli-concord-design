const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  '_XcGmPkTokens.js',
  '_XcGmPkParams.js',

  'XcGmAssert.js',

  'XcGmPrecision.js',
  'XcGmContext.js',
  'XcGmEulerAngles.js',
  'XcGmQuaternion.js',

  'XcGm2dPosition.js',
  'XcGm2dVector.js',
  'XcGm2dMatrix.js',
  'XcGm2dAxis.js',
  'XcGm2dCoordinateSystem.js',
  'XcGm2dBox.js',

  'XcGmEntity.js',
  'XcGmGeometry.js',
  'XcGm2dGeometry.js',
  'XcGm3dGeometry.js',
  'XcGmTopology.js',

  'XcGm2dPoint.js',
  'XcGm2dCurve.js',
  'XcGm2dLine.js',
  'XcGm2dLineSegment.js',
  'XcGm2dPolygon.js',
  'XcGm2dCircularArc.js',
  'XcGm2dCircle.js',
  'XcGm2dNurbsCurve.js',
  'XcGm2dRay.js',
  'XcGm2dEllipticArc.js',
  'XcGm2dEllipse.js',
  'XcGm2dOffsetCurve.js',

  'XcGm3dPosition.js',
  'XcGm3dVector.js',
  'XcGm3dMatrix.js',
  'XcGm3dAxis.js',
  'XcGm3dCoordinateSystem.js',
  'XcGmInterval.js',
  'XcGmUV.js',
  'XcGmUVBox.js',
  'XcGm3dBox.js',
  'XcGmPkRequest.js',

  '_XcGmTransf.js',
  'XcGmPart.js',
  'XcGmBody.js',
  'XcGmRegion.js',
  'XcGmFin.js',
  'XcGmShell.js',
  'XcGmLoop.js',
  'XcGmFace.js',
  'XcGmEdge.js',
  'XcGmVertex.js',

  'XcGm3dPoint.js',
  'XcGmSurface.js',
  'XcGmPlanarSurface.js',
  'XcGmTorusSurface.js',
  'XcGmSpunSurface.js',
  'XcGmSphereSurface.js',
  'XcGmConeSurface.js',
  'XcGmRuledSurface.js',
  'XcGmResolvedSurface.js',
  'XcGmOffsetSurface.js',
  'XcGmCylinderSurface.js',
  'XcGmSweptSurface.js',
  'XcGmBlendSurface.js',
  'XcGmNurbsSurface.js',
  'XcGm3dCurve.js',
  'XcGm3dNurbsCurve.js',
  'XcGm3dLine.js',
  'XcGm3dLineSegment.js',
  'XcGm3dCircle.js',
  'XcGm3dCircularArc.js',
  'XcGm3dEllipse.js',
  'XcGm3dEllipticArc.js',
  'XcGm3dRay.js',
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
