class XcGmSphereSurface extends XcGmSurface {
  constructor() {
    super();
  }

  get radius() {
    const params = {
      sphere: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('SPHERE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkSphereSF = _XcGmPK_SPHERE_sf_t.fromJSON({json: pkReturnValue.sphere_sf});
    return pkSphereSF.radius;
  }

  get coordinateSystem() {
    const params = {
      sphere: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('SPHERE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkSphereSF = _XcGmPK_SPHERE_sf_t.fromJSON({json: pkReturnValue.sphere_sf});
    const coordinateSystem = new XcGm3dCoordinateSystem({
      origin: pkSphereSF.basis_set.location.toXcGm3dPosition(),
      zAxisDirection: pkSphereSF.basis_set.axis.toXcGm3dVector(),
      xAxisDirection: pkSphereSF.basis_set.ref_direction.toXcGm3dVector(),
    });
    return coordinateSystem;
  }

  static _pkCreate({radius, coordinateSystem}) {
    const sphereSF = new _XcGmPK_SPHERE_sf_t({
      radius,
      basis_set: _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem}),
    });
    const params = {
      sphere_sf: sphereSF.toJSON()
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('SPHERE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sphere = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.sphere});
    return sphere;
  }
}
