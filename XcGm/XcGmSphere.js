class XcGmSphere extends XcGmSurface {
  constructor() {
    super();
  }

  get radius() {
    const params = {
      sphere: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('SPHERE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkSphereSF = XcGmPK_SPHERE_sf_t.fromJSON({json: pkReturnValue.sphere_sf});
    return pkSphereSF.radius;
  }

  get coordinateSystem() {
    const params = {
      sphere: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('SPHERE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkSphereSF = XcGmPK_SPHERE_sf_t.fromJSON({json: pkReturnValue.sphere_sf});
    const coordinateSystem = new XcGmCoordinateSystem({
      origin: pkSphereSF.basis_set.location.toXcGm3dPosition(),
      zAxisDirection: pkSphereSF.basis_set.axis.toXcGm3dVector(),
      xAxisDirection: pkSphereSF.basis_set.ref_direction.toXcGm3dVector(),
    });
    return coordinateSystem;
  }

  static create({radius, coordinateSystem}) {
    const sphereSF = new XcGmPK_SPHERE_sf_t({
      radius,
      basis_set: XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem}),
    });
    const params = {
      sphere_sf: sphereSF.toJSON()
    };

    const {error, pkReturnValue} = XcGmCallPkApi('SPHERE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sphere = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.sphere});
    return sphere;
  }
}
