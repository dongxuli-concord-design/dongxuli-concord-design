class XcGmPart extends XcGmTopology {
  constructor() {
    super();
  }

  static transmitToData({parts}) {
    const partTags = parts.map(part => part._pkTag);
    const params = {
      parts: partTags
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_transmit_b', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    return pkReturnValue.base64_encoded_data;
  }

  static transmitToFile({parts, path}) {
    const partTags = parts.map(part => part._pkTag);
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
    const parts = pkReturnValue.parts.map(partTag => XcGmEntity._getPkObjectFromPkTag({entityTag: partTag}));
    return parts;
  }

  static receiveFromFile({fileName}) {
    const params = {
      key: fileName.replace(/\.[^/.]+$/, "")
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_receive', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const parts = pkReturnValue.parts.map(partTag => XcGmEntity._getPkObjectFromPkTag({entityTag: partTag}));
    return parts;
  }

  findEntityByIdent({identifier, cls}) {
    const params = {
      part: this._pkTag,
      class: cls,
      identifier: identifier
    };

    const {error, pkReturnValue} = XcGmCallPkApi('PART_find_entity_by_ident', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const entity = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.entity});
    return entity;
  }
}
