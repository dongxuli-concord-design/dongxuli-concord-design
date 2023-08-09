class Xc3dUII18n {
  static i18n = null;

  static init() {
    const messageBundle_zh = {
      // All
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',
      'Done': '完成',
      'Invalid input.': '无效输入',

      // XcUICamera.js
      'Home': '初始',
      'Ortho': '对正',
      'Pan': '平移',
      'Orbit': '旋转',
      'Toggle grid': '网格开关',

      // Xc3dUIGetAngle.js
      'Angle': '角度',
      'Measure': '测量',
      'Specify the center position of the angle': '指定角度旋转中心',
      'Specify the first position of the angle': '指定角度起始点',
      'Specify the second position of the angle': '指定角度终点',

      // XcUIGetAxis.js
      'Specify the first position of the axis': '输入轴的起点',
      'Specify the second position of the axis': '输入轴的终点',

      // Xc3dUIGetDirection.js
      'Specify the first position of the direction': '输入方向的起点',
      'Specify the second position of the direction': '输入方向的终点',
      'Specify a planar face': '指定一个平面',
      'Reverse the direction?': '要反转方向吗？',

      // Xc3dUIGetDistance.js
      'Distance': '距离',
      'Get distance from measurement.': '通过测量获取距离',
      'Start position of distance': '距离的起点',
      'End position of distance': '距离的终点',

      // Xc3dUIGetDrawableObject.js
      'This object type is not supported.': '不支持该类型的实体',

      // Xc3dUIGetFaceEdgeVertex.js
      'Pick': '拾取',
      'Face': '面',
      'Edge': '边',
      'Vertex': '顶点',

      // Xc3dUIGetInteger.js
      'Position coordinate': '位置坐标',

      // Xc3dUIGetPosition.js
      'Origin': '原点',
      'Object center': '物体中心',
      'Please select an object': '请选择一个物体',
      'There is no base point specified. Please input absolute coordinates.': '没有指定基点。请输入绝对坐标。',
      'Base position expected for relative coordinates': '相对坐标需要提供基点',
      'Input Coordinate': '输入坐标',
      'Input Coordinate Object': '输入代码对象',

      // Xc3dUIGetTransform.js
      'Click a position to start': '点击一个位置开始',
      'Move to': '移动至',
      'Please drag': '请拖动',
      'Translation along X': '沿X轴移动',
      'Translation along Y': '沿Y轴移动',
      'Translation along Z': '沿Z轴移动',
      'Rotation around X': '绕X轴旋转角度',
      'Rotation around Y': '绕Y轴旋转角度',
      'Rotation around Z': '绕Z轴旋转角度',
      'Scale factor': '缩放比例',
      'Please specify target position': '请指定目标位置',
      'Please setup the transform': '请设置变换',

      // XcUIGetCommand.js
      'Command name': '命令名',

      // Xc3dUIGetObject.js
      'Input': '输入',


      // Xc3dUIGetFile.js
      'No file specified': '未指定文件',

      // XcUIInitCmd.js
      'Please select an app': '请选择一个应用',
      'Do not forget to logout if you have finished your tasks.': '任务完成后，别忘了退出登录',
      'Startup app': '启动应用',

      // XcSysManager.js
      'One grid': '一格',
      'Unit:': '单位：',
    };

    if (XcSysConfig.locale === 'zh') {
      Xc3dUII18n.i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      Xc3dUII18n.i18n = new XcSysI18n();
    }
  }
}
