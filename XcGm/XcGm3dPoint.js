class XcGm3dPoint extends XcGm3dGeometry {
  constructor() {
    super();
  }

  get position() {
    const method = 'POINT_ask';
    const params = {
      point: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkPointSF = _XcGmPK_POINT_sf_t.fromJSON({json: pkReturnValue.point_sf});
    return pkPointSF.position.toXcGm3dPosition();
  }

  get part() {
    const method = 'POINT_ask_part';
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const part = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.part});
    return part;
  }

  get vertex() {
    const method = 'POINT_ask_vertex';
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.vertex});
    return vertex;
  }

  static _pKCreate({position}) {
    const pointSF = new _XcGmPK_POINT_sf_t({position: _XcGmPK_VECTOR_t.fromXcGm3dPosition({position})});

    const method = 'POINT_create';
    const params = {
      point_sf: pointSF.toJSON()
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.point});
    return point;
  }

  _pkCreateMinimumBody() {
    const method = 'POINT_make_minimum_body';
    const params = {
      point: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }
}
