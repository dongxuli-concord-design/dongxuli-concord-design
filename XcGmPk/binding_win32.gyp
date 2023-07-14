{
  "targets": [
    {
      "target_name": "XcGmPk_win32",
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
        "libraries": [ "<(module_root_dir)/win32/pskernel.lib" ],
        'conditions': [
        ],

        'configurations': {
            'Debug': {
                'msvs_settings': {
                  'VCLinkerTool': {
                  },
                  'VCCLCompilerTool': {
                    'RuntimeLibrary': '1',
                    "ExceptionHandling": "2",
                  },
                },
            },
            'Release': {
                'msvs_settings': {
                  'VCLinkerTool': {
                  },
                  'VCCLCompilerTool': {
                    'RuntimeLibrary': '0',
                    "ExceptionHandling": "2",
                  },
                },
            },
        },     
    }
  ]
}
