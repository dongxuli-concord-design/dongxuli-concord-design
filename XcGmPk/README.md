# Prepare

* Make sure the Parasolid is X64
* Make compiler is good
    * Mac: Xcode
    * Linux: Nothing to do.
    * Windows: 
      * Install Windows 10 English version on VMWare.
      * Install VS2015 package. Remember to use custom instllation so to install ALL Visual C++ and SDK components.
      * Install Python 2.7 is installed and set to the system path for python exe.

# JSONCpp

* https://github.com/open-source-parsers/jsoncpp/wiki/Amalgamated

Now we embedded it as source code.

# Use nw-gyp

# Mac

* Copy Parasolid/mac to XcGmPk
* Rename `binding_darwin.gyp` to `binding.gyp`
* Use nw-gyp to build (sometimes xcode commandline needs to be updated if there are any errors!!!)
  `nw-gyp rebuild --target={nw_version} --arch=x64 -debug`
* Copy the built binary file to the `XcMain` and test.
* Debug (If the Build/debug folder is available and binary is built with debug flag.)
    * (We can attach a nw.js (render) process. We can attach process using CLion or XCode.
    * We can use node command line and debug the node process instead of using nw.js.

# Linux

* Use nw-gyp

# Windows

* Create a working folder `C:\tmp`.
* Copy `XcExternal\node.win32`, `XcExternal\nwjs.sdk.win32`, `XcExternal\nwjs.win32` and `XcGmPk` to `C:\tmp`.
* Open the command window, add `XcExternal\node.win32` to the system path.
* In the command window, go to `XcExternal\node.win32` and install nw-gyp using `npm install -g nw-gyp`.
* Rename `binding_win32.gyp` in `XcGmPk` to `binding.gyp`
* In the command window, go to `c:\tmp\XcGmPk`, build the C++ add-on using `nw-gyp rebuild --target={nw_version} --arch=x64`. Note: We cannot build debug version on Windows due to the bugs in NW.js.

# Code structure
* util.h/.cpp: Some utility functions.
* json.h/.cpp: JSON library.
* pksession.h/.cpp: Parasolid session related code.
* go.h/.cpp: Parasolid Graphics Output (GO) related code.
* frustrum.h/.cpp: Parasolid frustrum related code.
* init.cpp: Entry of the node module.
* param.h/.cpp: Parasolid function parameters related code.
* api.h/.cpp: Parasolid function api wrappers.
