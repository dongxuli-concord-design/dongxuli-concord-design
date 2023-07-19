class XcGm3dCurve extends XcGmGeometry {
  constructor() {
    super();
  }

  evalWithTangent({t, nDerivs}) {
    const params = {
      curve: this.tag,
      t,
      n_derivs: nDerivs,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('CURVE_eval_with_tangent', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const pointAndDerivatives = pkReturnValue.pointAndDerivatives.map(p => {
      const pkVector = XcGmPK_VECTOR_t.fromJSON({json: p});
      return pkVector.toXcGm3dPosition();
    });
    
    const pkVector = XcGmPK_VECTOR_t.fromJSON({json: pkReturnValue.tangent});
    const tangent = pkVector.toXcGm3dVector();

    return {pointAndDerivatives, tangent};
  }

  static makeWireBodyFromCurves({curves, bounds}) {
    const params = {
      curves: curves.map(curve => curve.tag),
      bounds: bounds.map(bound => XcGmPK_INTERVAL_t.fromXcGmInterval({interval: bound}).toJSON()),
    };

    const {error, pkReturnValue} = XcGmCallPkApi('CURVE_make_wire_body_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const wire = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    const newEdges = pkReturnValue.new_edges.map(newEdgeInfo => {
      const edgeTag = newEdgeInfo.edge;
      const edgeObj = XcGmEntity.getObjFromTag({entityTag: edgeTag});
      const edgeIndex = newEdgeInfo.edge_index;

      return {
        edge: edgeObj,
        edgeIndex: edgeIndex
      };
    });

    return {wire, newEdges};
  }
}
