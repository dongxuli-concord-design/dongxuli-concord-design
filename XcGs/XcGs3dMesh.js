class XcGs3dMesh extends XcGs3dObject {
  vertices;
  texture;
  material;
  constructor({vertices = [], texture = null, material = new XcGsMeshMaterial()}) {
    super();
    this.vertices = [...vertices];
    this.texture = texture;
    this.material = material;
  }
}
