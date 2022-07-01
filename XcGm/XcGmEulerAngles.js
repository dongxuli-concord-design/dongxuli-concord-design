class XcGmEulerAngles {
  //TODO

  x;
  y;
  z;
  order;

  constructor({x = 0, y = 0, z = 0, order = 'XYZ'}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  static fromRotationMatrix({matrix}) {
    // TODO

    const newEulerAngles = new XcGmEulerAngles(this.x, this.y, this.z, this.order);
    newEulerAngles.setFromRotationMatrix({matrix});
    return newEulerAngles;
  }

  setFromRotationMatrix({matrix}) {
    // TODO

    const threeMatrix4 = matrix.toThreeMatrix4();
    const threeEuler = new THREE.Euler(this.x, this.y, this.z, this.order);
    threeEuler.setFromRotationMatrix(threeMatrix4);

    this.x = threeEuler.x;
    this.y = threeEuler.y;
    this.z = threeEuler.z;
  }
}