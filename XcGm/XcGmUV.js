class XcGmUV {
  u;
  v;

  constructor({u, v}) {
    this.u = u;
    this.v = v;
  }

  static fromJSON({json}) {
    let uv = new XcGmUV({u: json.u, v: json.v});
    return uv;
  }

  toJSON() {
    return {
      u: this.u,
      v: this.v,
    }
  }
}
