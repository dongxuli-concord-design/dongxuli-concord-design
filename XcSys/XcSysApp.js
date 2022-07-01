class XcSysApp {
  name;
  description;
  icon;
  entry;

  constructor({entry, name = '', description = '', icon = null} = {}) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.entry = entry;
  }

  static init() {
  }
}
