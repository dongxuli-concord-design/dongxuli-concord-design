class XcGm3dCurve extends XcGm3dGeometry {
  constructor() {
    super();
  }

  clone() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  contains({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  translate({vector}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  rotate({position, angle}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  scale({position, factor}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  mirror({line}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  transform({matrix}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  toJSON() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  static fromJSON({json}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get hasStartPosition() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get hasEndPosition() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isClosed() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isDegenerated() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isLinear() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  get isPeriodic() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeBox() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computePosition({t}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeTangent({t}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeClosestPositionToPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeClosestPositionToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDistanceToPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDistanceToCurve({curve}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeNormalPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeDegeneratedGeometry() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeLength({startParam, endParam}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeParamAtLength({length}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  computeParamAtPosition({position}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  reverseParam() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  setInterval({interval}) {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  _evalWithTangentPk({t, nDerivs}) {
    const params = {
      curve: this._pkTag,
      t,
      n_derivs: nDerivs,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('CURVE_eval_with_tangent', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const pointAndDerivatives = pkReturnValue.pointAndDerivatives.map(p => {
      const pkVector = _XcGmPK_VECTOR_t.fromJSON({json: p});
      return pkVector.toXcGm3dPosition();
    });
    
    const pkVector = _XcGmPK_VECTOR_t.fromJSON({json: pkReturnValue.tangent});
    const tangent = pkVector.toXcGm3dVector();

    return {pointAndDerivatives, tangent};
  }

  static makeWireBodyFromCurves({curveAndIntervals}) {
    const params = {
      curves: curveAndIntervals.map(curveAndInterval => curveAndInterval.curve._pkTag),
      bounds: curveAndIntervals.map(curveAndInterval => _XcGmPK_INTERVAL_t.fromXcGmInterval({interval: curveAndInterval.interval}).toJSON()),
    };

    const {error, pkReturnValue} = XcGmCallPkApi('CURVE_make_wire_body_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const wire = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    const newEdges = pkReturnValue.new_edges.map(newEdgeInfo => {
      const edgeTag = newEdgeInfo.edge;
      const edgeObj = XcGmEntity._getPkObjectFromPkTag({entityTag: edgeTag});
      const edgeIndex = newEdgeInfo.edge_index;

      return {
        edge: edgeObj,
        edgeIndex: edgeIndex
      };
    });

    return {wire, newEdges};
  }
}
