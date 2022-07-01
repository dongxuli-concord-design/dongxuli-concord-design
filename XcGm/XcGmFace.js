class XcGmFace extends XcGmTopology {
  static BooleanFunction = {
    Intersection: Symbol('Intersection'),
    Subtraction: Symbol('Subtraction'),
    Union: Symbol('Union'),
  };

  constructor() {
    super();
  }

  get surf() {
    const params = {
      face: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_surf', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const surf = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.srf});
    return surf;
  }

  get UVBox() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_find_uvbox', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkUVBox = XcGmPK_UVBox_t.fromJSON({json: pkReturnValue.uvbox})
    const uvbox = pkUVBox.toXcGmUVBox();
    return uvbox;
  }

  get body() {
    const params = {
      face: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return body;
  }

  get edges() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_edges', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const edges = [];
    for (const edgeTag of pkReturnValue.edges) {
      const edge = XcGmEntity.getObjFromTag({entityTag: edgeTag});
      edges.push(edge);
    }
    return edges;
  }

  get vertices() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertices = [];
    for (const vertexTag of pkReturnValue.vertices) {
      const vertex = XcGmEntity.getObjFromTag({entityTag: vertexTag});
      vertices.push(vertex);
    }
    return vertices;
  }

  static delete({faces}) {
    const faceTags = [];
    for (const face of faces) {
      faceTags.push(face.tag);
    }

    const params = {
      faces: faceTags
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_delete_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static transform({facesAndMatrices, tolerance}) {
    const faceTags = [];
    for (const faceAndMatrix of facesAndMatrices) {
      faceTags.push(faceAndMatrix.face.tag);
    }

    const transfTags = [];
    for (const faceAndMatrix of facesAndMatrices) {
      const transfSF = XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix: faceAndMatrix.matrix});
      const transf = XcGmTransf.create({transfSF});

      transfTags.push(transf.tag);
    }

    const params = {
      faces: faceTags,
      transfs: transfTags,
      tolerance: tolerance
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_transform_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static boolean({targets, tools, func}) {
    let PK_boolean_param = 0;
    if (func === XcGmFace.BooleanFunction.Intersection) {
      PK_boolean_param = PK_boolean_intersect_c;
    } else if (func === XcGmFace.BooleanFunction.Subtraction) {
      PK_boolean_param = PK_boolean_subtract_c;
    } else if (func === XcGmFace.BooleanFunction.Union) {
      PK_boolean_param = PK_boolean_unite_c;
    }

    const targetTags = [];
    for (const tool of targets) {
      targetTags.push(tool.tag);
    }

    const toolTags = [];
    for (const tool of tools) {
      toolTags.push(tool.tag);
    }

    const params = {
      target: targetTags,
      tools: toolTags,
      func: PK_boolean_param
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_boolean_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = [];
    for (const bodyTag of pkReturnValue.bodies) {
      const body = XcGmEntity.getObjFromTag({entityTag: bodyTag});
      resultBodies.push(body);
    }

    return resultBodies;
  }

  surfAndOrientation() {
    const params = {
      face: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_oriented_surf', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const surf = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.srf});
    return {surf, orientation: pkReturnValue.orientation};
  }

  attachSurfFitting({localCheck}) {
    const params = {
      face: this.tag,
      local_check: localCheck
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_attach_surf_fitting', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return;
  }

  imprintCurve({curves, intervals}) {
    const params = {
      face: this.tag,
      curves: [],
      intervals: [],
    };

    XcGmAssert({assertion: curves.length === intervals.length, message: `curves and intervals should have equal length.`});

    for (const curve of curves) {
      params.curves.push(curve.tag);
    }

    for (const interval of intervals) {
      const pkInterval = XcGmPK_INTERVAL_t.fromXcGmInterval({interval});
      params.intervals.push(pkInterval.toJSON());
    }

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_imprint_curves_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return;
  }

  findVertexByPosition({position}) {
    const vertices = this.vertices;
    for (const vertex of vertices) {
      const point = vertex.point;
      if (position.isEqualTo({position: point.position})) {
        return vertex;
      }
    }

    return null;
  }

  findEdgeByPositions({positions}) {
    //TODO
    return null;
  }

  findEdgeByVertex(vertex) {
    const foundEdges = [];
    const edges = this.edges;
    for (const edge of edges) {
      const {v1, v2} = edge.vertices;
      if ((v1 === vertex1) || (v2 === vertex2)) {
        foundEdges.push(edge);
      }
    }

    return foundEdges;
  }

  findEdgeByTwoVertices({vertex1, vertex2}) {
    const edges = this.edges;
    for (const edge of edges) {
      const {v1, v2} = edge.vertices;
      if ((v1 === vertex1) && (v2 === vertex2)) {
        return edge;
      }
    }

    return null;
  }

  findVertex({callback}) {
    const vertices = this.vertices;
    return vertices.filter(callback);
  }

  findEdge({callback}) {
    const edges = this.edges;
    return edges.filter(callback);
  }
}
