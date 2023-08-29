class XcGsOrthographicCamera extends XcGsCamera {
  left; // — Camera frustum left plane.
  right; // — Camera frustum right plane.
  top; // — Camera frustum top plane.
  bottom; // — Camera frustum bottom plane.
  near; // — Camera frustum near plane.
  far; // — Camera frustum far plane.

  constructor({left, right, top, bottom, near, far}) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }
}
