class XcGmPlanarSurface extends XcGmSurface {
  constructor() {
    super();
  }

  get coordinateSystem() {
    const params = {
      plane: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('PLANE_ask', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkPlaneSF = _XcGmPK_PLANE_sf_t.fromJSON({json: pkReturnValue.plane_sf});
    const coordinateSystem = new XcGm3dCoordinateSystem({
      origin: pkPlaneSF.basis_set.location.toXcGm3dPosition(),
      zAxisDirection: pkPlaneSF.basis_set.axis.toXcGm3dVector(),
      xAxisDirection: pkPlaneSF.basis_set.ref_direction.toXcGm3dVector(),
    });

    return coordinateSystem;
  }

  static create({coordinateSystem}) {
    const planeSF = _XcGmPK_PLANE_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    const params = {
      plane_sf: planeSF.toJSON()
    };
    const {error, pkReturnValue} = XcGmCallPkApi('PLANE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const plane = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.plane});
    return plane;
  }
}
