class XcGm3dNurbsCurve extends XcGm3dCurve {
  constructor() {
    super();
  }

  static _pkCreate({pkBcurveSf}) {
    const params = {
      bcurve_sf: pkBcurveSf.toJSON()
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BCURVE_create', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const curve = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.bcurve});
    return curve;
  }

  static _pkCreateBspline({positions}) {
    const pkVectors = positions.map(position => new _XcGmPK_VECTOR_t({coord: position.toArray()}));
    const params = {
      n_positions: pkVectors.length,
      positions: pkVectors,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BCURVE_create_spline_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const curves = pkReturnValue.bcurves.map(curveTag => XcGmEntity._getPkObjectFromPkTag({entityTag: curveTag}));
    return curves;
  }
}
