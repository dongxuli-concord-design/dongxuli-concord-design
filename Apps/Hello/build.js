const fs = require('fs');

// Build single JS file
const scripts = [
  'HelloApp.js',
];

const moduleName = 'HelloApp';
const buildSourceName = `${moduleName}.js`;
const os = require('os');
const platform = os.platform();
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
const {exec} = require('child_process');

if (platform === 'darwin') {
  exec(`../../XcExternal/nwjs.sdk.${platform}/nwjc ./build/${buildSourceName} ./build/${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
} else if (platform === 'win32') {
  exec(`..\\..\\XcExternal\\nwjs.sdk.${platform}\\nwjc .\\build\\${buildSourceName} .\\build\\${buildTargetName}`, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
} else {
  throw 'Unsupported platform.';
}
