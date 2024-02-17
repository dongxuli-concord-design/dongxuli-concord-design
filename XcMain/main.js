const os = require('os');
const fs = require('fs');
const win = nw.Window.get();

function ___xc_load_lib(lib) {
  if (fs.existsSync(`${lib}.js`)) {
    let script = document.createElement('script');
    script.setAttribute('src', `${lib}.js`);
    script.setAttribute('async', false);
    document.head.appendChild(script);
  } else {
    win.evalNWBin(null, `${lib}_${os.platform()}.bin`);
  }  
}

___xc_load_lib('XcUI');
___xc_load_lib('XcGm');
___xc_load_lib('XcSys');
