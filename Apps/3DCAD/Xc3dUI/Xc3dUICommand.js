class Xc3dUICommand {
  constructor({name, entry, icon = null, help = null, keywords=[]}) {
    this.icon = icon;
    this.name = name;
    this.entry = entry;
    this.help = help;
    this.keywords = keywords;
  }
}
