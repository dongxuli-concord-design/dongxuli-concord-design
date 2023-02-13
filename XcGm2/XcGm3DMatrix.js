class XcGm3DMatrix {
  entry;

  constructor() {
    this.setToIdentity();
  }

  static get identity() {
    return new XcGm3DMatrix();
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

  static #matrixMultiply({A, B, i, j}) {
    return A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j] + A[i][3] * B[3][j];
  }

  static #setZero({entry}) {
    entry[0][0] = 0;
    entry[0][1] = 0;
    entry[0][2] = 0;
    entry[0][3] = 0;
    entry[1][0] = 0;
    entry[1][1] = 0;
    entry[1][2] = 0;
    entry[1][3] = 0;
    entry[2][0] = 0;
    entry[2][1] = 0;
    entry[2][2] = 0;
    entry[2][3] = 0;
  }

  static fromArray({array}) {
    let newMatrix = new XcGm3DMatrix();

    let i = 0;
    let j = 0;
    for (i = 0; i < 4; ++i) {
      for (j = 0; j < 4; ++j) {
        newMatrix.entry[i][j] = array[i * 4 + j];
      }
    }

    return newMatrix;
  }

  static fromJSON({json}) {
    return XcGm3DMatrix.fromArray({array: json});
  }

  static multiplication({matrix1, matrix2}) {
    let newMatrix = new XcGm3DMatrix();

    newMatrix.entry[0][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 0});
    newMatrix.entry[0][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 1});
    newMatrix.entry[0][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 2});
    newMatrix.entry[0][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 3});

    newMatrix.entry[1][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 0});
    newMatrix.entry[1][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 1});
    newMatrix.entry[1][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 2});
    newMatrix.entry[1][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 3});

    newMatrix.entry[2][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 0});
    newMatrix.entry[2][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 1});
    newMatrix.entry[2][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 2});
    newMatrix.entry[2][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 3});

    newMatrix.entry[3][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 0});
    newMatrix.entry[3][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 1});
    newMatrix.entry[3][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 2});
    newMatrix.entry[3][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 3});

    return newMatrix;
  }

  static translationMatrix({vector}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToTranslation({vector});
    return matrix;
  }

  static rotationMatrix({angle, axis}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToRotation({angle, axis});
    return matrix;
  }

  static scalingMatrix({scale, center}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  static mirroringOverPositionMatrix({position}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToMirroringOverPoint(position);
    return matrix;
  }

  static mirroringOverPlaneMatrix({line}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToMirroringOverPlane(line);
    return matrix;
  }

  toArray() {
    let entryArray = [];
    let i = 0;
    let j = 0;
    for (i = 0; i < 4; ++i) {
      for (j = 0; j < 4; ++j) {
        entryArray.push(this.entry[i][j]);
      }
    }
    return entryArray;
  }

  toJSON() {
    return this.toArray();
  }

  clone() {
    let newMatrix = new XcGm3DMatrix();
    XcGm3DMatrix.#copyEntry({to: newMatrix.entry, src: this.entry});
    return newMatrix;
  }

  assignFrom({other}) {
    XcGm3DMatrix.#copyEntry({to: this.entry, src: other.entry});
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

    return this;
  }

  multiplyScalar({scale}) {
    let i = 0;
    let j = 0;

    for (i = 0; i < 4; ++i) {
      for (j = 0; j < 4; ++j) {
        this.entry[i][j] *= scale;
      }
    }
  }

  multiply({matrix}) {
    let newMatrix = [
      [],
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 2});
    newMatrix[0][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 3});

    newMatrix[1][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 2});
    newMatrix[1][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 3});

    newMatrix[2][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 2});
    newMatrix[2][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 3});

    newMatrix[3][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 0});
    newMatrix[3][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 1});
    newMatrix[3][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 2});
    newMatrix[3][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 3});

    XcGm3DMatrix.#copyEntry({to: this.entry, src: newMatrix});

    return this;
  }

  preMultBy({matrix}) {
    let newMatrix = [
      [],
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 0, j: 2});
    newMatrix[0][3] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 0, j: 3});

    newMatrix[1][0] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 1, j: 2});
    newMatrix[1][3] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 1, j: 3});

    newMatrix[2][0] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 2, j: 2});
    newMatrix[2][3] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 2, j: 3});

    newMatrix[3][0] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 3, j: 0});
    newMatrix[3][1] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 3, j: 1});
    newMatrix[3][2] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 3, j: 2});
    newMatrix[3][3] = XcGm3DMatrix.#matrixMultiply({A: matrix.entry, B: this.entry, i: 3, j: 3});

    XcGm3DMatrix.#copyEntry({to: this.entry, src: newMatrix});

    return this;
  }

  postMultBy({matrix}) {
    let newMatrix = [
      [],
      [],
      [],
      []
    ];

    newMatrix[0][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 0});
    newMatrix[0][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 1});
    newMatrix[0][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 2});
    newMatrix[0][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 0, j: 3});

    newMatrix[1][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 0});
    newMatrix[1][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 1});
    newMatrix[1][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 2});
    newMatrix[1][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 1, j: 3});

    newMatrix[2][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 0});
    newMatrix[2][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 1});
    newMatrix[2][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 2});
    newMatrix[2][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 2, j: 3});

    newMatrix[3][0] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 0});
    newMatrix[3][1] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 1});
    newMatrix[3][2] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 2});
    newMatrix[3][3] = XcGm3DMatrix.#matrixMultiply({A: this.entry, B: matrix.entry, i: 3, j: 3});

    XcGm3DMatrix.#copyEntry({to: this.entry, src: newMatrix});
    return this;
  }

  setToProduct({matrix1, matrix2}) {
    this.entry[0][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 0});
    this.entry[0][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 1});
    this.entry[0][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 2});
    this.entry[0][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 0, j: 3});

    this.entry[1][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 0});
    this.entry[1][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 1});
    this.entry[1][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 2});
    this.entry[1][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 1, j: 3});

    this.entry[2][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 0});
    this.entry[2][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 1});
    this.entry[2][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 2});
    this.entry[2][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 2, j: 3});

    this.entry[3][0] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 0});
    this.entry[3][1] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 1});
    this.entry[3][2] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 2});
    this.entry[3][3] = XcGm3DMatrix.#matrixMultiply({A: matrix1.entry, B: matrix2.entry, i: 3, j: 3});

    return this;
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
    let temp = 0;
    let temp2 = [];

    for (j = 0; j < 4; ++j) {
      ipiv[j] = 0;
    }

    for (i = 0; i < 4; ++i) {
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
                throw 'Inv4DSingular';
              }
            }
          }
        }
      }

      ++ipiv[icol];

      if (irow != icol) {
        temp2 = this.entry[irow];
        this.entry[irow] = this.entry[icol];
        this.entry[icol] = temp2;
      }
      indxr[i] = irow;
      indxc[i] = icol;
      if (this.entry[icol][icol] == 0.0) {
        throw 'Inv4DSingular';
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
          temp = this.entry[k][indxr[l]];
          this.entry[k][indxr[l]] = this.entry[k][indxc[l]];
          this.entry[k][indxc[l]] = temp;
        }
      }
    }
    return this;
  }

  inverse() {
    let inv = this.clone();
    inv.invert();

    return inv;
  }

  isSingular() {
    // todo
    return false;
  }

  transposeIt() {
    let tmpMat = new XcGm3DMatrix();
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        tmpMat.entry[j][i] = this.entry[i][j];

    XcGm3DMatrix.#copyEntry({to: this.entry, src: tmpMat.entry});
    return this;
  }

  transpose() {
    let tmpMat = new XcGm3DMatrix();
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        tmpMat.entry[j][i] = this.entry[i][j];

    return tmpMat;
  }

  isEqualTo({matrix}) {
    for (let i = 0; i < 4; i++) {
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
  determinant() {
    let m = this.entry;
    let value =
      m[0][3] * m[1][2] * m[2][1] * m[3][0] - m[0][2] * m[1][3] * m[2][1] * m[3][0] - m[0][3] * m[1][1] * m[2][2] * m[3][0] + m[0][1] * m[1][3] * m[2][2] * m[3][0] +
      m[0][2] * m[1][1] * m[2][3] * m[3][0] - m[0][1] * m[1][2] * m[2][3] * m[3][0] - m[0][3] * m[1][2] * m[2][0] * m[3][1] + m[0][2] * m[1][3] * m[2][0] * m[3][1] +
      m[0][3] * m[1][0] * m[2][2] * m[3][1] - m[0][0] * m[1][3] * m[2][2] * m[3][1] - m[0][2] * m[1][0] * m[2][3] * m[3][1] + m[0][0] * m[1][2] * m[2][3] * m[3][1] +
      m[0][3] * m[1][1] * m[2][0] * m[3][2] - m[0][1] * m[1][3] * m[2][0] * m[3][2] - m[0][3] * m[1][0] * m[2][1] * m[3][2] + m[0][0] * m[1][3] * m[2][1] * m[3][2] +
      m[0][1] * m[1][0] * m[2][3] * m[3][2] - m[0][0] * m[1][1] * m[2][3] * m[3][2] - m[0][2] * m[1][1] * m[2][0] * m[3][3] + m[0][1] * m[1][2] * m[2][0] * m[3][3] +
      m[0][2] * m[1][0] * m[2][1] * m[3][3] - m[0][0] * m[1][2] * m[2][1] * m[3][3] - m[0][1] * m[1][0] * m[2][2] * m[3][3] + m[0][0] * m[1][1] * m[2][2] * m[3][3];
    return value;
  }

  setTranslation({vector}) {
    this.entry[0][3] = vector.x;
    this.entry[1][3] = vector.y;
    this.entry[2][3] = vector.z;
    return this;
  }

  static translation({vector}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToTranslation({vector});
    return matrix;
  }

  translationVector() {
    let vector = new XcGm3DVector();
    vector.x = this.entry[0][3];
    vector.y = this.entry[1][3];
    vector.z = this.entry[2][3];
    return vector;
  }

  setToTranslation({vector}) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        this.entry[i][j] = (i == j) ? 1.0 : 0.0;
      }
    }

    this.entry[0][3] = vector.x;
    this.entry[1][3] = vector.y;
    this.entry[2][3] = vector.z;
    this.entry[3][3] = 1.0;

    return this;
  }


  // http://blog.csdn.net/hlfkyo/article/details/5449960
  setToProjection({plane, projectDirection}) {
    // TODO
  }

  static projection({plane, projectDirection}) {
    // TODO
  }

  setToWorldToPlane({plane}) {

  }

  static worldToPlane({plane}) {

  }

  setToPlaneToWorld({plane}) {

  }

  static PlaneToWorld({plane}) {

  }

  setToRotation({angle, axis}) {
    let normalVec = axis.direction.clone();
    normalVec.normalize();

    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);

    let t = normalVec.x * axis.position.x + normalVec.y * axis.position.y + normalVec.z * axis.position.z;

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

    return this;
  }

  static rotation({angle, axis}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToRotation({angle, axis});
    return matrix;
  }

  setToNonUniformScaling({scaleX, scaleY, scaleZ, center}) {
    for (let i = 0; i < 4; i++) {
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

    return this;
  }

  setToScaling({scale, center}) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        this.entry[i][j] = (i == j) ? scale : 0.0;
      }
    }

    let ks = 1 - scale;
    this.entry[0][3] = ks * center.x;
    this.entry[1][3] = ks * center.y;
    this.entry[2][3] = ks * center.z;
    this.entry[3][3] = 1.0;

    return this;
  }

  static scaling({scale, center}) {
    let matrix = new XcGm3DMatrix();
    matrix.setToScaling({scale, center});
    return matrix;
  }

  setToMirroringOverPosition({position}) {
    // todo

    return this;
  }

  static mirroringOverPosition({position}) {
    // todo
  }

  setToMirroringOverLine({line}) {
    // todo

    return this;
  };

  static mirroringOverLine({line}) {
    // todo
  };

  setToMirroringOverPlane({plane}) {
    // todo

    return this;
  };

  static mirroringOverPlane({plane}) {
    // todo
  };

  setCoordinateSystemFrom({coordSystem}) {
    XcGm3DMatrix.#setZero({entry: this.entry});

    let origin = coordSystem.origin;
    let zAxis = coordSystem.zAxis;
    let xAxis = coordSystem.xAxis;
    let yAxis = zAxis.crossProduct({vector: xAxis}).normalize();

    this.entry[0][0] = xAxis.x;
    this.entry[1][0] = xAxis.y;
    this.entry[2][0] = xAxis.z;
    this.entry[3][0] = 0.0;

    this.entry[0][1] = yAxis.x;
    this.entry[1][1] = yAxis.y;
    this.entry[2][1] = yAxis.z;
    this.entry[3][1] = 0.0;

    this.entry[0][2] = zAxis.x;
    this.entry[1][2] = zAxis.y;
    this.entry[2][2] = zAxis.z;
    this.entry[3][2] = 0.0;

    this.entry[0][3] = origin.x;
    this.entry[1][3] = origin.y;
    this.entry[2][3] = origin.z;
    this.entry[3][3] = 1.0;

    return this;
  }

  getCoordinateSystem() {
    return new XcGmCoordinateSystem({
      origin: new XcGm3DPosition({x: this.entry[0][3], y: this.entry[1][3], z: this.entry[2][3]}),
      zAxis: new XcGm3DVector({x: this.entry[0][2], y: this.entry[1][2], z: this.entry[2][2]}),
      xAxis: new XcGm3DVector({x: this.entry[0][0], y: this.entry[1][0], z: this.entry[2][0]}),
    });
  }

  setToAlignCoordinateSystem({fromCoordinateSystem, toCoordinateSystem}) {
    let matrixFrom = new XcGm3DMatrix();
    let matrixTo = new XcGm3DMatrix();
    matrixFrom.setCoordinateSystemFrom({coordSystem: fromCoordinateSystem});
    matrixTo.setCoordinateSystemFrom({coordSystem: toCoordinateSystem});

    let tmpMatrix = matrixTo.multiply({matrix: matrixFrom.inverse});
    XcGm3DMatrix.#copyEntry({to: this.entry, src: tmpMatrix.entry});

    return this;
  }

  alignCoordinateSystem({fromCoordinateSystem, toCoordinateSystem}) {
    let matrix = new XcGm3DMatrix();

    matrix.setToAlignCoordinateSystem({fromCoordinateSystem, toCoordinateSystem});

    return matrix;
  }

  asThreeMatrix4() {
    let threeMatrix = new THREE.Matrix4();
    threeMatrix.set(
      this.entry[0][0], this.entry[0][1], this.entry[0][2], this.entry[0][3],
      this.entry[1][0], this.entry[1][1], this.entry[1][2], this.entry[1][3],
      this.entry[2][0], this.entry[2][1], this.entry[2][2], this.entry[2][3],
      this.entry[3][0], this.entry[3][1], this.entry[3][2], this.entry[3][3]
    );

    return threeMatrix;
  }
}
