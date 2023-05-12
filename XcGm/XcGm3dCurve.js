class XcGm3dCurve extends XcGmGeometry {
  constructor() {
    super();
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
