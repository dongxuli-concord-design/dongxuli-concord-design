class XcGmSurface extends XcGmGeometry {
  constructor() {
    super();
  }

  evaluate({uv}) {
    const pkUV = XcGmPK_UV_t.fromXcGmUV({uv})
    const params = {
      surf: this.tag,
      uv: pkUV.toJSON(),
      //TODO: The following arguments are fixed!
      n_u_derivs: 0,
      n_v_derivs: 0,
      triangular: false
    };

    const {error, pkReturnValue} = XcGmCallPkApi('SURF_eval', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkVector = XcGmPK_VECTOR_t.fromJSON({json: pkReturnValue.position});
    const position = pkVector.toXcGm3dPosition();
    return position;
  }
}
