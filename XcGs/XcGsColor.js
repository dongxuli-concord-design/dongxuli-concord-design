class XcGsColor {
  r;
  g;
  b;

  constructor({r = 0, g = 0, b = 0} = {}) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static get Black() { return new XcGsColor({r: 0 / 255, g: 0 / 255, b: 0 / 255}); }
  static get White() { return new XcGsColor({r: 255 / 255, g: 255 / 255, b: 255 / 255}); }
  static get Red() { return new XcGsColor({r: 255 / 255, g: 0 / 255, b: 0 / 255}); }
  static get Lime() { return new XcGsColor({r: 0 / 255, g: 255 / 255, b: 0 / 255}); }
  static get Blue() { return new XcGsColor({r: 0 / 255, g: 0 / 255, b: 255 / 255}); }
  static get Yellow() { return new XcGsColor({r: 255 / 255, g: 255 / 255, b: 0 / 255}); }
  static get Cyan() { return new XcGsColor({r: 0 / 255, g: 255 / 255, b: 255 / 255}); }
  static get Aqua() { return new XcGsColor({r: 0 / 255, g: 255 / 255, b: 255 / 255}); }
  static get Magenta() { return new XcGsColor({r: 255 / 255, g: 0 / 255, b: 255 / 255}); }
  static get Fuchsia() { return new XcGsColor({r: 255 / 255, g: 0 / 255, b: 255 / 255}); }
  static get Silver() { return new XcGsColor({r: 192 / 255, g: 192 / 255, b: 192 / 255}); }
  static get Gray() { return new XcGsColor({r: 128 / 255, g: 128 / 255, b: 128 / 255}); }
  static get Maroon() { return new XcGsColor({r: 128 / 255, g: 0 / 255, b: 0 / 255}); }
  static get Olive() { return new XcGsColor({r: 128 / 255, g: 128 / 255, b: 0 / 255}); }
  static get Green() { return new XcGsColor({r: 0 / 255, g: 128 / 255, b: 0 / 255}); }
  static get Purple() { return new XcGsColor({r: 128 / 255, g: 0 / 255, b: 128 / 255}); }
  static get Teal() { return new XcGsColor({r: 0 / 255, g: 128 / 255, b: 128 / 255}); }
  static get Navy() { return new XcGsColor({r: 0 / 255, g: 0 / 255, b: 128 / 255}); }

  static fromJSON({json}) {
    return new XcGm3dPosition({r: json.r, g: json.g, b: json.b});
  }

  toString() {
    return `${this.r.toPrecision(2)}, ${this.g.toPrecision(2)}, ${this.b.toPrecision(2)}`;
  }

  toJSON() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    };
  }

  clone() {
    return new XcGsColor({r: this.r, g: this.g, b: this.b});
  }

  copy({other}) {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
  }

  set({r, g, b}) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
