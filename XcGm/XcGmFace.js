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
    const method = 'FACE_ask_surf';
    const params = {
      face: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const surf = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.srf});
    return surf;
  }

  get UVBox() {
    const method = 'FACE_find_uvbox';
    const params = {
      face: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const pkUVBox = _XcGmPK_UVBox_t.fromJSON({json: pkReturnValue.uvbox})
    const uvbox = pkUVBox.toXcGmUVBox();
    return uvbox;
  }

  get body() {
    const method = 'FACE_ask_body';
    const params = {
      face: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  get edges() {
    const method = 'FACE_ask_edges';
    const params = {
      face: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const edges = pkReturnValue.edges.map(edgeTag => XcGmEntity._getPkObjectFromPkTag({entityTag: edgeTag}));
    return edges;
  }

  get vertices() {
    const method = 'FACE_ask_vertices';
    const params = {
      face: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const vertices = pkReturnValue.vertices.map(vertexTag => XcGmEntity._getPkObjectFromPkTag({entityTag: vertexTag}));
    return vertices;
  }

  static delete({faces}) {
    const faceTags = faces.map(face => face._pkTag);

    const method = 'FACE_delete_2';
    const params = {
      faces: faceTags
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static _pkTransform({facesAndMatrices, tolerance}) {
    const faceTags = facesAndMatrices.map(faceAndMatrix => faceAndMatrix.face._pkTag);
    const transfTags = facesAndMatrices.map(faceAndMatrix => {
      const transfSF = _XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix: faceAndMatrix.matrix});
      const transf = _XcGmTransf.create({transfSF});
      return transf._pkTag;
    });

    const method = 'FACE_transform_2';
    const params = {
      faces: faceTags,
      transfs: transfTags,
      tolerance: tolerance
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  static _pkBoolean({targets, tools, func}) {
    let PK_boolean_param = 0;
    if (func === XcGmFace._PKBooleanFunction.Intersection) {
      PK_boolean_param = _PK_boolean_intersect_c;
    } else if (func === XcGmFace._PKBooleanFunction.Subtraction) {
      PK_boolean_param = _PK_boolean_subtract_c;
    } else if (func === XcGmFace._PKBooleanFunction.Union) {
      PK_boolean_param = _PK_boolean_unite_c;
    }

    const targetTags = targets.map(target => target._pkTag);
    const toolTags = tools.map(tool => tool._pkTag);
    const params = {
      target: targetTags,
      tools: toolTags,
      func: PK_boolean_param
    };

    const method = 'FACE_boolean_2';
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = pkReturnValue.bodies.map(bodyTag => XcGmEntity._getPkObjectFromPkTag({entityTag: bodyTag}));
    return resultBodies;
  }

  _pkSurfAndOrientation() {
    const method = 'FACE_ask_oriented_surf';
    const params = {
      face: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const surf = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.srf});
    return {surf, orientation: pkReturnValue.orientation};
  }

  _pkAttachSurfFitting({localCheck}) {
    const method = 'FACE_attach_surf_fitting';
    const params = {
      face: this._pkTag,
      local_check: localCheck
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return;
  }

  _pkImprintCurve({curves, intervals}) {
    XcGmAssert({assertion: curves.length === intervals.length, message: `curves and intervals should have equal length.`});

    const method = 'FACE_imprint_curves_2';
    const params = {
      face: this._pkTag,
      curves: curves.map(curve => curve._pkTag),
      intervals: intervals.map(interval => _XcGmPK_INTERVAL_t.fromXcGmInterval({interval}).toJSON()),
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi({method, params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return;
  }

  findVertexByPosition({position}) {
    const vertexFound = this._pkVertices.find(vertex => position.isEqualTo({position: vertex.point.position}));
    return vertexFound? vertexFound: null;
  }

  findEdgeByPositions({positions}) {
    //TODO
    return null;
  }

  findEdgeByVertex(vertex) {
    const foundEdges = this._pkEdges.filter(edge => {
      const {v1, v2} = edge._pkVertices;
      return (v1 === vertex) || (v2 === vertex);
    });
    return foundEdges;
  }

  findEdgeByTwoVertices({vertex1, vertex2}) {
    const edgeFound = this._pkEdges.find(edge => {
      const {v1, v2} = edge._pkVertices;
      return (v1 === vertex1) && (v2 === vertex2);
    });

    return edgeFound? edgeFound: null;
  }

  findVertex({callback}) {
    const vertices = this._pkVertices;
    return vertices.filter(callback);
  }

  findEdge({callback}) {
    const edges = this._pkEdges;
    return edges.filter(callback);
  }
}
