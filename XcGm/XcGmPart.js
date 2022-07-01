class XcGmPart extends XcGmTopology {
  constructor() {
    super();
  }

  static transmitToData({parts}) {
    const partTags = [];
    for (const part of parts) {
      partTags.push(part.tag);
    }
    const params = {
      parts: partTags
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_transmit_b', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return pkReturnValue.base64_encoded_data;
  }

  static transmitToFile({parts, path}) {
    const partTags = [];
    for (const part of parts) {
      partTags.push(part.tag);
    }
    const params = {
      parts: partTags,
      key: path
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_transmit', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

  }

  static receiveFromData({data}) {
    const params = {
      data: data
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_receive_b', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const parts = [];
    for (const partTag of pkReturnValue.parts) {
      const part = XcGmEntity.getObjFromTag({entityTag: partTag});
      parts.push(part);
    }
    return parts;
  }

  static receiveFromFile({fileName}) {
    const params = {
      key: fileName.replace(/\.[^/.]+$/, "")
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_receive', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const parts = [];
    for (const partTag of pkReturnValue.parts) {
      const part = XcGmEntity.getObjFromTag({entityTag: partTag});
      parts.push(part);
    }
    return parts;
  }

  findEntityByIdent({identifier, cls}) {
    const params = {
      part: this.tag,
      class: cls,
      identifier: identifier
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_find_entity_by_ident', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const entity = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.entity});
    return entity;
  }
}
