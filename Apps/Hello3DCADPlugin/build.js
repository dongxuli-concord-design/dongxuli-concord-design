const fs = require('fs');

const scripts = [
  'Hello.js',
];

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
    dest: './build/Hello.js'
  }
});
