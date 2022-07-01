class XcGmVertex extends XcGmTopology {
  constructor() {
    super();
  }

  get point() {
    const params = {
      vertex: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('VERTEX_ask_point', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const point = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.point});
    return point;
  }

  get body() {
    const params = {
      vertex: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('VERTEX_ask_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return body;
  }

  get faces() {
    const params = {
      vertex: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('VERTEX_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = [];
    for (const faceTag of pkReturnValue.faces) {
      const face = XcGmEntity.getObjFromTag({entityTag: faceTag});
      faces.push(face);
    }
    return faces;
  }
}
