class XcGmBody extends XcGmPart {

  static _PKBodyType = {
    MINIMUM: 5603,
    ACORN: 5606,
    WIRE: 5604,
    SHEET: 5602,
    SOLID: 5601,
    GENERAL: 5605,
    UNSPECIFIED: 5607,
    EMPTY: 5608,
    COMPOUND: 5609
  };

  static _PKBooleanFunction = {
    Intersection: Symbol('Intersection'),
    Subtraction: Symbol('Subtraction'),
    Union: Symbol('Union'),
  };

  constructor() {
    super();
  }

  get _pkFaces() {
    const params = {
      body: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const faces = pkReturnValue.faces.map(faceTag => XcGmEntity._getPkObjectFromPkTag({entityTag: faceTag}));

    return faces;
  }

  get _pkEdges() {
    const params = {
      body: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_ask_edges', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const edges = pkReturnValue.edges.map(edgeTag => XcGmEntity._getPkObjectFromPkTag({entityTag: edgeTag}));
    return edges;
  }

  get _pkVertices() {
    const params = {
      body: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const vertices = pkReturnValue.vertices.map(vertexTag => XcGmEntity._getPkObjectFromPkTag({entityTag: vertexTag}));
    return vertices;
  }

  get _pkType() {
    const params = {
      body: this._pkTag
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_ask_type', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return pkReturnValue._PKBodyType;
  }

  static _pkCreateSolidBlock({x, y, z, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      x: x,
      y: y,
      z: z,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_block', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const block = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return block;
  }

  static _pkCreateSolidCone({radius, height, semiAngle, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      semi_angle: semiAngle,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_cone', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const cone = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return cone;
  }

  static _pkCreateSolidCylinder({radius, height, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_cyl', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const cylinder = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return cylinder;
  }

  static _pkCreateSolidPrism({radius, height, sides, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      n_sides: sides,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_prism', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const prism = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return prism;
  }

  static _pkCreateSolidSphere({radius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_sphere', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sphere = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return sphere;
  }

  static _pkCreateSolidTorus({majorRadius, minorRadius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      major_radius: majorRadius,
      minor_radius: minorRadius,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_solid_torus', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const torus = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return torus;
  }

  static _pkCreateSheetCircle({radius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      basis_set
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_create_sheet_circle', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sheetCircle = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return sheetCircle;
  };

  static _pkSweep({profiles, path, pathVertices}) {
    const profileTags = profiles.map(profile => profile._pkTag);
    const pathTag = path._pkTag;
    const pathVerticesTags = pathVertices.map(pathVertex => pathVertex._pkTag);
    const params = {
      profiles: profileTags,
      path: pathTag,
      pathVertices: pathVerticesTags,
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_make_swept_body_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});

    return body;
  }

  static _pkLoft({profiles, startVertices, guideWires}) {
    XcGmAssert({
      assertion: profiles.length === startVertices.length,
      message: `Profiles and start vertices have different length.`
    });

    const profileTags = profiles.map(profile => profile._pkTag);
    const startVerticesTags = startVertices.map(startVertex => startVertex._pkTag);
    const guideWiresTags = guideWires.map(guideWire => guideWire._pkTag);

    const params = {
      profiles: profileTags,
      start_vertices: startVerticesTags,
      guide_wires: guideWiresTags
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_make_lofted_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});

    return body;
  }

  static _pkSew({bodies, gapWidthBound}) {
    const bodyTags = bodies.map(body => body._pkTag);

    const params = {
      bodies: bodyTags,
      gap_width_bound: gapWidthBound,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_sew_bodies', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const sewnBodies = pkReturnValue.sewn_bodies.map(bodyTag => XcGmEntity._getPkObjectFromPkTag({entityTag: bodyTag}));
    const unSewnBodies = pkReturnValue.unsewn_bodies.map(bodyTag => XcGmEntity._getPkObjectFromPkTag({entityTag: bodyTag}));

    return {
      sewnBodies,
      unSewnBodies,
    };
  }

  _pkExtrude({direction, distance}) {
    //todo: validate options

    const options = new _PK_BODY_extrude_o_t();
    options.end_bound.distance = distance;
    const params = {
      profile: this._pkTag,
      path: new _XcGmPK_VECTOR_t({coord: direction.toArray()}),
      options,
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_extrude', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.body});
    return body;
  }

  _pkSpin({axis, angle}) {
    //todo: validate options

    const pkAxis1SF = _XcGmPK_AXIS1_sf_t.fromXcGm3dAxis({axis});

    const params = {
      body: this._pkTag,
      axis: pkAxis1SF.toJSON(),
      angle: angle
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_spin', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  _pkFirstEdge() {
    const params = {
      body: this._pkTag,
    };
    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_ask_first_edge', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const firstEdge = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.first_edge});
    return firstEdge;
  }

  _pkTransform({matrix}) {
    const transfSF = _XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix});
    const transf = _XcGmTransf.create({transfSF});

    const params = {
      body: this._pkTag,
      transf: transf._pkTag
    };

    const {error, returnValue} = _PK_XcGmCallPkApi('BODY_transform_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  _pkUnite({tools}) {
    const toolTags = tools.map(tool => tool._pkTag);
    const params = {
      target: this._pkTag,
      tools: toolTags,
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_unite_bodies', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = pkReturnValue.bodies.map(bodyTag => XcGmEntity._getPkObjectFromPkTag({entityTag: bodyTag}));
    return resultBodies;
  }

  _pkBoolean({tools, func}) {
    let PK_boolean_param = 0;
    if (func === XcGmBody._PKBooleanFunction.Intersection) {
      PK_boolean_param = _PK_boolean_intersect_c;
    } else if (func === XcGmBody._PKBooleanFunction.Subtraction) {
      PK_boolean_param = _PK_boolean_subtract_c;
    } else if (func === XcGmBody._PKBooleanFunction.Union) {
      PK_boolean_param = _PK_boolean_unite_c;
    }

    const toolTags = tools.map(tool => tool._pkTag);
    const params = {
      target: this._pkTag,
      tools: toolTags,
      func: PK_boolean_param
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_boolean_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = pkReturnValue.bodies.map(bodyTag => XcGmEntity._getPkObjectFromPkTag({entityTag: bodyTag}));
    return resultBodies;
  }

  _pkFixBlends() {
    const params = {
      body: this._pkTag
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_fix_blends', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  _pkHollowFaces({faces, offset}) {
    const faceTags = faces.map(face => face._pkTag);

    const params = {
      body: this._pkTag,
      faces: faceTags,
      offset: offset
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_hollow_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  _pkImprintCurve({curve, bounds}) {
    const params = {
      body: this._pkTag,
      curve: curve._pkTag,
      bounds: bounds.map(bound =>  _XcGmPK_INTERVAL_t.fromXcGmInterval({interval: bound}).toJSON()),
    };

    const {error, pkReturnValue} = _PK_XcGmCallPkApi('BODY_imprint_curve', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const newEdges = pkReturnValue.new_edges.map(newEdgeTag => XcGmEntity._getPkObjectFromPkTag({entityTag: newEdgeTag}));
    const newFaces = pkReturnValue.new_faces.map(newFaceTag => XcGmEntity._getPkObjectFromPkTag({entityTag: newFaceTag}));
    return {newEdges, newFaces};
  }

  _pkToSTL() {
    const allRenderingFacetData = this._pkRenderFacet({resolution: 'high'});
    const stlFileContent = [];

    const vertices = [];
    const vertexNormals = [];
    const indices = [];
    let indexOffset = 0;

    for (const renderingFacetData of allRenderingFacetData) {
      if (renderingFacetData.type === 'L3TPFI') {
        // Facet plus normals plus parameters
        for (let i = 0; i < renderingFacetData.facets.length; i += 1) {
          // For each _pkVertices in
          const facet = renderingFacetData.facets[i];
          const vertex = new THREE.Vector3(facet.point[0], facet.point[1], facet.point[2]);
          const normal = new THREE.Vector3(facet.normal[0], facet.normal[1], facet.normal[2]);

          vertices.push(vertex);
          vertexNormals.push(normal);
        }

        // Set indices
        for (let i = 0; i < renderingFacetData.facets.length - 2; i += 3) {
          indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
        }
        indexOffset += renderingFacetData.facets.length;
      } else if (renderingFacetData.type === 'L3TPTI') {
        // Facet strips plus normals plus parameters
        for (let i = 0; i < renderingFacetData.facets.length; i += 1) {
          // For each _pkVertices in
          const facet = renderingFacetData.facets[i];
          const vertex = new THREE.Vector3(facet.point[0], facet.point[1], facet.point[2]);
          const normal = new THREE.Vector3(facet.normal[0], facet.normal[1], facet.normal[2]);

          vertices.push(vertex);
          vertexNormals.push(normal);
        }

        // Set indices
        for (let i = 0; i < renderingFacetData.facets.length - 2; i += 1) {
          if ((i % 2) == 0) {
            indices.push(indexOffset + i, indexOffset + i + 1, indexOffset + i + 2);
          } else {
            indices.push(indexOffset + i + 1, indexOffset + i, indexOffset + i + 2);
          }
        }

        indexOffset += renderingFacetData.facets.length;
      } else {
        XcSysAssert({assertion: 'Unexpected facet type.'});
      }
    }

    // Generate STL file
    stlFileContent.push(`solid body`);
    for (let i = 0; i < indices.length - 2; i += 3) {
      stlFileContent.push(` facet normal ${vertexNormals[indices[i]].x} ${vertexNormals[indices[i]].y} ${vertexNormals[indices[i]].z}`);
      stlFileContent.push(`  outer loop`);
      stlFileContent.push(`   vertex ${vertices[indices[i]].x} ${vertices[indices[i]].y} ${vertices[indices[i]].z}`);
      stlFileContent.push(`   vertex ${vertices[indices[i+1]].x} ${vertices[indices[i+1]].y} ${vertices[indices[i+1]].z}`);
      stlFileContent.push(`   vertex ${vertices[indices[i+2]].x} ${vertices[indices[i+2]].y} ${vertices[indices[i+2]].z}`);
      stlFileContent.push(`  endloop`);
      stlFileContent.push(` endfacet`);
    }
    stlFileContent.push(`endsolid body`);
    const stlFileString = stlFileContent.join('\r\n');

    return stlFileString;
  }

  _pkFindVertexByPosition({position}) {
    const vertices = this._pkVertices;
    const vertexFound = vertices.find(vertex => {
      const point = vertex.point;
      return position.isEqualTo({position: point.position})
    });

    return vertexFound ? vertexFound: null;
  }

  _pkFindEdgeByPositions({position1, position2}) {
    const edges = this._pkEdges;
    const edgeFound = edges.find(edge => {
      const {vertex1, vertex2} = edge._pkVertices;
      const positions = [vertex1.point.position, vertex2.point.position];
      const position1Found = positions.find(position => position.isEqualTo({position: position1}));
      const position2Found = positions.find(position => position.isEqualTo({position: position2}));
      return position1Found && position2Found;
    });

    return nuedgeFound ? edgeFound: null;
  }

  _pkFindEdgeByVertices({vertex1, vertex2}) {
    const edges = this._pkEdges;
    const edgeFound = edges.find(edge => {
      const {v1, v2} = edge._pkVertices;
      return (v1 === vertex1) && (v2 === vertex2);
    });

    return edgeFound ? edgeFound: null;
  }

  _pkFindFaceByPositions({positions}) {
    const foundFaces = [];

    // TODO

    return foundFaces;
  }

  _pkFindFaceByEdges({edges}) {
    const foundFaces = this._pkFaces.filter(face => edges.every(edge => face._pkEdges.includes(edge)));
    return foundFaces;
  }

  _pkFindFaceByVertices({vertices}) {
    const foundFaces = this._pkFaces.filter(face => vertices.every(vertex => face._pkVertices.includes(vertex)));
    return foundFaces;
  }

  _pkFindVertex({callback}) {
    const vertices = this._pkVertices;
    return vertices.filter(callback);
  }

  _pkFindEdge({callback}) {
    const edges = this._pkEdges;
    return edges.filter(callback);
  }

  _pkFindFace({callback}) {
    const faces = this._pkFaces;
    return faces.filter(callback);
  }
}
