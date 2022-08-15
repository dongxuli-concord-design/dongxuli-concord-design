const {execSync} = require('child_process');

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
  const path = require('path');
  if (!path.isAbsolute(baseFolderPath)) {
    throw 'base folder must be a absolute path';
  }

  console.info('Current base folder is: ', baseFolderPath);

  process.chdir(baseFolderPath);

  // Create folders for debugging and apps
  _runCommands([
    `mkdir -p ${baseFolderPath}/XcDebug`,
    `mkdir -p ${baseFolderPath}/XcMain/Apps`,
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
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
    ]);
  }

  // XcUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcUI'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
    ]);
  }

  // XcMath
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcMath'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
    ]);
  }

  // XcGm
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
    ]);
  }

  // XcGm2
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm2'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
    ]);
  }

  // XcImage
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcImage'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../XcDebug/ && cp build/*.bin ../XcMain/`,
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
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD`,
    ]);
  }

  // Xc3dCmd
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dCmd'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD`,
    ]);
  }

  // Xc3dUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dUI'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp -r res ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD && cp -r res ../../../XcMain/Apps/3DCAD`,
    ]);
  }

  // Xc3dDoc
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dDoc'));
    process.chdir(projectFolder);

    _runCommands([
      `rm -rf build && mkdir build`,
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js && cp build/* ../../../XcDebug/Apps/3DCAD && cp build/*.bin ../../../XcMain/Apps/3DCAD`,
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
      `${baseFolderPath}/XcExternal/node.darwin/bin/node build.js  && cp build/*  ../../XcMain/Apps/3DCAD/Plugins/Automation/ && cp build/*  ../../XcDebug/Apps/3DCAD/Plugins/Automation/`,
    ]);
  }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node build_darwin.js <baseFolder>');
  throw 'base folder must be provided.';
}

build({baseFolderPath: args[0]});

//Usage: node build_darwin.js <baseFolder>
