const { execSync } = require('child_process');

function _runCommand(commandString) {
  execSync(commandString, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
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

const commonFiles = [
  'package.json',
  `config.js`,
  'XcVersion.js',
  'index.html',
  'main.js',
  '3rd',
  'node_modules',
];

function buildDarwinRelease() {
  const os = require('os');
  const platform = os.platform();
  if (platform !== 'darwin') {
    throw 'This script has to be run on Mac or Linux to use shell commands.';
  }

  // Remove old folders
  _runCommands([
    `rm -rf Concord.darwin`,
  ]);

  // Copy nw.js
  _runCommands([
    `cp -R ../XcExternal/nwjs.darwin Concord.darwin`,
  ]);

  // Rename app folders
  _runCommands([
    `mv ./Concord.darwin/nwjs.app ./Concord.darwin/Concord.app`,
  ]);

  // Create app folders
  _runCommands([
    // CAD
    `mkdir -p ./Concord.darwin/Concord.app/Contents/Resources/app.nw/Apps/3DCAD`,
  ]);

  // Copy files
  const darwinFiles = [
    'XcSys_darwin.bin',
    'XcGm_darwin.bin',
    'XcGmPk_darwin.node',
    'XcUI_darwin.bin',
    'libpskernel.dylib',
  ];

  // Common files
  for (const file of commonFiles) {
    _runCommand(`cp -R ../XcMain/${file} ./Concord.darwin/Concord.app/Contents/Resources/app.nw/`);
  }

  // Mac: Libs
  for (const file of darwinFiles) {
    _runCommand(`cp -R ../XcMain/${file} ./Concord.darwin/Concord.app/Contents/Resources/app.nw/`);
  }

  // Mac: Apps
  _runCommands([
    // Xc3d
    `cp -R ../XcMain/Apps/3DCAD/* ./Concord.darwin/Concord.app/Contents/Resources/app.nw/Apps/3DCAD/`, 
  ]);

  // Copy version file
  _runCommands([
    `cp ./version.txt ./Concord.darwin/Concord.app/Contents/Resources/app.nw/`,
  ]);
}

function buildWin32Release() {
  const os = require('os');
  const platform = os.platform();
  if (platform !== 'darwin') {
    throw 'This script has to be run on Mac or Linux to use shell commands.';
  }

  // Remove old folders
  _runCommands([
    `rm -rf Concord.win32`,
  ]);

  // Copy nw.js
  _runCommands([
    `cp -R ../XcExternal/nwjs.win32 Concord.win32`,
  ]);

  // Rename app folders
  _runCommands([
    `mv ./Concord.win32/nw.exe ./Concord.win32/Concord.exe`,
  ]);

  // Create app folders
  _runCommands([
    // 3DCAD
    `mkdir -p ./Concord.win32/Apps/3DCAD`,
  ]);

  // Copy files
  const win32Files = [
    'XcSys_win32.bin',
    'XcGm_win32.bin',
    'XcGmPk_win32.node',
    'XcUI_win32.bin',
    'pskernel.dll',
  ];

  // Common files
  for (const file of commonFiles) {
    _runCommand(`cp -R ../XcMain/${file} ./Concord.win32/`);
  }

  // Win: Libs
  for (const file of win32Files) {
    _runCommand(`cp -R ../XcMain/${file} ./Concord.win32/`);
  }

  // Win: Apps
  _runCommands([
    // 3DCAD
    `cp -R ../XcMain/Apps/3DCAD/* ./Concord.win32/Apps/3DCAD/`,
  ]);

  // Copy version file
  _runCommands([
    `cp ./version.txt ./Concord.win32/`,
  ]);
}

buildDarwinRelease();
buildWin32Release();
