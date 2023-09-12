class Xc3dCmdManager {
  static #i18n;

  static initI18n() {
    const messageBundle_zh = {
      'Internal command state error': '内部命令状态错误',
      'Ok': '确定',
      'Cancel': '取消',
      'Next': '下一步',
      'Quit': '退出',

      'Cannot open the file: Incompatible file format or corrupted file.': '无法打开文件：文件不兼容或者被损坏。',
      'Command name': '命令名',
      'Open an existing file ...': '打开一个已有文件',
      'Create a new file ...': '创建一个新文件',
      'Ready': '就绪',
      '3D Modeling': '3D建模',
      "Let's design!": '现在开始设计！',

      'Boolean': '布尔运算',
      'Combine': '合并',
      'Cut': '切除',
      'Sew': '缝合面',
      'Delete face': '删除面',
      'PushPull': '推拉面',
      'Imprint': '投影实体',
      'Extrude': '拉伸',
      'Fillet': '倒圆角',
      'Hollow': '抽壳',
      'Line': '直线',
      'Spline': '样条曲线',
      'Merge wires': '合并线对象',
      'Move': '移动',
      'Point': '点',
      'Reference position': '参考点',
      'Press/pull planar face': '推拉平面',
      'View': '视图',
      'Revolve': '生成旋转体',
      'Sweep': '扫描',
      'Loft': '放样',
      'Rotate': '旋转物体',
      'Coordinate system': '设置坐标系',
      'AppStore': '应用商店',
      'Export STL': '导出STL',
      'Block': '方块',
      'Cone': '圆锥',
      'Cylinder': '圆柱',
      'Prism': '棱柱',
      'Sphere': '圆球',
      'Torus': '圆环',
      'Programmable modeling': '可编程建模',
      'Code': '编程',
      'Delete': '删除',
      'Copy': '复制',
      'Property': '属性',
      'Redo': '重做',
      'Undo': '撤销',
      'Save': '保存',
      'Sheet from wires': '从线框生成面体',
      'Insert': '插入外部文件',
      'Import': '导入XT文件',
      'Export XT': '导出XT',
      'Measure': '测量',
    };

    if (XcSysConfig.locale === 'zh') {
      Xc3dCmdManager.#i18n = new XcSysI18n({messageBundle: messageBundle_zh});
    } else {
      Xc3dCmdManager.#i18n = new XcSysI18n();
    }
  }

  static get defaultCommands() {
    return [
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`View`,
        entry: Xc3dCmdView.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Save`,
        entry: Xc3dCmdSave.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Undo`,
        entry: Xc3dCmdUndo.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Redo`,
        entry: Xc3dCmdRedo.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Measure`,
        entry: Xc3dCmdMeasure.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Coordinate system`,
        entry: Xc3dCmdSetupUCS.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Property`,
        entry: Xc3dCmdProperty.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Delete`,
        entry: Xc3dCmdDelete.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Copy`,
        entry: Xc3dCmdCopy.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Move`,
        entry: Xc3dCmdMove.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Rotate`,
        entry: Xc3dCmdRotate.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Reference position`,
        entry: Xc3dCmdReferencePosition.command,
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Block`,
        entry: Xc3dCmdBlock.command,
        icon: 'Apps/3DCAD/res/icons/block.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Cone`,
        entry: Xc3dCmdCone.command,
        icon: 'Apps/3DCAD/res/icons/cone.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Cylinder`,
        entry: Xc3dCmdCylinder.command,
        icon: 'Apps/3DCAD/res/icons/cylinder.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Prism`,
        entry: Xc3dCmdPrism.command,
        icon: 'Apps/3DCAD/res/icons/prism.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Sphere`,
        entry: Xc3dCmdSphere.command,
        icon: 'Apps/3DCAD/res/icons/sphere.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Torus`,
        entry: Xc3dCmdTorus.command,
        icon: 'Apps/3DCAD/res/icons/torus.png'
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Point`,
        entry: Xc3dCmdPoint.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Line`,
        entry: Xc3dCmdLine.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Spline`,
        entry: Xc3dCmdSpline.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Merge wires`,
        entry: Xc3dCmdMergeWires.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Sheet from wires`,
        entry: Xc3dCmdSheetFromWires.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Extrude`,
        entry: Xc3dCmdExtrude.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Revolve`,
        entry: Xc3dCmdRevolve.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Sweep`,
        entry: Xc3dCmdSweep.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Loft`,
        entry: Xc3dCmdLoft.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Hollow`,
        entry: Xc3dCmdHollow.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Fillet`,
        entry: Xc3dCmdFillet.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Delete face`,
        entry: Xc3dCmdDeleteFace.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`PushPull`,
        entry: Xc3dCmdPressPullPlanarFace.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Imprint`,
        entry: Xc3dCmdImprintCurve.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Boolean`,
        entry: Xc3dCmdBoolean.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Combine`,
        entry: Xc3dCmdCombine.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Cut`,
        entry: Xc3dCmdCut.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Sew`,
        entry: Xc3dCmdSew.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Export STL`,
        entry: Xc3dCmdExportSTL.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Insert`,
        entry: Xc3dCmdInsert.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Import`,
        entry: Xc3dCmdImportXT.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`AppStore`,
        entry: Xc3dCmdAppStore.command
      }),
      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Export XT`,
        entry: Xc3dCmdExportXT.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Programmable modeling`,
        entry: Xc3dCmdProgrammableModel.command
      }),

      new Xc3dUICommand({
        name: Xc3dCmdManager.#i18n.T`Code`,
        entry: Xc3dCmdCode.command
      }),
    ];
  }

  static init() {
    Xc3dCmdManager.initI18n();
    if (Xc3dAppConfig.debug) {
      Xc3dApp.commands.push(...Xc3dCmdManager.defaultCommands);
    } else {
      // Do nothing
    }
  }
}
