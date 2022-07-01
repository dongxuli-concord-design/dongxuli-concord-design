class XcGmAssembly extends XcGmPart {
  constructor() {
    super();
  }

  get parts() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_ask_parts', {params});

    const parts = [];
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    for (const partTag of pkReturnValue.parts) {
      const part = XcGmEntity.getObjFromTag({entityTag: partTag});
      parts.push(part);
    }
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

    const instances = [];
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    for (const instanceTag of pkReturnValue.instances) {
      const instance = XcGmEntity.getObjFromTag({entityTag: instanceTag});
      instances.push(instance);
    }
    return instances;
  }

  partsAndTransfs() {
    const params = {
      assembly: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('ASSEMBLY_ask_parts_transfs', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const parts = [];
    for (const partTag of pkReturnValue.parts) {
      const part = XcGmEntity.getObjFromTag({entityTag: partTag});
      parts.push(part);
    }

    const transfs = [];
    for (const transfTag of pkReturnValue.transfs) {
      const transf = XcGmEntity.getObjFromTag({entityTag: transfTag});
      transfs.push(transf);
    }

    return {
      parts,
      transfs,
    };
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