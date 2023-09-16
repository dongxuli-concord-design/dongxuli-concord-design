class XcGm3dMatrix {
  entry;

  constructor() {
    this.setToIdentity();
  }

  static get identity() {
    return new XcGm3dMatrix();
  }

  static #copyEntry({to, src}) {
    to[0][0] = src[0][0];
    to[0][1] = src[0][1];
    to[0][2] = src[0][2];
    to[0][3] = src[0][3];
    to[1][0] = src[1][0];
    to[1][1] = src[1][1];
    to[1][2] = src[1][2];
    to[1][3] = src[1][3];
    to[2][0] = src[2][0];
    to[2][1] = src[2][1];
    to[2][2] = src[2][2];
    to[2][3] = src[2][3];
  }

  static #matrixMuliply({A, B, i, j}) {
    return A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j] + A[i][3] * B[3][j];
  }

  static fromArray({array}) {
    const newMatrix = new XcGm3dMatrix();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; ++j) {
        newMatrix.entry[i][j] = array[i * 4 + j];
      }
    }

    return newMatrix;
  }

  static fromJSON({json}) {
    return XcGm3dMatrix.fromArray({array: json});
  }

  static multiply({matrix1, matrix2}) {
    const newMatrix = new XcGm3dMatrix();

    newMatrix.entry[0][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 0});
    newMatrix.entry[0][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 1});
    newMatrix.entry[0][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 2});
    newMatrix.entry[0][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 3});

    newMatrix.entry[1][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 0});
    newMatrix.entry[1][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 1});
    newMatrix.entry[1][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 2});
    newMatrix.entry[1][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 3});

    newMatrix.entry[2][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 0});
    newMatrix.entry[2][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 1});
    newMatrix.entry[2][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 2});
    newMatrix.entry[2][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 3});

    newMatrix.entry[3][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 0});
    newMatrix.entry[3][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 1});
    newMatrix.entry[3][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 2});
    newMatrix.entry[3][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 3});

    return newMatrix;
  }

  static translationMatrix({vector}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToTranslation({vector});
    return matrix;
  }

  static rotationMatrix({angle, axis}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToRotation({angle, axis});
    return matrix;
  }

  static scalingMatrix({scale, center}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  static mirroringOverPositionMatrix({position}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToMirroringOverPoint(position);
    return matrix;
  }

  static mirroringOverPlaneMatrix({line}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToMirroringOverPlane(line);
    return matrix;
  }

  static projection({plane, projectDirection}) {
    // TODO
  }

  static worldToPlane({plane}) {

  }

  static PlaneToWorld({plane}) {

  }

  static scaling({scale, center}) {
    const matrix = new XcGm3dMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  static mirroringOverPosition({position}) {
    // todo
  }

  static mirroringOverLine({line}) {
    // todo
  };

  static mirroringOverPlane({plane}) {
    // todo
  };

  static fromThreeMatrix4({threeMatrix4}) {
    const newMatrix = new XcGm3dMatrix();
    newMatrix.setToThreeMatrix4({threeMatrix4});
    return newMatrix;
  }

  static rotationMatrixFromEulerAngles({eulerAngles}) {
    // TODO
    const newMatrix = new XcGm3dMatrix();
    newMatrix.setToRotationMatrixFromEulerAngles({eulerAngles});
    return newMatrix;
  }

  setToThreeMatrix4({threeMatrix4}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; ++j) {
        this.entry[i][j] = threeMatrix4.elements[i + 4 * j];
      }
    }
  }

  toArray() {
    const entryArray = [];
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; ++j) {
        entryArray.push(this.entry[i][j]);
      }
    }
    return entryArray;
  }

  toJSON() {
    return this.toArray();
  }

  clone() {
    const newMatrix = new XcGm3dMatrix();
    XcGm3dMatrix.#copyEntry({to: newMatrix.entry, src: this.entry});
    return newMatrix;
  }

  copy({matrix}) {
    XcGm3dMatrix.#copyEntry({to: this.entry, src: matrix.entry});
  }

  get({row, column}) {
    return this.entry[row][column];
  }

  setToIdentity() {
    this.entry = [
      [],
      [],
      [],
      []
    ];
    this.entry[0][0] = 1;
    this.entry[0][1] = 0;
    this.entry[0][2] = 0;
    this.entry[0][3] = 0;
    this.entry[1][0] = 0;
    this.entry[1][1] = 1;
    this.entry[1][2] = 0;
    this.entry[1][3] = 0;
    this.entry[2][0] = 0;
    this.entry[2][1] = 0;
    this.entry[2][2] = 1;
    this.entry[2][3] = 0;
    this.entry[3][0] = 0;
    this.entry[3][1] = 0;
    this.entry[3][2] = 0;
    this.entry[3][3] = 1;
  }

  multiplyScalar({scale}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; ++j) {
        this.entry[i][j] *= scale;
      }
    }
  }

  multiply({matrix}) {
    const newMatrix = [
      [],
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 2});
    newMatrix[0][3] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 0, j: 3});

    newMatrix[1][0] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 2});
    newMatrix[1][3] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 1, j: 3});

    newMatrix[2][0] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 2});
    newMatrix[2][3] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 2, j: 3});

    newMatrix[3][0] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 3, j: 0});
    newMatrix[3][1] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 3, j: 1});
    newMatrix[3][2] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 3, j: 2});
    newMatrix[3][3] = XcGm3dMatrix.#matrixMuliply({A: this.entry, B: matrix.entry, i: 3, j: 3});

    XcGm3dMatrix.#copyEntry({to: this.entry, src: newMatrix});
  }

  preMultiply({matrix}) {
    const newMatrix = [
      [],
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 2});
    newMatrix[0][3] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 0, j: 3});

    newMatrix[1][0] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 2});
    newMatrix[1][3] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 1, j: 3});

    newMatrix[2][0] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 2});
    newMatrix[2][3] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 2, j: 3});

    newMatrix[3][0] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 3, j: 0});
    newMatrix[3][1] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 3, j: 1});
    newMatrix[3][2] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 3, j: 2});
    newMatrix[3][3] = XcGm3dMatrix.#matrixMuliply({A: matrix.entry, B: this.entry, i: 3, j: 3});

    XcGm3dMatrix.#copyEntry({to: this.entry, src: newMatrix});
  }

  setToProduct({matrix1, matrix2}) {
    this.entry[0][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 0});
    this.entry[0][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 1});
    this.entry[0][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 2});
    this.entry[0][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 3});

    this.entry[1][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 0});
    this.entry[1][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 1});
    this.entry[1][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 2});
    this.entry[1][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 3});

    this.entry[2][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 0});
    this.entry[2][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 1});
    this.entry[2][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 2});
    this.entry[2][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 3});

    this.entry[3][0] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 0});
    this.entry[3][1] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 1});
    this.entry[3][2] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 2});
    this.entry[3][3] = XcGm3dMatrix.#matrixMuliply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 3});
  }

  invert() {
    // http://www.cplusplus.com/forum/general/111115/
    // Numerical Recipes in C (2nd ed), http://apps.nrbook.com/c/index.html
    let indxc = [0, 0, 0, 0];
    let indxr = [0, 0, 0, 0];
    let ipiv = [0, 0, 0, 0];
    let i = 0;
    let icol = 0;
    let irow = 0;
    let j = 0;
    let k = 0;
    let l = 0;
    let ll = 0;
    let big = 0;
    let dum = 0;
    let pivinv = 0;
    let tmp = 0;
    let tmp2 = [];

    for (j = 0; j < 4; ++j) {
      ipiv[j] = 0;
    }

    for (i = 0; i < 4; i += 1) {
      big = 0.0;
      for (j = 0; j < 4; ++j) {
        if (ipiv[j] != 1) {
          for (k = 0; k < 4; ++k) {
            if (ipiv[k] == 0) {
              if (Math.abs(this.entry[j][k]) >= big) {
                big = Math.abs(this.entry[j][k]);
                irow = j;
                icol = k;
              }
            } else {
              if (ipiv[k] > 1) {
                XcGmAssert({assertion: false, message: 'Singular'});
              }
            }
          }
        }
      }

      ++ipiv[icol];

      if (irow != icol) {
        tmp2 = this.entry[irow];
        this.entry[irow] = this.entry[icol];
        this.entry[icol] = tmp2;
      }
      indxr[i] = irow;
      indxc[i] = icol;
      if (this.entry[icol][icol] == 0.0) {
        XcGmAssert({assertion: false, message: 'Singular'});
      }
      pivinv = 1.0 / this.entry[icol][icol];
      this.entry[icol][icol] = 1.0;

      for (l = 0; l < 4; ++l) {
        this.entry[icol][l] *= pivinv;
      }

      for (ll = 0; ll < 4; ++ll) {
        if (ll != icol) {
          dum = this.entry[ll][icol];
          this.entry[ll][icol] = 0.0;
          for (l = 0; l < 4; ++l) {
            this.entry[ll][l] -= this.entry[icol][l] * dum;
          }
        }
      }
    }
    for (l = 3; l >= 0; --l) {
      if (indxr[l] != indxc[l]) {
        for (k = 0; k < 4; ++k) {
          tmp = this.entry[k][indxr[l]];
          this.entry[k][indxr[l]] = this.entry[k][indxc[l]];
          this.entry[k][indxc[l]] = tmp;
        }
      }
    }
  }

  get inverse() {
    const inv = this.clone();
    inv.invert();

    return inv;
  }

  isSingular() {
    // todo
    return false;
  }

  transpose() {
    const transposedMatrix = new XcGm3dMatrix();
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j++) {
        transposedMatrix.entry[j][i] = this.entry[i][j];
      }
    }

    XcGm3dMatrix.#copyEntry({to: this.entry, src: transposedMatrix.entry});
  }

  transposition() {
    const transposedMatrix = this.clone();
    transposedMatrix.transpose();
    return transposedMatrix;
  }

  isEqualTo({matrix}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j++) {
        if (Math.abs(matrix.entry[i][j] - this.entry[i][j]) > XcGmContext.gTol.anglePrecision)
          return false;
      }
    }

    return true;
  }

  isUniScaledOrtho() {
    // TODO
  }

  isScaledOrtho() {
    // TODO
  }

  //http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  get determinant() {
    const m = this.entry;
    const value =
      m[0][3] * m[1][2] * m[2][1] * m[3][0] - m[0][2] * m[1][3] * m[2][1] * m[3][0] - m[0][3] * m[1][1] * m[2][2] * m[3][0] + m[0][1] * m[1][3] * m[2][2] * m[3][0] +
      m[0][2] * m[1][1] * m[2][3] * m[3][0] - m[0][1] * m[1][2] * m[2][3] * m[3][0] - m[0][3] * m[1][2] * m[2][0] * m[3][1] + m[0][2] * m[1][3] * m[2][0] * m[3][1] +
      m[0][3] * m[1][0] * m[2][2] * m[3][1] - m[0][0] * m[1][3] * m[2][2] * m[3][1] - m[0][2] * m[1][0] * m[2][3] * m[3][1] + m[0][0] * m[1][2] * m[2][3] * m[3][1] +
      m[0][3] * m[1][1] * m[2][0] * m[3][2] - m[0][1] * m[1][3] * m[2][0] * m[3][2] - m[0][3] * m[1][0] * m[2][1] * m[3][2] + m[0][0] * m[1][3] * m[2][1] * m[3][2] +
      m[0][1] * m[1][0] * m[2][3] * m[3][2] - m[0][0] * m[1][1] * m[2][3] * m[3][2] - m[0][2] * m[1][1] * m[2][0] * m[3][3] + m[0][1] * m[1][2] * m[2][0] * m[3][3] +
      m[0][2] * m[1][0] * m[2][1] * m[3][3] - m[0][0] * m[1][2] * m[2][1] * m[3][3] - m[0][1] * m[1][0] * m[2][2] * m[3][3] + m[0][0] * m[1][1] * m[2][2] * m[3][3];
    return value;
  }

  setTranslationVector({vector}) {
    this.entry[0][3] = vector.x;
    this.entry[1][3] = vector.y;
    this.entry[2][3] = vector.z;
  }

  get translationVector() {
    const vector = new XcGm3dVector();
    vector.x = this.entry[0][3];
    vector.y = this.entry[1][3];
    vector.z = this.entry[2][3];
    return vector;
  }

  setToTranslation({vector}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 3; j++) {
        this.entry[i][j] = (i == j) ? 1.0 : 0.0;
      }
    }

    this.entry[0][3] = vector.x;
    this.entry[1][3] = vector.y;
    this.entry[2][3] = vector.z;
    this.entry[3][3] = 1.0;
  }

  // http://blog.csdn.net/hlfkyo/article/details/5449960
  setToProjection({plane, projectDirection}) {
    // TODO
  }

  setToWorldToPlane({plane}) {

  }

  setToPlaneToWorld({plane}) {

  }

  setToRotation({angle, axis}) {
    const normalVec = axis.direction.clone().normal;

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const t = normalVec.x * axis.position.x + normalVec.y * axis.position.y + normalVec.z * axis.position.z;

    this.entry[0][0] = (1 - normalVec.x * normalVec.x) * cosAngle + normalVec.x * normalVec.x;
    this.entry[0][1] = (normalVec.x * normalVec.y) * (1 - cosAngle) - normalVec.z * sinAngle;
    this.entry[0][2] = (normalVec.x * normalVec.z) * (1 - cosAngle) + normalVec.y * sinAngle;
    this.entry[0][3] = (-t * normalVec.x + axis.position.x) * (1 - cosAngle) + (-normalVec.y * (-normalVec.z * t + axis.position.z) + normalVec.z * (-normalVec.y * t + axis.position.y)) * sinAngle;

    this.entry[1][0] = normalVec.x * normalVec.y * (1 - cosAngle) + normalVec.z * sinAngle;
    this.entry[1][1] = normalVec.y * normalVec.y * (1 - cosAngle) + cosAngle;
    this.entry[1][2] = normalVec.z * normalVec.y * (1 - cosAngle) - normalVec.x * sinAngle;
    this.entry[1][3] = (-t * normalVec.y + axis.position.y) * (1 - cosAngle) + (-normalVec.z * (axis.position.x - t * normalVec.x) + normalVec.x * (axis.position.z - t * normalVec.z)) * sinAngle;

    this.entry[2][0] = normalVec.x * normalVec.z * (1 - cosAngle) - normalVec.y * sinAngle;
    this.entry[2][1] = normalVec.y * normalVec.z * (1 - cosAngle) + normalVec.x * sinAngle;
    this.entry[2][2] = normalVec.z * normalVec.z * (1 - cosAngle) + cosAngle;
    this.entry[2][3] = (-t * normalVec.z + axis.position.z) * (1 - cosAngle) + (-normalVec.x * (axis.position.y - t * normalVec.y) + normalVec.y * (axis.position.x - t * normalVec.x)) * sinAngle;

    this.entry[3][0] = 0.0;
    this.entry[3][1] = 0.0;
    this.entry[3][2] = 0.0;
    this.entry[3][3] = 1.0;
  }

  setToNonUniformScaling({scaleX, scaleY, scaleZ, center}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 3; j++) {
        if (i === j) {
          if (j === 0) {
            this.entry[i][j] = scaleX;
          } else if (j === 1) {
            this.entry[i][j] = scaleY;
          } else if (j === 2) {
            this.entry[i][j] = scaleZ;
          }
        } else {
          this.entry[i][j] = 0.0;
        }
      }
    }

    this.entry[0][3] = (1 - scaleX) * center.x;
    this.entry[1][3] = (1 - scaleY) * center.y;
    this.entry[2][3] = (1 - scaleZ) * center.z;
    this.entry[3][3] = 1.0;
  }

  setToScaling({scale, center}) {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 3; j++) {
        this.entry[i][j] = (i == j) ? scale : 0.0;
      }
    }

    const ks = 1 - scale;
    this.entry[0][3] = ks * center.x;
    this.entry[1][3] = ks * center.y;
    this.entry[2][3] = ks * center.z;
    this.entry[3][3] = 1.0;
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

  toThreeMatrix4() {
    const threeMatrix = new THREE.Matrix4();
    threeMatrix.set(
      this.entry[0][0], this.entry[0][1], this.entry[0][2], this.entry[0][3],
      this.entry[1][0], this.entry[1][1], this.entry[1][2], this.entry[1][3],
      this.entry[2][0], this.entry[2][1], this.entry[2][2], this.entry[2][3],
      this.entry[3][0], this.entry[3][1], this.entry[3][2], this.entry[3][3]
    );

    return threeMatrix;
  }

  setToRotationMatrixFromEulerAngles({eulerAngles}) {
    // TODO

    const threeMatrix4 = this.toThreeMatrix4();
    const threeEulerAngles = new THREE.Euler(eulerAngles.x, eulerAngles.y, eulerAngles.z, eulerAngles.order);
    threeMatrix4.makeRotationFromEuler(threeEulerAngles);
    this.setToThreeMatrix4({threeMatrix4});
  }

  /**
   * linear interpolation of position and orientation. The matrices are assumed to be transform matrices, i.e. rotation
   * and translation only
   *
   * @targetMatrix target matrix
   * @scale        interpolation parameter, expected range from 0 to 1, the result is a weighted average
   *               if scale=0, the result is the current matrix; if scale=1, the result is targetMatrix
   *  */
  lerpTo({targetMatrix, scale}) {

    // The lerp of translation
    const sourceVector = this.translationVector();
    const targetVector = targetMatrix.translationVector();
    let lerpVector = XcGm3dVector.multiply({vector:sourceVector, scale: 1 - scale});
    lerpVector.add({vector: XcGm3dVector.multiply({vector:targetVector,scale})});

    // The lerp of orientation
    const sourceQuaternion = XcGmQuaternion.fromRotationMatrix({matrix:this});
    const targetQuaternion = XcGmQuaternion.fromRotationMatrix({matrix:targetMatrix});
    let lerpQuaternion = sourceQuaternion.lerpTo({target: targetQuaternion, exponent:scale});

    // The lerp of orientation and translatioin
    let lerpMatrix = lerpQuaternion.matrix;
    lerpMatrix.setToTranslation({vector:lerpVector});
    return lerpMatrix;
  }

  // todo: Other useful functions
}
