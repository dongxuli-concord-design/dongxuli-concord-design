class XcGm3dCircle extends XcGm3dCurve {
  constructor() {
    super();
  }

  get radius() {
    const params = {
      circle: this._pkTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('CIRCLE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkCircleSF = _XcGmPK_CIRCLE_sf_t.fromJSON({json: pkReturnValue.circle_sf});
    return pkCircleSF.radius;
  }

  get coordinateSystem() {
    const params = {
      circle: this._pkTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('CIRCLE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkCircleSF = _XcGmPK_CIRCLE_sf_t.fromJSON({json: pkReturnValue.circle_sf});
    const coordinateSystem = new XcGm3dCoordinateSystem({
      origin: pkCircleSF.basis_set.location.toXcGm3dPosition(),
      zAxisDirection: pkCircleSF.basis_set.toXcGm3dVector(),
      xAxisDirection: pkCircleSF.basis_set.ref_direction.toXcGm3dVector(),
    });

    return coordinateSystem;
  }

  static create({radius, coordinateSystem}) {
    const circleSF = new _XcGmPK_CIRCLE_sf_t({
      radius,
      basis_set: _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem})
    });
    const params = {
      radius: radius,
      circle_sf: circleSF.toJSON()
    };
    const {error, pkReturnValue} = XcGmCallPkApi('CIRCLE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const circle = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.circle});
    return circle;
  }
}
