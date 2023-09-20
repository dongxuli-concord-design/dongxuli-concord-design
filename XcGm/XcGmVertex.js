class XcGmVertex extends XcGmTopology {
  constructor() {
    super();
  }

  get point() {
    const params = {
      vertex: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('VERTEX_ask_point', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.point});
    return point;
  }

  get body() {
    const params = {
      vertex: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('VERTEX_ask_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get faces() {
    const params = {
      vertex: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('VERTEX_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = pkReturnValue.faces.map(faceTag =>XcGmEntity._getPkObjectFromPkTag({entityTag: faceTag}));
    return faces;
  }
}
