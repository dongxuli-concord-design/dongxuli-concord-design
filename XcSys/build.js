const {execSync} = require('child_process');
const os = require('os');
const platform = os.platform();

// Build single JS file
const scripts = [
  'XcSysAssert.js',
  'XcSysI18n.js',
  'XcSysConfig.js',
  'XcSysApp.js',
  'XcSysUIContext.js',
  'XcSysMainCoroutine.js',
  'XcSysManager.js',
  'server.js',
  'XcSysBootloader.js',
];

const moduleName = 'XcSys';
const buildSourceName = `${moduleName}.js`;
const buildTargetName = `${moduleName}_${platform}.bin`;

function concat(opts) {
  const _fs = require('fs');
  const FILE_ENCODING = 'utf-8';
  const EOL = '\n';

  const fileList = opts.src;
  const distPath = opts.dest;
  const out = fileList.map(function (filePath) {
    return _fs.readFileSync(filePath, FILE_ENCODING);
  });

  _fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
}

concat({
  src: scripts,
  dest: `./build/${buildSourceName}`
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
