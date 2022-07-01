class Xc3dDocOperationDelta {
  static OPERATION_TYPE = {
    LOAD: Symbol('LOAD'),
    ADD: Symbol('ADD'),
    MODIFY: Symbol('MODIFY'),
    REMOVE: Symbol('REMOVE')
  };

  operationType;
  drawableObject;
  clonedDrawableObject;

  constructor({operationType, drawableObject}) {
    this.operationType = operationType;
    this.drawableObject = drawableObject;
    this.clonedDrawableObject = drawableObject.clone();
  }
}
