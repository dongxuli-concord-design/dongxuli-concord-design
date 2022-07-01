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
    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return body;
  }

  get curve() {
    const params = {
      edge: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_curve', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const curve = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.curve});
    return curve;
  }

  get faces() {
    const params = {
      edge: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const faces = [];
    for (const faceTag of pkReturnValue.faces) {
      const face = XcGmEntity.getObjFromTag({entityTag: faceTag});
      faces.push(face);
    }
    return faces;
  }

  get vertices() {
    const params = {
      edge: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertex1 = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.vertices[0]});
    const vertex2 = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.vertices[1]});
    return {vertex1, vertex2};
  }

  static reverse({edges}) {
    const edgeTags = [];
    for (const edge of edges) {
      edgeTags.push(edge.tag);
    }
    const params = {
      edges: edgeTags,
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_reverse_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static makeFacesFrom({edges, senses, sharedLoop}) {
    const edgeTags = [];
    for (const edge of edges) {
      edgeTags.push(edge.tag);
    }
    const params = {
      edges: edgeTags,
      senses: senses,
      shared_loop: sharedLoop
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_make_faces_from_wire', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const newFaces = [];

    for (const faceTag of pkReturnValue.new_faces) {
      const newFaceObj = XcGmEntity.getObjFromTag({entityTag: faceTag});
      XcGmAssert({assertion: newFaceObj});
      newFaces.push(newFaceObj);
    }

    return newFaces;
  }

  static setBlendConstantFor({edges, radius}) {
    const edgeTags = [];
    for (const edge of edges) {
      edgeTags.push(edge.tag);
    }
    const params = {
      edges: edgeTags,
      radius: radius
    };
    const {error, pkReturnValue} = XcGmCallPkApi('EDGE_set_blend_constant', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const blendEdges = [];
    for (const blendEdgeTag of pkReturnValue.blend_edges) {
      const bendEdge = XcGmEntity.getObjFromTag({entityTag: blendEdgeTag});
      XcGmAssert({assertion: bendEdge});
      blendEdges.push(bendEdge);
    }
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
    const pkInterval = XcGmPK_INTERVAL_t.fromJSON({json: pkReturnValue.interval});
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
    const topol = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.topol});
    return topol;
  }

  findVertexByPosition({position}) {
    const {vertex1, vertex2} = this.vertices;
    const vertices = [vertex1, vertex2];

    for (const vertex of vertices) {
      const point = vertex.point;
      if (position.isEqualTo({position: point.position})) {
        return vertex;
      }
    }

    return null;
  }

  findVertex({callback}) {
    const vertices = this.vertices;
    return vertices.filter(callback);
  }
}
