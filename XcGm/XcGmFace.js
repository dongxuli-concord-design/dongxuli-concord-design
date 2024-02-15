class XcGmFace extends XcGmTopology {
  constructor() {
    super();
  }

  get surf() {
  }

  get UVBox() {
  }

  get body() {
  }

  get edges() {
  }

  get vertices() {
  }

  static delete({faces}) {
  }

  static transform({facesAndMatrices, tolerance}) {
  }

  surfAndOrientation() {
  }

  attachSurfFitting({localCheck}) {
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

  findEdgeByVertex(vertex) {
    let foundEdges = [];
    let edges = this.edges;
    for (const edge of edges) {
      let {v1, v2} = edge.vertices;
      if ((v1 === vertex1) || (v2 === vertex2)) {
        foundEdges.push(edge);
      }
    }

    return foundEdges;
  }

  findEdgeByTwoVertices({vertex1, vertex2}) {
    let edges = this.edges;
    for (const edge of edges) {
      let {v1, v2} = edge.vertices;
      if ((v1 === vertex1) && (v2 === vertex2)) {
        return edge;
      }
    }

    return null;
  }

  findVertexWithFilter({callback}) {
    let vertices = this.vertices;
    return vertices.filter(callback);
  }

  findEdgeWithFilter({callback}) {
    let edges = this.edges;
    return edges.filter(callback);
  }
}
