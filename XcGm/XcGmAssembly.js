class XcGmAssembly extends XcGmPart {
  constructor() {
    super();
  }

  get parts() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_ask_parts', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const parts = pkReturnValue.parts.map(partTag => XcGmEntity.getObjFromTag({entityTag: partTag}));

    return parts;
  }

  static create() {
    const params = {};

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_create_empty', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const assembly = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.assembly});
    return assembly;
  }

  instances() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_ask_instances', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const instances = pkReturnValue.instances.map(instanceTag => XcGmEntity.getObjFromTag({entityTag: instanceTag}));
    return instances;
  }

  partsAndTransfs() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_ask_parts_transfs', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const parts = pkReturnValue.parts.map(partTag => XcGmEntity.getObjFromTag({entityTag: partTag}));
    const transfs = pkReturnValue.transfs.map(transfTag => XcGmEntity.getObjFromTag({entityTag: transfTag}));

    return {parts, transfs};
  }

  transform({matrix}) {
    const transfSF = XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix});
    const transf = XcGmTransf.create({transfSF});

    const params = {
      assembly: this.tag,
      transf: transf.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_transform', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  makeLevelAssembly() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_make_level_assembly', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const assembly = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.level_assembly});
    return assembly;
  }
}