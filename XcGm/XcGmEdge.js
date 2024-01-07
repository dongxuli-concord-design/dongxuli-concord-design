class XcGmEdge extends XcGmTopology {
  constructor() {
    super();
  }

  get body() {
    const method = 'EDGE_ask_body';
    const params = {
      edge: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get curve() {
    const method = 'EDGE_ask_curve';
    const params = {
      edge: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const curve = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.curve});
    return curve;
  }

  get faces() {
    const method = 'EDGE_ask_faces';
    const params = {
      edge: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = pkReturnValue.faces.map(faceTag => XcGmEntity._getPkObjectFromPkTag({entityTag: faceTag}));
    return faces;
  }

  get vertices() {
    const method = 'EDGE_ask_vertices';
    const params = {
      edge: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex1 = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.vertices[0]});
    const vertex2 = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.vertices[1]});
    return {vertex1, vertex2};
  }

  static reverse({edges}) {
    const edgeTags = edges.map(edge => edge._pkTag);

    const method = 'EDGE_reverse_2';
    const params = {
      edges: edgeTags,
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static _pkMakeFacesFromEdges({edges, senses, sharedLoop}) {
    const edgeTags = edges.map(edge => edge._pkTag);

    const method = 'EDGE_make_faces_from_wire';
    const params = {
      edges: edgeTags,
      senses: senses,
      shared_loop: sharedLoop
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const newFaces = pkReturnValue.new_faces.map(faceTag => XcGmEntity._getPkObjectFromPkTag({entityTag: faceTag}));
    return newFaces;
  }

  static _pkSetBlendConstantForEdgesges({edges, radius}) {
    const edgeTags = edges.map(edge => edge._pkTag);

    const method = 'EDGE_set_blend_constant';
    const params = {
      edges: edgeTags,
      radius: radius
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const blendEdges = pkReturnValue.blend_edges.map(blendEdgeTag => XcGmEntity._getPkObjectFromPkTag({entityTag: blendEdgeTag}));
    return blendEdges;
  }

  _pkPropagateOrientationion() {
    const method = 'EDGE_propagate_orientation';
    const params = {
      edge: this._pkTag,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  findInterval() {
    const method = 'EDGE_find_interval';
    const params = {
      edge: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkInterval = _XcGmPK_INTERVAL_t.fromJSON({json: pkReturnValue.interval});
    const interval = pkInterval.toXcGmInterval();
    return interval;
  }

  _pkContainsVector({vector}) {
    const method = 'EDGE_contains_vector';
    const params = {
      edge: this._pkTag,
      vector: vector.toJSON()
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const topol = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.topol});
    return topol;
  }

  findVertexByPosition({position}) {
    const {vertex1, vertex2} = this._pkVertices;
    const vertices = [vertex1, vertex2];

    const vertexFound = vertices.find(vertex => position.isEqualTo({position: vertex.point.position}));
    return vertexFound? vertexFound: null;
  }

  findVertex({callback}) {
    const vertices = this._pkVertices;
    return vertices.filter(callback);
  }
}
