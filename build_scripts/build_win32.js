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

  const XcDebugFolder = path.resolve(path.join(baseFolderPath, 'XcDebug'));
  const XcMainFolder = path.resolve(path.join(baseFolderPath, 'XcMain'));

  // XcSys
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcSys'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // XcUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcUI'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // XcGm
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // XcMath
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcMath'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // XcGm2
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcGm2'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // XcImage
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'XcImage'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Xc3d
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3d'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Xc3dCmd
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dCmd'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Xc3dUI
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dUI'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Xc3dDoc
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/3DCAD/Xc3dDoc'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Hello
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/Hello'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }

  // Automation
  {
    const projectFolder = path.resolve(path.join(baseFolderPath, 'Apps/Automation'));
    process.chdir(projectFolder);

    _runCommands([
      `${baseFolderPath}\\XcExternal\\node.win32\\node build.js`,
    ]);
  }
}

build({baseFolderPath: path.join(__dirname, '..')});

//Usage: node build_win32.js
