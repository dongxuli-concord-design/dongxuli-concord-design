class XcGmBody extends XcGmPart {

  static BODY_TYPE = {
    MINIMUM: Symbol('MINIMUM'),
    ACORN: Symbol('ACORN'),
    WIRE: Symbol('WIRE'),
    SHEET: Symbol('SHEET'),
    SOLID: Symbol('SOLID'),
    GENERAL: Symbol('GENERAL'),
    UNSPECIFIED: Symbol('UNSPECIFIED'),
    EMPTY: Symbol('EMPTY'),
    COMPOUND: Symbol('COMPOUND')
  };

  static BOOLEAN_FUNCTION = {
    INTERSECTION: Symbol('INTERSECTION'),
    SUBTRACTION: Symbol('SUBTRACTION'),
    UNION: Symbol('UNION')
  };

  constructor() {
    super();
  }

  get faces() {
  }

  get edges() {
  }

  get vertices() {
  }

  get type() {
  }

  static createMinimumBody({position}) {

  }

  static createSolidBlock({x, y, z, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSolidCone({radius, height, semiAngle, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSolidCylinder({radius, height, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSolidPrism({radius, height, sides, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSolidSphere({radius, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSolidTorus({majorRadius, minorRadius, coordinateSystem = new XcGmCoordinateSystem()}) {
  }

  static createSheetCircle({radius, coordinateSystem = new XcGmCoordinateSystem()}) {
  };

  extrudeAlong({direction, options}) {
  }

  spinAround({axis, angle}) {
  }

  transformBy({matrix}) {
  }

  boolean({tools, func}) {
  }

  fixBlends() {
  }

  hollowFaces({faces, offset}) {
  }

  imprintCurve({curve, bounds}) {
  }

  findVertexByPosition({position}) {
    let vertices = this.vertices;
    for (const vertex of vertices) {
      let point = vertex.point;
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

  findEdgeByVertices({vertex1, vertex2}) {
    let edges = this.edges;
    for (const edge of edges) {
      let {v1, v2} = edge.vertices;
      if ((v1 === vertex1) && (v2 === vertex2)) {
        return edge;
      }
    }

    return null;
  }

  findFaceByPositions({positions}) {
    let foundFaces = [];

    // TODO

    return foundFaces;
  }

  findFaceByEdges({edges}) {
    let foundFaces = [];

    let faces = this.faces;
    for (const face of faces) {
      let edgesOfFace = face.edges;
      if (edges.every(edge => edgesOfFace.includes(edge))) {
        foundFaces.push(face);
      }
    }

    return foundFaces;
  }

  findFaceByVertices({vertices}) {
    let foundFaces = [];

    let faces = this.faces;
    for (const face of faces) {
      let verticesOfFace = face.vertices;
      if (vertices.every(vertex => verticesOfFace.includes(vertex))) {
        foundFaces.push(face);
      }
    }

    return foundFaces;
  }

  findVertexWithFilter({callback}) {
    let vertices = this.vertices;
    return vertices.filter(callback);
  }

  findEdgeWithFilter({callback}) {
    let edges = this.edges;
    return edges.filter(callback);
  }

  findFaceWithFilter({callback}) {
    let faces = this.faces;
    return faces.filter(callback);
  }
}
