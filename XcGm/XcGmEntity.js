class XcGmEntity {
  uuid;

  constructor() {
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    this.uuid = uuidv4();

    this.userData = {};
  }

  static getObjFromTag({entityTag}) {
    if (0 === entityTag) {
      return null;
    }

    if (XcGmEntity.tagObjMap[entityTag]) {
      return XcGmEntity.tagObjMap[entityTag];
    } else {
      return null;
    }
  }

  toJSON() {
    return {
      userData: this.userData
    };
  }

  clone() {
  }
}
