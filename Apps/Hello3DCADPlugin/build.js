var scripts = [
  'Hello.js',
];

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
  dest: './build/Hello.js'
});
