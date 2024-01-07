class XcGmTopology extends XcGmEntity {
  constructor() {
    super();
  }

  clone() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  _pkComputeBox() {
    const method = 'TOPOL_find_box';
    const params = {
      topol: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkBox = _XcGmPK_BOX_t.fromJSON({json: pkReturnValue.uvbox});
    const box = pkBox.toXcGm3dBox();
    return box;
  }

  static _pkComputeMassProps({topols, accuracy}) {
    //TODO:
    //FIXME: this API may not be right.
    const topolTags = topols.map(topol => topol._pkTag);

    const method = 'TOPOL_eval_mass_props';
    const params = {
      topols: topolTags,
      accuracy: accuracy
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return {
      amount: pkReturnValue.amount,
      mass: pkReturnValue.mass,
      c_of_g: pkReturnValue.c_of_g,
      m_of_i: pkReturnValue.m_of_i,
      periphery: pkReturnValue.periphery
    };
  }

  _pkRenderFacet({resolution = 'high'} = {}) {
    const method = 'TOPOL_render_facet';
    const params = {
      topol: this._pkTag,
      resolution,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const renderingFacetData = pkReturnValue.graphics.faces;

    return renderingFacetData;
  }

  _pkRenderLine({resolution = 'high'} = {}) {
    const method = 'TOPOL_render_line';
    const params = {
      topol: this._pkTag,
      resolution,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const renderingLineData = pkReturnValue.graphics.edges;

    return renderingLineData;
  }
}
