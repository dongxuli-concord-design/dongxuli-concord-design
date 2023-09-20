class XcGm3dPoint extends XcGm3dGeometry {
  constructor() {
    super();
  }

  get position() {
    const params = {
      point: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('POINT_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkPointSF = _XcGmPK_POINT_sf_t.fromJSON({json: pkReturnValue.point_sf});
    return pkPointSF.position.toXcGm3dPosition();
  }

  get part() {
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('POINT_ask_part', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const part = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.part});
    return part;
  }

  get vertex() {
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('POINT_ask_vertex', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.vertex});
    return vertex;
  }

  static _pKCreate({position}) {
    const pointSF = new _XcGmPK_POINT_sf_t({position: _XcGmPK_VECTOR_t.fromXcGm3dPosition({position})});
    const params = {
      point_sf: pointSF.toJSON()
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('POINT_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.point});
    return point;
  }

  _pkCreateMinimumBody() {
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('POINT_make_minimum_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }
}
