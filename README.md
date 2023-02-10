# CAD

## Basic Development guide

* Prerequisite
  * MacOS
  * VMWare/Windows 10 (No space allowed in username.)
  * HTML 5
  * Node.js
  * NW.js
  * Chrome/Devtool
  * Tools
    * Webstorm
    * Clion
    * XCode

## Development standard and quality control

* Javascript coding styles
* Software development process
* How to report an issue

## CAD introduction

* Basic structure
  * XcMain
  * Libraries
    * Parasolid
    * XcUI
    * XcSys
    * XcGm
  * App
    * 3D CAD

### How to build application

1. Go to `XcExternal` folder and download the packages following the instructions in `README.md`.
2. Since macOS has very strict permission control policy or unzip tools may damage the file attributes, we need to right-click and open the executable files so those executables can be loaded or launched.
3. Go to `CAD/XcMain` and run `../XcExternal/node.darwin/bin/node ../XcExternal/node.darwin/bin/npm install` command to install npm packages.
4. Build
   1. Build on Mac first
     * Go to the `CAD` folder in terminal and run `./XcExternal/node.darwin/bin/node ./build_scripts/build_darwin.js`
   2. Build on Win32
     * In the VMWare, share `CAD` folder as `Z:\` in the Windows 10.
     * Go the command window application, go to `Z:\CAD` folder, and then run `.\XcExternal\node.win32\node .\build_scripts\build_win32.js`

### How to run application

1. Go to `XcDebug`
2. Use `../XcExternal/nwjs.sdk.darwin/nwjs.app/Contents/MacOS/nwjs .` on mac or to use `..\XcExternal\nwjs.sdk.win32\nw .` on Windows to launch the application.

### How to upgrade NW.js

1. Install the right version of Node required by the NW.js.
2. Install `nw-gyp` using `npm install -g nw-gyp`.
3. Update the node and nwjs files on `XcExternal` following the `README.md` in `XcExternal`. Please right-click and open all executable files (such as node/nwjc etc.) on macOS for permission control reasons.
4. Delete all node_modules folder and run `npm install` in XcMain.
