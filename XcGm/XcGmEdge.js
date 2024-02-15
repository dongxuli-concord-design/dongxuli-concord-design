class XcGmEdge extends XcGmTopology {
  constructor() {
    super();
  }

  get body() {
  }

  get curve() {
  }

  get faces() {
  }

  get vertices() {
  }

  static makeFacesFrom({edges, senses, sharedLoop}) {
  }

  static setBlendConstant({edges, radius}) {
  }

  findInterval() {
  }

  containsVector({vector}) {
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

  findVertexWithFilter({callback}) {
    let vertices = this.vertices;
    return vertices.filter(callback);
  }
}
