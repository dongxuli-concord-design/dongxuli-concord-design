class XcGmTopology extends XcGmEntity {
  constructor() {
    super();
  }

  get box() {
    const params = {
      topol: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('TOPOL_find_box', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkBox = XcGmPK_BOX_t.fromJSON({json: pkReturnValue.uvbox});
    const box = pkBox.toXcGm3dBox();
    return box;
  }

  static evalMassPropsFor({topols, accuracy}) {
    //TODO:
    //FIXME: this API may not be right.
    const topolTags = topols.map(topol => topol.tag);
    const params = {
      topols: topolTags,
      accuracy: accuracy
    };

    const {error, pkReturnValue} = XcGmCallPkApi('TOPOL_eval_mass_props', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return {
      amount: pkReturnValue.amount,
      mass: pkReturnValue.mass,
      c_of_g: pkReturnValue.c_of_g,
      m_of_i: pkReturnValue.m_of_i,
      periphery: pkReturnValue.periphery
    };
  }

  render_facet({resolution = 'high'} = {}) {
    const params = {
      topol: this.tag,
      resolution,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('TOPOL_render_facet', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const renderingFacetData = pkReturnValue.graphics.faces;

    return renderingFacetData;
  }

  render_line({resolution = 'high'} = {}) {
    const params = {
      topol: this.tag,
      resolution,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('TOPOL_render_line', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const renderingLineData = pkReturnValue.graphics.edges;

    return renderingLineData;
  }
}
