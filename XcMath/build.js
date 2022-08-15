const {execSync} = require('child_process');
let os = require('os');
let platform = os.platform();

// Build single JS file
let scripts = [
  'XcMathTest.js',
];

let moduleName = 'XcMath';
let buildSourceName = `${moduleName}.js`;
let buildTargetName = `${moduleName}_${platform}.bin`;

function concat(opts) {
  let _fs = require('fs');
  let FILE_ENCODING = 'utf-8';
  let EOL = '\n';

  let fileList = opts.src;
  let distPath = opts.dest;
  let out = fileList.map(function (filePath) {
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
