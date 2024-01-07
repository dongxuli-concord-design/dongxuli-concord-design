class XcGmVertex extends XcGmTopology {
  constructor() {
    super();
  }

  get point() {
    const method = 'VERTEX_ask_point';
    const params = {
      vertex: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.point});
    return point;
  }

  get body() {
    const method = 'VERTEX_ask_body';
    const params = {
      vertex: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get faces() {
    const method = 'VERTEX_ask_faces';
    const params = {
      vertex: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = pkReturnValue.faces.map(faceTag =>XcGmEntity._getPkObjectFromPkTag({entityTag: faceTag}));
    return faces;
  }
}
