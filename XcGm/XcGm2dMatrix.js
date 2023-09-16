
class XcGm2dMatrix {
  entry;

  constructor() {
    this.setToIdentity();
  }

  static get identity() {
    const identity = new XcGm2dMatrix();
    identity.setToIdentity();
    return identity;
  }

  static #copyEntry({to, src}) {
    to[0][0] = src[0][0];
    to[0][1] = src[0][1];
    to[0][2] = src[0][2];
    to[1][0] = src[1][0];
    to[1][1] = src[1][1];
    to[1][2] = src[1][2];
    to[2][0] = src[2][0];
    to[2][1] = src[2][1];
    to[2][2] = src[2][2];
  }

  static #matrixMuliply({A, B, i, j}) {
    return A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
  }

  static fromArray({array}) {
    const newMatrix = new XcGm2dMatrix();

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        newMatrix.entry[i][j] = array[i * 3 + j];
      }
    }

    return newMatrix;
  }

  static fromJSON({json}) {
    return XcGm2dMatrix.fromArray({array: json});
  }

  static multiply({matrix1, matrix2}) {
    const product = new XcGm2dMatrix();

    const m1 = matrix1.entry;
    const m2 = matrix2.entry;
    const n = product.entry;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        n[i][j] = XcGm2dMatrix.#matrixMuliply({A: m1, B: m2, i: i, j: j});
      }
    }

    return product;
  }

  static translationMatrix({vector}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToTranslation({vector});
    return matrix;
  }

  static rotationMatrix({angle}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToRotation({angle});
    return matrix;
  }

  static rotationMatrix({angle, center}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToRotation({angle, center});
    return matrix;
  }

  static scalingMatrix({scale, center}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  static mirroringOverPositionMatrix({position}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToMirroringOverPoint(position);
    return matrix;
  }

  static mirroringOverPlaneMatrix({line}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToMirroringOverPlane(line);
    return matrix;
  }

  static scaling({scale, center}) {
    const matrix = new XcGm2dMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  static mirroringOverPosition({position}) {
    return this.rotationMatrix({angle: Math.PI, center: position});
  }

  static mirroringOverLine({line}) {
    // todo
  };

  static mirroringOverPlane({plane}) {
    // todo
  };

  toArray() {
    const entryArray = [];
    for (let i = 0; i < 3; ++i) {
      entryArray.push(...this.entry[i]);
    }
    return entryArray;
  }

  toJSON() {
    return this.toArray();
  }

  clone() {
    const newMatrix = new XcGm2dMatrix();
    XcGm2dMatrix.#copyEntry({to: newMatrix.entry, src: this.entry});
    return newMatrix;
  }

  copy({matrix}) {
    XcGm2dMatrix.#copyEntry({to: this.entry, src: matrix.entry});
  }

  get({row, column}) {
    return this.entry[row][column];
  }

  setToIdentity() {
    this.entry = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  multiplyScalar({scale}) {
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        this.entry[i][j] *= scale;
      }
    }
  }

  multiply({matrix}) {
    const newMatrix = [
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 2});

    newMatrix[1][0] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 2});

    newMatrix[2][0] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm2dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 2});

    XcGm2dMatrix.#copyEntry({to: this.entry, src: newMatrix});
  }

  preMultiply({matrix}) {
    const newMatrix = [
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 2});

    newMatrix[1][0] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 2});

    newMatrix[2][0] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm2dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 2});

    XcGm2dMatrix.#copyEntry({to: this.entry, src: newMatrix});
  }

  setToProduct({matrix1, matrix2}) {
    this.entry[0][0] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 0});
    this.entry[0][1] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 1});
    this.entry[0][2] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 2});

    this.entry[1][0] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 0});
    this.entry[1][1] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 1});
    this.entry[1][2] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 2});

    this.entry[2][0] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 0});
    this.entry[2][1] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 1});
    this.entry[2][2] = XcGm2dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 2});
  }

  invert() {
    XcGmAssert({assertion: !this.isSingular(), message: 'Singular'});
    this.copy({matrix: this.inverse});
  }

  get inverse() {
    XcGmAssert({assertion: !this.isSingular(), message: 'Singular'});

    const inv = this.clone();
    const det = this.determinant;

    const invDet = 1 / det;

    // inverse matrix by Laplace expansion
    inv.entry[0][0] = invDet * (this.entry[1][1] * this.entry[2][2] - this.entry[1][2] * this.entry[2][1]);
    inv.entry[0][1] = invDet * (this.entry[1][2] * this.entry[2][0] - this.entry[1][0] * this.entry[2][2]);
    inv.entry[0][2] = invDet * (this.entry[1][0] * this.entry[2][1] - this.entry[1][1] * this.entry[2][0]);

    inv.entry[1][0] = invDet * (this.entry[0][2] * this.entry[2][1] - this.entry[0][1] * this.entry[2][2]);
    inv.entry[1][1] = invDet * (this.entry[0][0] * this.entry[2][2] - this.entry[0][2] * this.entry[2][0]);
    inv.entry[1][2] = invDet * (this.entry[0][1] * this.entry[2][0] - this.entry[0][0] * this.entry[2][1]);

    inv.entry[2][0] = invDet * (this.entry[0][1] * this.entry[1][2] - this.entry[0][2] * this.entry[1][1]);
    inv.entry[2][1] = invDet * (this.entry[0][2] * this.entry[1][0] - this.entry[0][0] * this.entry[1][2]);
    inv.entry[2][2] = invDet * (this.entry[0][0] * this.entry[1][1] - this.entry[0][1] * this.entry[1][0]);

    return inv;
  }

  isSingular() {
    const det = this.determinant;
    return Math.abs(det) < XcGmContext.gTol.anglePrecision;
  }

  transpose() {
    for (let i = 0; i < 2; i++) {
      for (let j = i + 1; j < 3; j++) {
        // in-place transpose
        [this.entry[i][j], this.entry[j][i]] = [this.entry[j][i], this.entry[i][j]];
      }
    }
  }

  transposition() {
    const transposedMatrix = this.clone();
    transposedMatrix.transpose();
    return transposedMatrix;
  }

  isEqualTo({matrix}) {
    const isEqual = (a, b) => a.every((v, i) => Math.abs(a - b[i]) < XcGmContext.gTol.anglePrecision);
    return isEqual(this.toArray(), matrix.toArray());
  }

  isUniScaledOrtho() {
    // TODO
  }

  isScaledOrtho() {
    // TODO
  }

  get determinant() {
    const m = this.entry;
    const value =
      m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[1][0] * m[2][1] * m[0][2]
    - m[0][2] * m[1][1] * m[2][0] - m[0][1] * m[1][0] * m[2][2] - m[0][0] * m[2][1] * m[1][2];
    return value;
  }

  setTranslationVector({vector}) {
    const m = this.entry;
    [m[0][2], m[1][2]] = [vector.x, vector.y];
  }

  translationVector() {
    const m = this.entry;
    return new XcGm2dVector({x: m[0][2], y: m[1][2]});
  }

  setToTranslation({vector}) {
    this.setToIdentity();
    this.setTranslationVector({vector});
  }

  setToRotation({center, angle}) {
    this.setToRotation({angle});

    // Rotating(matrix R) around a center(position: T) is equivalent to
    // 1. rotating around origin, R;
    // 2. followed by shifting T - R*T
    const vector = new XcGm2dVector({x: - center.x, y: - center.y});
    vector.transform({matrix: this});
    vector.add({vector: center});

    this.setTranslationVector({vector});
  }

  setToRotation({angle}) {
    this.setToIdentity();

    const m = this.entry;

    m[0][0] = Math.cos(angle);
    m[0][1] = - Math.sin(angle);

    m[1][0] = Math.sin(angle);
    m[1][1] = Math.cos(angle);
  }

  setToNonUniformScaling({scaleX, scaleY, center}) {
    this.setToIdentity();

    const m = this.entry;

    m[0][0] = scaleX;
    m[1][1] = scaleY;

    m[0][2] = (1 - scaleX) * center.x;
    m[1][2] = (1 - scaleY) * center.y;
  }

  setToScaling({scale, center}) {
    this.setToIdentity();

    const m = this.entry;

    m[0][0] = scale;
    m[1][1] = scale;

    const ks = 1 - scale;
    this.entry[0][2] = ks * center.x;
    this.entry[1][2] = ks * center.y;
  }

  setToMirroringOverPosition({position}) {
    // todo
  }

  setToMirroringOverLine({line}) {
    // todo
  };

  setToMirroringOverPlane({plane}) {
    // todo
  };

  // todo: Other useful functions
}
