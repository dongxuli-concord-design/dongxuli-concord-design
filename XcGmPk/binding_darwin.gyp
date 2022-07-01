{
  "targets": [
    {
      "target_name": "XcGmPk_darwin",
      "sources": [ 
        "json.h", 
        "jsoncpp.cpp", 
        "util.h",
        "util.cpp",        
        "base64.h", 
        "base64.cpp",
        "frustrum.h",
        "frustrum.cpp",
        "pksession.h",
        "pksession.cpp",
        "go.h",
        "go.cpp",
        "param.h",
        "param.cpp",
        "api.h",
        "api.cpp",
        "init.cpp"],
        "cflags": [ "-std=c++11" ],
        "libraries": [ "<(module_root_dir)/darwin/libpskernel.dylib" ],
        'conditions': [
        ],

        "conditions": [
        [
          "OS==\"mac\"", {
            "xcode_settings": {
              "OTHER_CFLAGS": [
                "-mmacosx-version-min=10.7",
                "-stdlib=libc++"
              ],
              "GCC_ENABLE_CPP_RTTI": "YES",
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            }
          }
        ]
      ]
          
    }
  ]
}
