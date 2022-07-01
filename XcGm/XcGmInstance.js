class XcGmInstance extends XcGmTopology {
  constructor() {
    super();
  }

  get assembly() {
    const params = {
      instance: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkInstanceSF = XcGmPK_INSTANCE_sf_t.fromJSON({json: pkReturnValue.instance_sf});
    return pkInstanceSF.assembly;
  }

  get transform() {
    const params = {
      instance: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkInstanceSF = XcGmPK_INSTANCE_sf_t.fromJSON({json: pkReturnValue.instance_sf});

    return pkInstanceSF.transf.matrix;
  }

  get part() {
    const params = {
      instance: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkInstanceSF = XcGmPK_INSTANCE_sf_t.fromJSON({json: pkReturnValue.instance_sf});
    return pkInstanceSF.part;
  }

  static create({assembly, part, matrix = null}) {
    const transf = null;

    if (matrix) {
      const transfSF = XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix});
      transf = XcGmTransf.create({transfSF});
    }

    const instanceSF = new XcGmPK_INSTANCE_sf_t({assembly, transf, part});
    const params = {
      instance_sf: instanceSF.toJSON()
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const instance = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.instance});
    return instance;
  };

  changePart({part}) {
    const params = {
      instance: this.tag,
      part: part.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_change_part', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  replaceTransf({transf}) {
    const params = {
      instance: this.tag,
      transf: transf.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_replace_transf', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  transform({matrix}) {
    const transfSF = XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix});
    const transf = XcGmTransf.create({transfSF});

    const params = {
      instance: this.tag,
      transf: transf.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('INSTANCE_transform', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }
}
