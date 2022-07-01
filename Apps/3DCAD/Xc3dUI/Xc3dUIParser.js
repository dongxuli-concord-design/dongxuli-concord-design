class Xc3dUIParser {
  static parseInteger({string}) {
    const value = parseInt(string);
    XcSysAssert({assertion: !isNaN(value), message: 'Invalid integer'});
    return value;
  }

  static parseFloat({string}) {
    const value = parseFloat(string);
    XcSysAssert({assertion: !isNaN(value), message: 'Invalid float number'});
    return value;
  }

  // TODO: We can parse the value with the given unit after.
  static parseDistance({string}) {
    let value = parseFloat(string);
    XcSysAssert({assertion: !isNaN(value), message: 'Invalid distance'});
    value = Xc3dUIManager.computeStandardValueFromValueWithUnit({value});
    return value;
  }

  static parsePosition({string}) {
    let isRelative = false;
    if (string[0] === '@') {
      isRelative = true;
      string = string.substring(1);
    }

    //TODO: cylinder & sphere coordinates

    const coordinates = string.split(/,/);
    XcSysAssert({assertion: (coordinates.length === 2) || (coordinates.length === 3), message: 'Invalid format'});
    const x = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: parseFloat(coordinates[0])});
    const y = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: parseFloat(coordinates[1])});
    XcSysAssert({assertion: !isNaN(x) && !isNaN(y), message: 'Invalid format'});

    let z = 0;
    if (coordinates.length === 3) {
      z = Xc3dUIManager.computeStandardValueFromValueWithUnit({value: parseFloat(coordinates[2])});
      XcSysAssert({assertion: !isNaN(z), message: 'Invalid format'});
    }

    return {position: new XcGm3dPosition({x, y, z}), isRelative};
  }

  static parseScreenPosition({string}) {
    const coordinates = string.split(/,/);
    XcSysAssert({assertion: coordinates.length === 2, message: 'Invalid format'});
    const x = parseFloat(coordinates[0]);
    const y = parseFloat(coordinates[1]);
    XcSysAssert({assertion: !isNaN(x) && !isNaN(y), message: 'Invalid format'});
    return new XcGm2dVector({x, y});
  }

  static parseVector({string}) {
    const coordinates = string.split(/,/);
    XcSysAssert({assertion: coordinates.length === 3, message: 'Invalid format'});
    const x = parseFloat(coordinates[0]);
    const y = parseFloat(coordinates[1]);
    const z = parseFloat(coordinates[2]);
    XcSysAssert({assertion: !isNaN(x) && !isNaN(y) && !isNaN(z), message: 'Invalid format'});
    return new XcGm3dVector({x, y, z});
  }
}
