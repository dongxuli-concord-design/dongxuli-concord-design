const Xc3dUIInputState = {
  eInputNormal: Symbol('eInputNormal'), // Normal input and finish
  eInputTest: Symbol('eInputTest'), // Test input, but not finished
  eInputCancel: Symbol('eInputCancel'), // Cancel the input and finish
  eInputNone: Symbol('eInputNone'), // Null input and done
};
