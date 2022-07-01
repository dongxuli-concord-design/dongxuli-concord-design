class XcGm3dPoint extends XcGmGeometry {
  constructor() {
    super();
  }

  get position() {
    const params = {
      point: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('POINT_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkPointSF = XcGmPK_POINT_sf_t.fromJSON({json: pkReturnValue.point_sf});
    return pkPointSF.position.toXcGm3dPosition();
  }

  get part() {
    const params = {
      point: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('POINT_ask_part', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const part = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.part});
    return part;
  }

  get vertex() {
    const params = {
      point: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('POINT_ask_vertex', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.vertex});
    return vertex;
  }

  static create({position}) {
    const pointSF = new XcGmPK_POINT_sf_t({position: XcGmPK_VECTOR_t.fromXcGm3dPosition({position})});
    const params = {
      point_sf: pointSF.toJSON()
    };
    const {error, pkReturnValue} = XcGmCallPkApi('POINT_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.point});
    return point;
  }

  createMinimumBody() {
    const params = {
      point: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('POINT_make_minimum_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return body;
  }
}
