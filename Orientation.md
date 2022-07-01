# Orientation

## Basic Development orientation

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
2. Go to `CAD/XcMain` and run `../XcExternal/node.darwin/bin/node ../XcExternal/node.darwin/bin/npm install` command to install npm packages.
4. Build
   1. Build on Mac first 
     * Go to `CAD` folder and use `pwd` command to get the `{CAD_folder_full_path}`
     * Go to the `CAD` folder in terminal and run `./XcExternal/node.darwin/bin/node ./build_scripts/build_darwin.js {CAD_folder_full_path}`
   2. Build on Win32
     * In the VMWare, share `CAD` folder as `Z:\` in the Windows 10.
     * Go the command window application, go to `Z:\CAD` folder, and then run `.\XcExternal\node.win32\node .\build_scripts\build_win32.js Z:\CAD`

### How to run application

1. Go to `XcDebug`
2. Use `../XcExternal/nwjs.sdk.darwin/nwjs.app/Contents/MacOS/nwjs .` on mac or to use `..\XcExternal\nwjs.sdk.win32\nw .` on Windows to launch the application.

### How to create an app

Steps to create a new app

1. Create a new folder in `Apps` following the template of `Hello`.
2. Modify the code.
3. Copy the compiled binary code or source code, including any resource files, to `XcMain`.
4. Modify the `config.js` in the XcMain to load the app.
5. Check `Hello App` for an example.

Steps to create a new plugin of 3DCAD app

1. Create a new folder in `Apps` following the template of `Hello3DCADPlugin`.
2. Modify the code.
3. Copy the compiled binary code or source code, including any resource files, to `Apps/3DCAD/Plugins/`.
4. Modify the `config.js` in the `Apps/3DCAD/res/` to load the plugin.
