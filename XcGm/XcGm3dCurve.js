class XcGm3dCurve extends XcGmGeometry {
  constructor() {
    super();
  }

  static makeWireBodyFromCurves({curves, bounds}) {
    const params = {
      curves: [],
      bounds: []
    };

    for (const curve of curves) {
      params.curves.push(curve.tag);
    }

    for (const bound of bounds) {
      const pkBound = XcGmPK_INTERVAL_t.fromXcGmInterval({interval: bound});
      params.bounds.push(pkBound.toJSON());
    }

    const {error, pkReturnValue} = XcGmCallPkApi('CURVE_make_wire_body_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const wire = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    const newEdges = [];
    for (const newEdgeInfo of pkReturnValue.new_edges) {
      const edgeTag = newEdgeInfo.edge;
      const edgeObj = XcGmEntity.getObjFromTag({entityTag: edgeTag});
      const edgeIndex = newEdgeInfo.edge_index;
      newEdges.push({
        edge: edgeObj,
        edgeIndex: edgeIndex
      });
    }

    return {wire, newEdges};
  }
}
