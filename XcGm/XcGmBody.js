class XcGmBody extends XcGmPart {

  static BODY_TYPE = {
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

  static BooleanFunction = {
    Intersection: Symbol('Intersection'),
    Subtraction: Symbol('Subtraction'),
    Union: Symbol('Union'),
  };

  constructor() {
    super();
  }

  get faces() {
    const params = {
      body: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_ask_faces', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const faces = [];
    for (const faceTag of pkReturnValue.faces) {
      const face = XcGmEntity.getObjFromTag({entityTag: faceTag});
      faces.push(face);
    }

    return faces;
  }

  get edges() {
    const params = {
      body: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_ask_edges', {params});
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
      body: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_ask_vertices', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const vertices = [];
    for (const vertexTag of pkReturnValue.vertices) {
      const vertex = XcGmEntity.getObjFromTag({entityTag: vertexTag});
      vertices.push(vertex);
    }
    return vertices;
  }

  get type() {
    const params = {
      body: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_ask_type', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return pkReturnValue.body_type;
  }

  static createSolidBlock({x, y, z, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      x: x,
      y: y,
      z: z,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_block', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const block = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return block;
  }

  static createSolidCone({radius, height, semiAngle, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      semi_angle: semiAngle,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_cone', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const cone = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return cone;
  }

  static createSolidCylinder({radius, height, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_cyl', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const cylinder = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return cylinder;
  }

  static createSolidPrism({radius, height, sides, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      height: height,
      n_sides: sides,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_prism', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const prism = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return prism;
  }

  static createSolidSphere({radius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_sphere', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sphere = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return sphere;
  }

  static createSolidTorus({majorRadius, minorRadius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      major_radius: majorRadius,
      minor_radius: minorRadius,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_solid_torus', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const torus = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return torus;
  }

  static createSheetCircle({radius, coordinateSystem = null}) {
    let basis_set = null;

    if (coordinateSystem) {
      basis_set = XcGmPK_AXIS2_sf_t.fromXcGmCoordinateSystem({coordinateSystem});
    }

    const params = {
      radius: radius,
      basis_set
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_create_sheet_circle', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const sheetCircle = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return sheetCircle;
  };

  static sweep({profiles, path, pathVertices}) {
    const profileTags = [];
    for (const profile of profiles) {
      profileTags.push(profile.tag);
    }

    const pathTag = path.tag;

    const pathVerticesTags = [];
    for (const pathVertex of pathVertices) {
      pathVerticesTags.push(pathVertex.tag);
    }

    const params = {
      profiles: profileTags,
      path: pathTag,
      pathVertices: pathVerticesTags,
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_make_swept_body_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});

    return body;
  }

  static loft({profiles, startVertices, guideWires}) {
    XcGmAssert({
      assertion: profiles.length === startVertices.length,
      message: `Profiles and start vertices have different length.`
    });

    const profileTags = [];
    for (const profile of profiles) {
      profileTags.push(profile.tag);
    }

    const startVerticesTags = [];
    for (const startVertex of startVertices) {
      startVerticesTags.push(startVertex.tag);
    }

    const guideWiresTags = [];
    for (const guideWire of guideWires) {
      guideWiresTags.push(guideWire.tag);
    }

    const params = {
      profiles: profileTags,
      start_vertices: startVerticesTags,
      guide_wires: guideWiresTags
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_make_lofted_body', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});

    return body;
  }

  static sew({bodies, gapWidthBound}) {
    const bodyTags = [];
    for (const body of bodies) {
      bodyTags.push(body.tag);
    }

    const params = {
      bodies: bodyTags,
      gap_width_bound: gapWidthBound,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_sew_bodies', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const sewnBodies = [];
    for (const bodyTag of pkReturnValue.sewn_bodies) {
      const body = XcGmEntity.getObjFromTag({entityTag: bodyTag});
      sewnBodies.push(body);
    }

    const unSewnBodies = [];
    for (const bodyTag of pkReturnValue.sewn_bodies) {
      const body = XcGmEntity.getObjFromTag({entityTag: bodyTag});
      unSewnBodies.push(body);
    }

    return {
      sewnBodies,
      unSewnBodies,
    };
  }

  extrude({direction, distance}) {
    //todo: validate options

    const options = new PK_BODY_extrude_o_t();
    options.end_bound.distance = distance;
    const params = {
      profile: this.tag,
      path: new XcGmPK_VECTOR_t({coord: direction.toArray()}),
      options,
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_extrude', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const body = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.body});
    return body;
  }

  spin({axis, angle}) {
    //todo: validate options

    const pkAxis1SF = XcGmPK_AXIS1_sf_t.fromXcGm3dAxis({axis});

    const params = {
      body: this.tag,
      axis: pkAxis1SF.toJSON(),
      angle: angle
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_spin', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  firstEdge() {
    const params = {
      body: this.tag,
    };
    const {error, pkReturnValue} = XcGmCallPkApi('BODY_ask_first_edge', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const firstEdge = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.first_edge});
    return firstEdge;
  }

  transform({matrix}) {
    const transfSF = XcGmPK_TRANSF_sf_t.fromXcGm3dMatrix({matrix});
    const transf = XcGmTransf.create({transfSF});

    const params = {
      body: this.tag,
      transf: transf.tag
    };

    const {error, returnValue} = XcGmCallPkApi('BODY_transform_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  unite({tools}) {
    const toolTags = [];
    for (const tool of tools) {
      toolTags.push(tool.tag);
    }

    const params = {
      target: this.tag,
      tools: toolTags,
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_unite_bodies', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = [];
    for (const bodyTag of pkReturnValue.bodies) {
      const body = XcGmEntity.getObjFromTag({entityTag: bodyTag});
      resultBodies.push(body);
    }

    return resultBodies;
  }

  boolean({tools, func}) {
    let PK_boolean_param = 0;
    if (func === XcGmBody.BooleanFunction.Intersection) {
      PK_boolean_param = PK_boolean_intersect_c;
    } else if (func === XcGmBody.BooleanFunction.Subtraction) {
      PK_boolean_param = PK_boolean_subtract_c;
    } else if (func === XcGmBody.BooleanFunction.Union) {
      PK_boolean_param = PK_boolean_unite_c;
    }

    const toolTags = [];
    for (const tool of tools) {
      toolTags.push(tool.tag);
    }

    const params = {
      target: this.tag,
      tools: toolTags,
      func: PK_boolean_param
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_boolean_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const resultBodies = [];
    for (const bodyTag of pkReturnValue.bodies) {
      const body = XcGmEntity.getObjFromTag({entityTag: bodyTag});
      resultBodies.push(body);
    }

    return resultBodies;
  }

  fixBlends() {
    const params = {
      body: this.tag
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_fix_blends', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  hollowFaces({faces, offset}) {
    const faceTags = [];
    for (const face of faces) {
      faceTags.push(face.tag);
    }

    const params = {
      body: this.tag,
      faces: faceTags,
      offset: offset
    };

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_hollow_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  imprintCurve({curve, bounds}) {
    const params = {
      body: this.tag,
      curve: curve.tag,
      bounds: []
    };

    for (const bound of bounds) {
      const pkBound = XcGmPK_INTERVAL_t.fromXcGmInterval({interval: bound});
      params.bounds.push(pkBound.toJSON());
    }

    const {error, pkReturnValue} = XcGmCallPkApi('BODY_imprint_curve', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    const newEdges = [];
    const newFaces = [];
    for (const newEdgeTag of pkReturnValue.new_edges) {
      newEdges.push(XcGmEntity.getObjFromTag({entityTag: newEdgeTag}));
    }
    for (const newFaceTag of pkReturnValue.new_faces) {
      newFaces.push(XcGmEntity.getObjFromTag({entityTag: newFaceTag}));
    }

    return {newEdges, newFaces};
  }

  toSTL() {
    const allRenderingFacetData = this.render_facet({resolution: 'high'});
    const stlFileContent = [];

    const vertices = [];
    const vertexNormals = [];
    const indices = [];
    let indexOffset = 0;

    for (const renderingFacetData of allRenderingFacetData) {
      if (renderingFacetData.type === 'L3TPFI') {
        // Facet plus normals plus parameters
        for (let i = 0; i < renderingFacetData.facets.length; i += 1) {
          // For each vertices in
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
          // For each vertices in
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

  findEdgeByPositions({position1, position2}) {
    const edges = this.edges;
    for (const edge of edges) {
      const {vertex1, vertex2} = edge.vertices;
      const positions = [vertex1.point.position, vertex2.point.position];
      const position1Found = positions.find(position => position.isEqualTo({position: position1}));
      const position2Found = positions.find(position => position.isEqualTo({position: position2}));
      if (position1Found && position2Found) {
        return edge;
      }
    }

    return null;
  }

  findEdgeByVertices({vertex1, vertex2}) {
    const edges = this.edges;
    for (const edge of edges) {
      const {v1, v2} = edge.vertices;
      if ((v1 === vertex1) && (v2 === vertex2)) {
        return edge;
      }
    }

    return null;
  }

  findFaceByPositions({positions}) {
    const foundFaces = [];

    // TODO

    return foundFaces;
  }

  findFaceByEdges({edges}) {
    const foundFaces = [];

    const faces = this.faces;
    for (const face of faces) {
      const edgesOfFace = face.edges;
      if (edges.every(edge => edgesOfFace.includes(edge))) {
        foundFaces.push(face);
      }
    }

    return foundFaces;
  }

  findFaceByVertices({vertices}) {
    const foundFaces = [];

    const faces = this.faces;
    for (const face of faces) {
      const verticesOfFace = face.vertices;
      if (vertices.every(vertex => verticesOfFace.includes(vertex))) {
        foundFaces.push(face);
      }
    }

    return foundFaces;
  }

  findVertex({callback}) {
    const vertices = this.vertices;
    return vertices.filter(callback);
  }

  findEdge({callback}) {
    const edges = this.edges;
    return edges.filter(callback);
  }

  findFace({callback}) {
    const faces = this.faces;
    return faces.filter(callback);
  }
}
