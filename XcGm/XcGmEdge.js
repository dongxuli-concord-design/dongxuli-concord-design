class XcGmEdge extends XcGmTopology {
  constructor() {
    super();
  }

  get body() {
    const params = {
      edge: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get curve() {
    const params = {
      edge: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_curve', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const curve = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.curve});
    return curve;
  }

  get faces() {
    const params = {
      edge: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = pkReturnValue.faces.map(faceTag => XcGmEntity._getObjectFromPkTag({entityTag: faceTag}));
    return faces;
  }

  get vertices() {
    const params = {
      edge: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex1 = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.vertices[0]});
    const vertex2 = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.vertices[1]});
    return {vertex1, vertex2};
  }

  static reverse({edges}) {
    const edgeTags = edges.map(edge => edge.tag);
    const params = {
      edges: edgeTags,
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_reverse_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static makeFacesFromEdges({edges, senses, sharedLoop}) {
    const edgeTags = edges.map(edge => edge.tag);
    const params = {
      edges: edgeTags,
      senses: senses,
      shared_loop: sharedLoop
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_make_faces_from_wire', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const newFaces = pkReturnValue.new_faces.map(faceTag => XcGmEntity._getObjectFromPkTag({entityTag: faceTag}));
    return newFaces;
  }

  static setBlendConstantForEdges({edges, radius}) {
    const edgeTags = edges.map(edge => edge.tag);
    const params = {
      edges: edgeTags,
      radius: radius
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_set_blend_constant', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const blendEdges = pkReturnValue.blend_edges.map(blendEdgeTag => XcGmEntity._getObjectFromPkTag({entityTag: blendEdgeTag}));
    return blendEdges;
  }

  propagateOrientation() {
    const params = {
      edge: this.tag,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_propagate_orientation', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  findInterval() {
    const params = {
      edge: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_find_interval', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkInterval = _XcGmPK_INTERVAL_t.fromJSON({json: pkReturnValue.interval});
    const interval = pkInterval.toXcGmInterval();
    return interval;
  }

  containsVector({vector}) {
    const params = {
      edge: this.tag,
      vector: vector.toJSON()
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_contains_vector', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const topol = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.topol});
    return topol;
  }

  findVertexByPosition({position}) {
    const {vertex1, vertex2} = this.vertices;
    const vertices = [vertex1, vertex2];

    const vertexFound = vertices.find(vertex => position.isEqualTo({position: vertex.point.position}));
    return vertexFound? vertexFound: null;
  }

  findVertex({callback}) {
    const vertices = this.vertices;
    return vertices.filter(callback);
  }
}
