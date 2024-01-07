class XcGm3dLine extends XcGm3dCurve {
  constructor() {
    super();
  }

  get axis() {
    const method = 'LINE_ask';
    const params = {
      line: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkLineSF = _XcGmPK_LINE_sf_t.fromJSON({json: pkReturnValue.line_sf});
    const axis = new XcGm3dAxis({
      position: pkLineSF.basis_set.location.toXcGm3dPosition(),
      direction: pkLineSF.basis_set.axis.toXcGm3dVector(),
    });
    return axis;
  }

  static _pkCreate({axis}) {
    const lineSF = _XcGmPK_LINE_sf_t.fromXcGm3dAxis({axis});

    const method = 'LINE_create';
    const params = {
      line_sf: lineSF.toJSON()
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const line = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.line});
    return line;
  }
}