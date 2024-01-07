class XcGmSurface extends XcGm3dGeometry {
  constructor() {
    super();
  }
  _pkEvaluate({uv}) {
    const pkUV = _XcGmPK_UV_t.fromXcGmUV({uv});

    const method = 'SURF_eval';
    const params = {
      surf: this._pkTag,
      uv: pkUV.toJSON(),
      //TODO: The following arguments are fixed!
      n_u_derivs: 0,
      n_v_derivs: 0,
      triangular: false
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkVector = _XcGmPK_VECTOR_t.fromJSON({json: pkReturnValue.position});
    const position = pkVector.toXcGm3dPosition();
    return position;
  }
}
