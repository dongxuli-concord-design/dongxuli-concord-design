class _XcGmTransf extends XcGmEntity {
  constructor() {
    super();
  }

  get matrix() {
    const params = {
      transf: this._pkTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('TRANSF_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkTransSF = _XcGmPK_TRANSF_sf_t.fromJSON({json: pkReturnValue.transf_sf});
    return pkTransSF.matrix;
  }

  static create({transfSF}) {
    const params = {
      transf_sf: transfSF.toJSON()
    };
    const {error, pkReturnValue} = XcGmCallPkApi('TRANSF_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const transf = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.transf});
    return transf;
  }
}
