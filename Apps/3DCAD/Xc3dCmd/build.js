const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();
const fs = require('fs');

// Build single JS file
const scripts = [
  'Xc3dCmdManager.js',

  'Xc3dCmdReferencePosition.js',
  'Xc3dCmdPoint.js',
  'Xc3dCmdLine.js',
  'Xc3dCmdInsertSTL.js',
  'Xc3dCmdExportSTL.js',
  'Xc3dCmdBlock.js',
  'Xc3dCmdCone.js',
  'Xc3dCmdCylinder.js',
  'Xc3dCmdPrism.js',
  'Xc3dCmdSphere.js',
  'Xc3dCmdTorus.js',
  'Xc3dCmdSpline.js',
  'Xc3dCmdProgrammableModel.js',
  'Xc3dCmdCode.js',

  'Xc3dCmdSheetFromWires.js',
  'Xc3dCmdMergeWires.js',
  'Xc3dCmdView.js',
  'Xc3dCmdExtrude.js',
  'Xc3dCmdRevolve.js',
  'Xc3dCmdSweep.js',
  'Xc3dCmdLoft.js',
  'Xc3dCmdHollow.js',
  'Xc3dCmdFillet.js',
  'Xc3dCmdDeleteFace.js',
  'Xc3dCmdImprintCurve.js',
  'Xc3dCmdPressPullPlanarFace.js',
  'Xc3dCmdSew.js',
  'Xc3dCmdBoolean.js',
  'Xc3dCmdCombine.js',
  'Xc3dCmdCut.js',
  'Xc3dCmdSave.js',
  'Xc3dCmdInsert.js',
  'Xc3dCmdRotate.js',
  'Xc3dCmdDelete.js',
  'Xc3dCmdMove.js',
  'Xc3dCmdCopy.js',
  'Xc3dCmdUndo.js',
  'Xc3dCmdRedo.js',
  'Xc3dCmdSetupUCS.js',
  'Xc3dCmdAppStore.js',
  'Xc3dCmdMeasure.js',
  'Xc3dCmdProperty.js',

  'Xc3dCmdGmsh.js',
];

const moduleName = 'Xc3dCmd';
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
