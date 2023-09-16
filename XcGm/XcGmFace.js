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
    const surf = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.srf});
    return surf;
  }

  get UVBox() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_find_uvbox', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkUVBox = _XcGmPK_UVBox_t.fromJSON({json: pkReturnValue.uvbox})
    const uvbox = pkUVBox.toXcGmUVBox();
    return uvbox;
  }

  get body() {
    const params = {
      face: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get edges() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_edges', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const edges = pkReturnValue.edges.map(edgeTag => XcGmEntity._getObjectFromPkTag({entityTag: edgeTag}));
    return edges;
  }

  get vertices() {
    const params = {
      face: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertices = pkReturnValue.vertices.map(vertexTag => XcGmEntity._getObjectFromPkTag({entityTag: vertexTag}));
    return vertices;
  }

  static delete({faces}) {
    const faceTags = faces.map(face => face.tag);
    const params = {
      faces: faceTags
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_delete_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static transform({facesAndMatrices, tolerance}) {
    const faceTags = facesAndMatrices.map(faceAndMatrix => faceAndMatrix.face.tag);
    const transfTags = facesAndMatrices.map(faceAndMatrix => {
      const transfSF = _XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix: faceAndMatrix.matrix});
      const transf = _XcGmTransf.create({transfSF});
      return transf.tag;
    });

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
      PK_boolean_param = _PK_boolean_intersect_c;
    } else if (func === XcGmFace.BooleanFunction.Subtraction) {
      PK_boolean_param = _PK_boolean_subtract_c;
    } else if (func === XcGmFace.BooleanFunction.Union) {
      PK_boolean_param = _PK_boolean_unite_c;
    }

    const targetTags = targets.map(target => target.tag);
    const toolTags = tools.map(tool => tool.tag);
    const params = {
      target: targetTags,
      tools: toolTags,
      func: PK_boolean_param
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_boolean_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = pkReturnValue.bodies.map(bodyTag => XcGmEntity._getObjectFromPkTag({entityTag: bodyTag}));
    return resultBodies;
  }

  surfAndOrientation() {
    const params = {
      face: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('FACE_ask_oriented_surf', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const surf = XcGmEntity._getObjectFromPkTag({entityTag: pkReturnValue.srf});
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
    XcGmAssert({assertion: curves.length === intervals.length, message: `curves and intervals should have equal length.`});

    const params = {
      face: this.tag,
      curves: curves.map(curve => curve.tag),
      intervals: intervals.map(interval => _XcGmPK_INTERVAL_t.fromXcGmInterval({interval}).toJSON()),
    };

    const {error, pkReturnValue} = XcGmCallPkApi('FACE_imprint_curves_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return;
  }

  findVertexByPosition({position}) {
    const vertexFound = this.vertices.find(vertex => position.isEqualTo({position: vertex.point.position}));
    return vertexFound? vertexFound: null;
  }

  findEdgeByPositions({positions}) {
    //TODO
    return null;
  }

  findEdgeByVertex(vertex) {
    const foundEdges = this.edges.filter(edge => {
      const {v1, v2} = edge.vertices;
      return (v1 === vertex) || (v2 === vertex);
    });
    return foundEdges;
  }

  findEdgeByTwoVertices({vertex1, vertex2}) {
    const edgeFound = this.edges.find(edge => {
      const {v1, v2} = edge.vertices;
      return (v1 === vertex1) && (v2 === vertex2);
    });

    return edgeFound? edgeFound: null;
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
