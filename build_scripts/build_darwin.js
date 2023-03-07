//Usage: node build_darwin.js

const {execSync} = require('child_process');
const path = require('path');

function _runCommand(commandString) {
  execSync(commandString, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
}

function _runCommands(commandStringArray) {
  for (const commandString of commandStringArray) {
    _runCommand(commandString);
  }
}

function build({baseFolderPath}) {
  if (!path.isAbsolute(baseFolderPath)) {
    throw 'base folder must be a absolute path';
  }

  process.chdir(baseFolderPath);

  // Create folders for debugging and apps
  _runCommands([
    `mkdir -p ${baseFolderPath}/XcDebug`,
    `mkdir -p ${baseFolderPath}/XcMain/Apps`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcSys`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcUI`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcMath`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcGm`,

    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcGm2`,

    `mkdir -p ${baseFolderPath}/XcMain/Documentation/XcImage`,

    `mkdir -p ${baseFolderPath}/XcMain/Documentation/Apps/3DCAD/Xc3d`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/Apps/3DCAD/Xc3dCmd`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/Apps/3DCAD/Xc3dDoc`,
    `mkdir -p ${baseFolderPath}/XcMain/Documentation/Apps/3DCAD/Xc3dUI`,

    `mkdir -p ${baseFolderPath}/XcMain/Documentation/Apps/Automation`,

    `cp -rf ${baseFolderPath}/XcMain/* ${baseFolderPath}/XcDebug/`
  ]);

  const XcDebugFolder = path.resolve(path.join(baseFolderPath, 'XcDebug'));
  const XcMainFolder = path.resolve(path.join(baseFolderPath, 'XcMain'));

  // XcSys
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcSys'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcSys && cp -r Documentation/* ../XcMain/Documentation/XcSys`,
    ]);
  }

  // XcUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcUI'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcUI && cp -r Documentation/* ../XcMain/Documentation/XcUI`,
    ]);
  }

  // XcMath
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcMath'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcMath && cp -r Documentation/* ../XcMain/Documentation/XcMath`,
    ]);
  }

  // XcGm
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcGm && cp -r Documentation/* ../XcMain/Documentation/XcGm`,
    ]);
  }

  // XcGm2
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm2'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcGm2 && cp -r Documentation/* ../XcMain/Documentation/XcGm2`,
    ]);
  }

  // XcImage
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcImage'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/ && cp -r Documentation/* ../XcDebug/Documentation/XcImage && cp -r Documentation/* ../XcMain/Documentation/XcImage`,
    ]);
  }

  // Xc3d
  _runCommands([
    `mkdir -p ${baseFolderPath}/XcMain/Apps/3DCAD/Plugins`,
    `mkdir -p ${baseFolderPath}/XcDebug/Apps/3DCAD/Plugins`,
  ]);

  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3d'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD && cp -r Documentation/* ../../..//XcDebug/Documentation/Apps/3DCAD/Xc3d && cp -r Documentation/* ../../..//XcMain/Documentation/Apps/3DCAD/Xc3d`,
    ]);
  }

  // Xc3dCmd
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dCmd'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD && cp -r Documentation/* ../../..//XcDebug/Documentation/Apps/3DCAD/Xc3dCmd && cp -r Documentation/* ../../..//XcMain/Documentation/Apps/3DCAD/Xc3dCmd`,
    ]);
  }

  // Xc3dUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dUI'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD && cp -r Documentation/* ../../..//XcDebug/Documentation/Apps/3DCAD/Xc3dUI && cp -r Documentation/* ../../..//XcMain/Documentation/Apps/3DCAD/Xc3dUI`,
    ]);
  }

  // Xc3dDoc
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dDoc'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r Documentation/* ../../..//XcDebug/Documentation/Apps/3DCAD/Xc3dDoc && cp -r Documentation/* ../../..//XcMain/Documentation/Apps/3DCAD/Xc3dDoc`,
    ]);
  }

  // Hello
  {
    _runCommands([
      `rm -rf ${baseFolderPath}/XcMain/Apps/Hello &&  mkdir ${baseFolderPath}/XcMain/Apps/Hello`,
      `rm -rf ${baseFolderPath}/XcDebug/Apps/Hello && mkdir ${baseFolderPath}/XcDebug/Apps/Hello`,
    ]);

    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/Hello'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../XcDebug/Apps/Hello && cp -r res ../../XcDebug/Apps/Hello  && cp build/*.bin ../../XcMain/Apps/Hello && cp -r res ../../XcMain/Apps/Hello`,
    ]);
  }

  // Automation
  {
    _runCommands([
      `mkdir -p ${baseFolderPath}/XcMain/Apps/3DCAD/Plugins/Automation`,
      `mkdir -p ${baseFolderPath}/XcDebug/Apps/3DCAD/Plugins/Automation`,
    ]);

    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/Automation'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js  && cp build/*.bin  ../../XcMain/Apps/3DCAD/Plugins/Automation/ && cp build/*  ../../XcDebug/Apps/3DCAD/Plugins/Automation/ && cp -r Documentation/* ../..//XcDebug/Documentation/Apps/Automation && cp -r Documentation/* ../..//XcMain/Documentation/Apps/Automation`,
    ]);
  }
}

build({baseFolderPath: path.join(__dirname, '..')});
