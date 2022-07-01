# Introduction

Geometric modeling library

# XcGmAssert

`function XcGmAssert({assertion, message = 'Unknown'})`

# XcGm2dPosition

`class XcGm2dPosition`

Represents a 2D position.

## constructor

`constructor({x = 0.0, y = 0.0} = {})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.

## fromArray

`static fromArray({array})`

* **array** Array in the `[x, y]` form.
* **return** `XcGm2dPosition` object

Constructs a XcGm2dPosition object from an array.

## fromJSON

`static fromJSON({json})`

* **json** json object in the `{x, y}` form.
* **return** `XcGm2dPosition` object

Constructs a `XcGm2dPosition` object from a json object.

## fromThreeVector2

`static fromThreeVector2({threeVector2})`

* **threeVector2** Three.js Vector2 object.
* **return** XcGm2dPosition object

Constructs a `XcGm2dPosition` object from a Three.js Vector2 object.

## toThreeVector2

`toThreeVector2`

* **return** Three.js Vector2 object

Constructs a Three.js Vector2 object from this `XcGm2dPosition` object.

## toString

`toString()`

* **return** String representation of the object.

## toArray

`toArray()`

* **return** Array representation of the object.

## toJSON

`toJSON()`

* **return** Json representation of the object.

## clone

`clone()`

* **return** XcGm2dPosition which is cloned from the object.

## copy

`copy({position})`

* **position** Another XcGm2dPosition object.

Set the object value from another `XcGm2dPosition` object.

# XcGm2dVector

`class XcGm2dVector`

Represents a 2D vector.

## constructor

`constructor({x = 0.0, y = 0.0} = {})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.

## fromArray

`static fromArray({array})`

* **array** Array in the `[x, y]` form.
* **return** XcGm2dVector object

Constructs a `XcGm2dVector` object from an array.

## fromJSON

`static fromJSON({json})`

* **json** json object in the `{x, y}` form.
* **return** XcGm2dVector object

Constructs a `XcGm2dVector` object from a json object.

## fromThreeVector2

`static fromThreeVector2({threeVector2})`

* **threeVector2** Three.js Vector2 object.
* **return** XcGm2dVector object

Constructs a `XcGm2dVector` object from a Three.js Vector2 object.

## toThreeVector2

`toThreeVector2`

* **return** Three.js Vector2 object

Constructs a Three.js Vector2 object from this `XcGm2dVector` object.

## toString

`toString()`

* **return** String representation of the object.

## toArray

`toArray()`

* **return** Array representation of the object.

## toJSON

`toJSON()`

* **return** Json representation of the object.

## clone

`clone()`

* **return** `XcGm2dVector` object which is cloned from the object.

## copy

`copy({vector})`

* **vector** `XcGm2dVector` object.

Set the object value from another `XcGm2dVector` object.

# XcGm3dBCurve

`class XcGm3dCurve extends XcGmGeometry`

Represents 3D BCurve.

# XcGm2dAxis

`class XcGm2dAxis`

## position

`position`

XcGm2dPosition object

## direction

`direction`

XcGm2dVector object

## constructor

```
constructor({
                position = new XcGm2dPosition(),
                direction = new XcGm2dVector({x: 0, y: 0, z: 1})
              } = {})
```

## toJSON

`toJSON()`

## fromJSON

`fromJSON({json})`

# XcGm3dCircle

`class XcGm3dCircle extends XcGm3dCurve`

## radius

` get radius()`

* **return** Return the radius value.

Return the radius of the object.

## XcGmEulerAngles

// TODO

## coordinateSystem

`get coordinateSystem()`

** **return** `XcGmCoordinateSystem` object.

Return `XcGmCoordinateSystem` object of the object.

## create

`static create({radius, coordinateSystem})`

* **radius** Radius value.
* **coordinateSystem** XcGmCoordinateSystem object of the object.
* **return** XcGm3dCircle object

Create a XcGm3dCircle object from provided radius and coordinate system.

# XcGm3dEllipse

`class XcGm3dEllipse extends XcGm3dCurve`

Represents a 3D Ellipse.

# XcGm3dCurve

`class XcGm3dCurve extends XcGmGeometry`

## makeWireBodyFromCurves

`static makeWireBodyFromCurves({curves, bounds})`

Example

```
      let position = new XcGm3dPosition();
      let direction = new XcGm3dVector({x: 1, y: 1, z: 0});
      let axis = new XcGm3dAxis({position, direction});
      let line = XcGm3dLine.create({axis});
      let bound = new XcGmInterval({low: 0, high: 10})});
      let {wire} = XcGm3dCurve.makeWireBodyFromCurves({curves: [line], bounds: [bound]});
```

# XcGm3dLine

`class XcGm3dLine extends XcGm3dCurve`

Represents a 3D line.

## axis

`get axis()`

* **return** `XcGm3dAxis` object representing the axis of the 3D line.

Get the axis of the 3D line.

## create

`static create({axis})`

* **axis** `XcGm3dAxis` object representing the axis of the 3D line.
* **return** `XcGm3dLine` object.

Creates a XcGm3dLine object from the provided axis.

# XcGm3dMatrix

`class XcGm3dMatrix`

Represents a 3D matrix, which is a 4 by 4 matrix.

## identity

`static get identity()`

* **return* XcGm3dMatrix object

Constructs a 4 by 4 identity matrix.

## fromArray

`static fromArray({array})`

* **array** Array representation of the matrix.
* **return* XcGm3dMatrix object.

Constructs a `XcGm3dMatrix` object from the array representation.

## multiply

`static multiply({matrix1, matrix2})`

* **matrix1** First matrix.
* **matrix2** Second matrix.
* **return* XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object from `matrix1 x matrix2`.

## translationMatrix

`static translationMatrix({vector})`

* **vector** XcGm3dVector object.
* **return* XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object representing a translation.

## rotationMatrix

`static rotationMatrix({angle, axis})`

* **angle** A floating point number representing rotation angle.
* **axis** XcGm3dAxis representing rotation axis.
* **return* XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object representing a rotation around an axis.

## scalingMatrix

`static scalingMatrix({scale, center})`

* **scale** A floating point number representing scaling factor.
* **center** XcGm3dPosition representing scale center.
* **return* XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object representing a scale relative to the center.

## mirroringOverPositionMatrix

`static mirroringOverPositionMatrix({position})`

* **position** XcGm3dPosition representing mirror position.
* **return* XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object representing a mirror transform relative to the position.

## mirroringOverPlaneMatrix

`static mirroringOverPlaneMatrix({line})`

* **line** XcGm3dAxis representing mirror line.
* **return** XcGm3dMatrix object

Constructs a `XcGm3dMatrix` object representing a mirror transform relative to the line.

## fromThreeMatrix4
`static fromThreeMatrix4({threeMatrix4})`
//TODO

## rotationMatrixFromEulerAngles
`static rotationMatrixFromEulerAngles({eulerAngles})`

## setToThreeMatrix4
`setToThreeMatrix4({threeMatrix4})`

## setToRotationMatrixFromEulerAngles
`setToRotationMatrixFromEulerAngles({eulerAngles})`

## toArray

`toArray()`

* **return** Array representation of the object.

## toJSON

`toJSON()`

* **return** Json representation of the object.

## clone

`clone()`

* **return** `XcGm3dMatrix` object which is cloned from the object.

## copy

`copy({matrix})`

* **matrix** `XcGm3dMatrix` object.

Set the object value from another `XcGm3dMatrix` object.

## get

`get({row, column})`

* **row** Integer number representing the row index.
* **column** Integer number representing the column index.
* **return** A floating point number representing the matrix element value.

Get the matrix element value at the `[row, column]`.

## setToIdentity

`setToIdentity()`

Set this matrix to identity.

## multiplyScalar

`multiplyScalar({scale})`

* **scale** A floating point number representing scaling factor

Scale the matrix using the provided factor.

## multiply

`multiply({matrix})`

* **matrix** `XcGm3dMatrix` object.

Do this × matrix.

## preMultiply

`preMultiply({matrix})`

* **matrix** `XcGm3dMatrix` object.

Do matrix × this.

## setToProduct

`setToProduct({matrix1, matrix2})`

* **matrix1** `XcGm3dMatrix` object.
* **matrix2** `XcGm3dMatrix` object.

Set the object value to the product of the provided matrix1 and matrix2.

## invert

`invert()`

Invert this matrix.

## inverse

`inverse()`

* **return** `XcGm3dMatrix` object.

Return the inverse of this matrix.

## isSingular

`isSingular({tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the matrix is singular.

## transpose

`transpose()`

Transpose the matrix.

## transposition

`transposition()`

* **return** `XcGm3dMatrix` object.

Return the transposition of the object.

## isEqualTo

`isEqualTo({matrix, tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the matrix is equal to the provided matrix.

Check if this matrix is equal to another matrix.

## determinant

`determinant()`

* **return** A floating number representing matrix determinant.

Calculate the determinant value.

## setTranslationVector

`setTranslationVector({vector})`

* **vector** `XcGm3dVector` object representing the translation vector.

Set the translation part values of the matrix.

## translationVector

`translationVector()`

* **return** `XcGm3dVector` object representing the translation vector.

Get the translation part of the matrix.

## setToTranslation

`setToTranslation({vector})`

* **vector** `XcGm3dVector` object representing the translation vector.

Set the matrix representing a translation.

## setToRotation

`setToRotation({angle, axis})`

* **angle** A floating number representing the rotation angle.
* **axis** `XcGm3dAxis` object representing the rotation axis.

Set the matrix representing a rotation.

## setToNonUniformScaling

`setToNonUniformScaling({scaleX, scaleY, scaleZ, center})`

* **scaleX** A floating number representing the scaling factor on X.
* **scaleY** A floating number representing the scaling factor on Y.
* **scaleZ** A floating number representing the scaling factor on Z.
* **center** `XcGm3dPosition` object representing the scaling center.

Set the matrix representing a non-uniform scaling.

## setToScaling

`setToScaling({scale, center})`

* **scale** A floating number representing the scaling factor.
* **center** `XcGm3dPosition` object representing the scaling center.

Set the matrix representing a uniform scaling.

## toThreeMatrix4

`toThreeMatrix4()`

* **return** A Three.js matrix4

Get the Three.js matrix representation of the object.

# XcGm3dPoint

`class XcGm3dPoint extends XcGmGeometry`

## constructor()

`constructor()`

## position

`get position()`

* **return** `XcGm3dPosition` object of the point object.

Get the position of the object.

## part

`get part()`

* **return** `XcGmPart` object of the point object.

This function returns the part which owns the given point, if there is one, otherwise null.

The point may either be attached directly to a vertex of a body, or be construction geometry in a part.

## vertex

`get vertex()`

## create

`static create({position})`

## createMinimumBody

`createMinimumBody()`

# XcGm3dPosition

`class XcGm3dPosition`

## constructor

`constructor({x = 0.0, y = 0.0, z = 0.0} = {})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.
* **z** A floating number representing Z coordinate.

## origin

`static get origin()`

* **return** A new `XcGm3dPosition` object at the origin.

## fromArray

`static fromArray({array})`

* **array** Array in the `[x, y, z]` form.
* **return** XcGm3dPosition object.

Constructs a `XcGm3dPosition` object from an array.

## fromJSON

`static fromJSON({json})`

* **json** json object in the `{x, y}` form.
* **return** `XcGm3dPosition` object.

Constructs a `XcGm3dPosition` object from a json object.

## add

`static add({position, vector})`

* **position** `XcGm3dPosition` object.
* **vector** `XcGm3dVector` object.
* **return** A `XcGm3dPosition` object representing the `position + vector`.

## subtract

`static subtract({position, positionOrVector})`

* **position** `XcGm3dPosition` object.
* **positionOrVector** `XcGm3dVector` or `XcGm3dPosition` object.
* **return** A `XcGm3dPosition` object representing the `position - positionOrVector`.

## multiply

`static multiply({position, scale})`

* **position** `XcGm3dPosition` object.
* **scale** A floating representing scaling factor.
* **return** A `XcGm3dPosition` object representing the `position * scale`.

## divide

`static divide({position, scale})`

* **position** `XcGm3dPosition` object.
* **scale** A floating representing scaling factor.
* **return** A `XcGm3dPosition` object representing the `position / scale`.

## fromThreeVector3

`static fromThreeVector3({threeVector3})`

* **threeVector3** Three.js Vector3 object.
* **return** XcGm3dPosition object

Constructs a `XcGm3dPosition` object from a Three.js Vector3 object.

## toThreeVector3

`toThreeVector3()`

* **return** Three.js Vector3 object.

Constructs a Three.js Vector3 object representing the object.

## toString

`toString()`

* **return** String representation of the object.

## toArray

`toArray()`

* **return** Array representation of the object.

## toJSON

`toJSON()`

* **return** Json representation of the object.

## clone

`clone()`

* **return** `XcGm3dPosition` object which is cloned from the object.

## copy

`copy({position})`

* **position** `XcGm3dPosition` object.

Set the object value from another `XcGm3dPosition` object.

## add

`add({vector})`

* **vector** `XcGm3dVector` object.

Add the object to the given vector.

## subtract

`subtract({positionOrVector})`

* **positionOrVector** `XcGm3dVector` or `XcGm3dPosition` object.

Subtract the object to the given position or vector.

## multiply

`multiply({scale})`

* **scale** A floating representing scaling factor.

Multiply the object to the given scaling factor.

## divide

`divide({scale})`

* **scale** A floating representing scaling factor.

Divide the object to the given scaling factor.

## toVector

`toVector()`

* **return** `XcGm3dVector` object which has the same X/Y/Z values.

## set

`set({x, y, z})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.
* **z** A floating number representing Z coordinate.

Set the object value with the provided values.

## setToSum

`setToSum({position, vector})`

* **position** `XcGm3dPosition` object.
* **vector** `XcGm3dVector` object.

## setToProduct

`setToProduct({matrix, position})`

* **matrix** `XcGm3dMatrix` object.
* **position** `XcGm3dPosition` object.

Set the object value to the product of the provided matrix and position.

## transformBy

`transformBy({matrix})`

* **matrix** `XcGm3dMatrix` object

Transform the object with the provided matrix.

## distanceToPosition

`distanceToPosition({position})`

* **position** `XcGm3dPosition` object.
* **return* A floating number representing the distance between the object and the provided position.

## isEqualTo

`isEqualTo({position, tolerance = XcGmContext.gTol})`

* **position** `XcGm3dPosition` object.
* **tolerance** A floating point number representing tolerance.
* **return** Boolean value representing if the object is equal to the provided position.

# XcGm3dVector

`class XcGm3dVector`

This class represents a 3D vector.

## constructor

`constructor({x = 0.0, y = 0.0, z = 0.0} = {})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.
* **z** A floating number representing Z coordinate.

## identity

`static get identity()`

* **return** `XcGm3dVector` vector.

Return a new `XcGm3dVector({x: 0.0, y: 0.0, z: 0.0})`.

## xAxis

`static get xAxis()`

* **return** `XcGm3dVector` vector.

Return a new XcGm3dVector({x: 1.0, y: 0.0, z: 0.0})

## yAxis

`static get yAxis()`

* **return** `XcGm3dVector` vector.

Return a new XcGm3dVector({x: 0.0, y: 1.0, z: 0.0})

## zAxis

`static get zAxis()`

* **return** `XcGm3dVector` vector.

Return a new XcGm3dVector({x: 0.0, y: 0.0, z: 1.0})

## fromArray

`static fromArray({array})`

* **array** Array in the `[x, y, z]` form.
* **return** XcGm#DVector object

Constructs a `XcGm3dVector` object from an array.

## fromJSON

`static fromJSON({json})`

* **json** json object in the `{x, y, z}` form.
* **return** XcGm3dVector object

Constructs a `XcGm3dVector` object from a json object.

## fromThreeVector3

`static fromThreeVector3({threeVector3})`

* **threeVector3** Three.js Vector3 object.
* **return** XcGm3dVector object

Constructs a `XcGm3dVector` object from a Three.js Vector3 object.

## toString

`toString()`

* **return** String representation of the object.

## toArray

`toArray()`

* **return** Array representation of the object.

## toJSON

`toJSON()`

* **return** Json representation of the object.

## clone

`clone()`

* **return** `XcGm3dVector` object which is cloned from the object.

## copy

`copy({vector})`

* **vector** `XcGm3dVector` object.

Set the object value from another `XcGm3dVector` object.

## add

`static add({vector1, vector2})`

* **vector1** `XcGm3dVector` object.
* **vector2** `XcGm3dVector` object.
* **return** `XcGm3dVector` object.

Get a `XcGm3dVector` object representing `vector1` + `vector2`.

## subtract

`static subtract({vector1, vector2})`

* **vector1** `XcGm3dVector` object.
* **vector2** `XcGm3dVector` object.
* **return** `XcGm3dVector` object.

Get a `XcGm3dVector` object representing `vector1` - `vector2`.

## multiply

`static multiply({vector, scale})`

* **vector** `XcGm3dVector` object.
* **scale** A floating representing scaling factor.
* **return** `XcGm3dVector` object.

Get a `XcGm3dVector` object representing `vector * scale`.

## divide

`static divide({vector, scale})`

* **vector** `XcGm3dVector` object.
* **scale** A floating representing scaling factor.
* **return** `XcGm3dVector` object.

Get a `XcGm3dVector` object representing `vector / scale`.

## add

`add({vector})`

* **vector** `XcGm3dVector` object.

Add the object to the given vector.

## subtract

`subtract({vector})`

* **vector** `XcGm3dVector` object.

Subtract the object to the given vector.

## multiply

`multiply({scale})`

* **scale** A floating representing scaling factor.

Multiply the object to the given scaling factor.

## divide

`divide({scale})`

* **scale** A floating representing scaling factor.

Divide the object to the given scaling factor.

## negate

`negate()`

Negate the object.

## negation

`negation()`

* **return** `XcGm3dVector` object.

Get the negation of the object.

## lengthSquared

`lengthSquared()`

* **return** A floating number representing the length squared.

## dotProduct

`dotProduct({vector})`

* **vector** `XcGm3dVector` object.
* **return** A floating number representing dot product between this object and another vector.

## set

`set({x, y, z})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.
* **z** A floating number representing Z coordinate.

Set the object value with the provided values.

## setToProduct

`setToProduct({matrix, vector})`

* **matrix** `XcGm3dMatrix` object.
* **vector** `XcGm3dVector` object.

Set the object value to the product of the provided matrix and vector.

## transformBy

`transformBy({matrix})`

* **matrix** `XcGm3dMatrix` object

Transform the object with the provided matrix.

## perpVector

`perpVector()`

* **return** `XcGm3dVector` object.

Calculate a perpendicular vector of the vector.

## angleTo

`angleTo({vector})`

* **vector** `XcGm3dVector` object.
* **return** A floating number representing the angle to the provided vector.

## rotationAngleTo

`rotationAngleTo({vector, axis})`

* **vector** `XcGm3dVector` object.
* **axis** `XcGm3dAxis` object.
* **return** A floating number representing the angle to the provided vector.

## normal

`normal({tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.
* **return** `XcGm3dVector` object representing the normal vector of the object.

## normalize

`normalize({tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.

Normalize the object.

## length

`length()`

* **return** A floating number representing the length of the object.

## isUnitLength

`isUnitLength({tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is unit length.

## isZeroLength

`isZeroLength({tolerance = XcGmContext.gTol} = {})`

* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is zero length.

## isParallelTo

`isParallelTo({vector, tolerance = XcGmContext.gTol})`

* **vector** `XcGm3dVector` object to check.
* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is parallel to the given vector.

## isCodirectionalTo

`isCodirectionalTo({vector, tolerance = XcGmContext.gTol})`

* **vector** `XcGm3dVector` object to check.
* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is co-directional to the given vector.

## isPerpendicularTo

`isPerpendicularTo({vector, tolerance = XcGmContext.gTol})`

* **vector** `XcGm3dVector` object to check.
* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is perpendicular to the given vector.

## isEqualTo

`isEqualTo({vector, tolerance = XcGmContext.gTol})`

* **vector** `XcGm3dVector` object to check.
* **tolerance** A floating point number representing tolerance.
* **return** Boolean value to indicate if the object is equal to the given vector.

## crossProduct

`crossProduct({vector})`

* **vector** `XcGm3dVector` object.
* **return** A `XcGm3dVector` object representing `this X vector`.

## toThreeVector3

`toThreeVector3()`

* **return** A Three.js vector3 representation.

# XcGmAssembly

`class XcGmAssembly extends XcGmPart`

## constructor

`constructor()`

## parts

`get parts()`

## create

`static create()`

## instances

`instances()`

Return XcGmInstance objects

## partsAndTransfs

`partsAndTransfs()`

## transformBy

`transformBy({matrix})`

## makeLevelAssembly

`makeLevelAssembly()`

# XcGm3dAxis

`class XcGm3dAxis`

## position

`position`

XcGm3dPosition object

## direction

`direction`

XcGm3dVector object

## constructor

```
constructor({
                position = new XcGm3dPosition(),
                direction = new XcGm3dVector({x: 0, y: 0, z: 1})
              } = {})
```

## toJSON

`toJSON()`

## fromJSON

`fromJSON({json})`

# XcGmBlendSurface

`class XcGmBlendSurface extends XcGmSurface`

## constructor

`
constructor() { super(); }
`

# XcGmBody

`class XcGmBody extends XcGmPart`

## BODY_TYPE

```
  static BODY_TYPE = {
    MINIMUM: 5603,
    ACORN: 5606,
    WIRE: 5604,
    SHEET: 5602,
    SOLID: 5601,
    GENERAL: 5605,
    UNSPECIFIED: 5607,
    EMPTY: 5608,
    COMPOUND: 5609
  };
```

## BooleanFunction

```
  static BooleanFunction = {
    Intersection: 15901, /* intersect */
    Subtraction: 15902, /* subtract */
    Union: 15903 /* unite */
  };
```

## constructor

`constructor()`

## faces

`get faces()`

## edges

`get edges()`

Return XcGmEdge

## vertices

`get vertices()`

Return XcGmVertex

## type

`get type()`

Return XcGmBody.BODY_TYPE

## createSolidBlock

`static createSolidBlock({x, y, z, coordinateSystem = new XcGmCoordinateSystem()})`

Return XcGmBody

## createSolidCone

`static createSolidCone({radius, height, semiAngle, coordinateSystem = new XcGmCoordinateSystem()})`

## createSolidCylinder

`static createSolidCylinder({radius, height, coordinateSystem = new XcGmCoordinateSystem()})`

## createSolidPrism

`static createSolidPrism({radius, height, sides, coordinateSystem = new XcGmCoordinateSystem()})`

## createSolidSphere

`static createSolidSphere({radius, coordinateSystem = new XcGmCoordinateSystem()})`

## createSolidTorus

`static createSolidTorus({majorRadius, minorRadius, coordinateSystem = new XcGmCoordinateSystem()})`

## createSheetCircle

`static createSheetCircle({radius, coordinateSystem = new XcGmCoordinateSystem()})`

## extrudeAlong

`extrudeAlong({direction, options})`

Example

```
        let myBody = ....;
        let direction = new XcGm3dVector({x: 0, y: 0, z: 1});
        let extrudedBody = myBody.extrudeAlong({
          direction: direction,
          options: {
            distance: 1
          }
        });
```

## spin

`spin({axis, angle})`

* axis XcGm3dAxis object

Example:

```
    let axis = ...;
    this.#profileBody.spin({axis, angle: Math.PI});
```

## transformBy

`transformBy({matrix})`

## boolean

`boolean({tools, func})`

* tools: XcGmBody objects
* func XcGmBody.BooleanFunction

Return result bodies

## fixBlends

`fixBlends()`

## hollowFaces

`hollowFaces({faces, offset})`

* faces: XcGmFace
* offset: A floating point number

## imprintCurve

`imprintCurve({curve, bounds})`

## findVertexByPosition

`findVertexByPosition({position})`

Return XcGmVertex

## findEdgeByPositions

`findEdgeByPositions({positions})`

## findEdgeByVertices

`findEdgeByVertices({vertex1, vertex2})`

## findFaceByPositions

`findFaceByPositions({positions})`

## findFaceByEdges

`findFaceByEdges({edges})`

## findFaceByVertices

`findFaceByVertices({vertices})`

## findVertexWithFilter

`findVertexWithFilter({callback})`

## findEdgeWithFilter

`findEdgeWithFilter({callback})`

## findFaceWithFilter

`findFaceWithFilter({callback})`

# XcGm3dBox

`class XcGm3dBox`

## constructor

`constructor({minimumX, minimumY, minimumZ, maximumX, maximumY, maximumZ})`

## fromJSON

`static fromJSON({json})`

## toJSON

`toJSON()`

# XcGmBSurface

`class XcGmBSurface extends XcGmSurface`

## constructor

`constructor()`

## XcGmCone

`class XcGmCone extends XcGmSurface`

## constructor

`constructor()`

# XcGmContext

`class XcGmContext`

## gTol

`static gTol = new XcGmPrecision();`

## constructor

`constructor()`

# XcGmCoordinateSystem

`class XcGmCoordinateSystem`

## origin

`origin`

XcGm3dPosition

## zAxis

`zAxis`

XcGm3dVector

## xAxis

`xAxis`

XcGm3dVector

## constructor

`
constructor({ origin = new XcGm3dPosition(), zAxis = new XcGm3dVector({x: 0, y: 0, z: 1}), xAxis = new XcGm3dVector({x: 1, y: 0, z: 0})
} = {})
`

## fromMatrix

`static fromMatrix({matrix})`

## toMatrix

`toMatrix()`

## transformToCoordinateSystem

`transformToCoordinateSystem({coordinateSystem})`

## fromJSON

`static fromJSON({json})`

## toJSON

`toJSON()`

## XcGmCylinder

`class XcGmCylinder extends XcGmSurface`

## constructor

`constructor()`

## XcGmEdge

`class XcGmEdge extends XcGmTopology`

## body

`get body()`

## curve

`get curve()`

## faces

`get faces()`

Return XcGmFace array

## vertices

`get vertices()`

Return {vertex1, vertex2} where vertex1 and vertex2 are XcGmVertex

## makeFacesFrom

`static makeFacesFrom({edges, senses, sharedLoop})`

* Return XcGmFace array

Example

```
      let {wire, newEdges} = XcGm3dCurve.makeWireBodyFromCurves({curves, bounds});
      let faces = XcGmEdge.makeFacesFrom({edges: [newEdges[0].edge], senses: [true], sharedLoop: [-1]});
```

## setBlendConstantFor

`static setBlendConstantFor({edges, radius})`

* Return blend edges.

Example

```
    let edges = ...;
    XcGmEdge.setBlendConstantFor({edges, radius: 0.01});
    myBody.fixBlends();
```

## findInterval

`findInterval()`

* Return XcGmInterval

## containsVector

`containsVector({vector})`

* Return XcGmTopology

Example

```
          let topol = edge.containsVector({vector});
          if (topol) {
            // The edge contains the vector
          }
```

## findVertexByPosition

`findVertexByPosition({position})`

* Return null or XcGmVertex object found.

## findVertexWithFilter

`findVertexWithFilter({callback})`

* callback filter function in the form of `callback(vertex[, index[, array]`])
* Return filtered array, which could be empty array.

# XcGmEntity

`class XcGmEntity`

## tag

`tag`

A unique handle number

## constructor

`constructor()`

## getObjFromTag

`static getObjFromTag({entityTag})`

## PKDelete

`static PKDelete({entity})`

## toJSON

`toJSON()`

## clone

`clone()`

# XcGmFace

`class XcGmFace extends XcGmTopology`

## constructor

`constructor()`

## surf

`get surf()`

Return XcGmSurface

## UVBox

`get UVBox()`

* Return XcGmUVBox

## body

`get body()`

* Return XcGmBody

## edges

`get edges()`

* Return XcGmEdge array

## vertices

`get vertices()`

* Return XcGmVertex array

## delete

`static delete({faces})`

* faces XcGmFace array

Delete faces from a body

## transform

`static transform({facesAndMatrices, tolerance})`

* facesAndMatrices Array of XcGmFace and XcGm3dMatrix
* tolerance floating number

Example

```
        let face = ....;
        let matrix = ....;
        XcGmFace.transform({
          facesAndMatrices: [{face, matrix}],
          tolerance: 1e-5
        });
```

## surfAndOrientation

`surfAndOrientation()`

* Return {surf, orientation}

Example

```
      let face = ...;  
      let {surf, orientation} = face.surfAndOrientation();
      if (surf instanceof XcGmPlane) {
        let coordinateSystem = surf.coordinateSystem;
        let faceDir = coordinateSystem.zAxisDirection;
        if (!orientation) {
          faceDir.negate();
        }
      }
```

## attachSurfFitting

`attachSurfFitting({localCheck})`

* Return localCheckResult

Example

```
      let {wire, newEdges} = XcGm3dCurve.makeWireBodyFromCurves({curves, bounds});
      let faces = XcGmEdge.makeFacesFrom({edges: [newEdges[0].edge], senses: [true], sharedLoop: [-1]});
      XcSysAssert({
        assertion: faces.length === 1,
        message: `Cannot generate sheet body. Single loop supported only`
      });
      let face = faces[0];
      let localCheckStatus = face.attachSurfFitting({localCheck: true});
      let faceBody = face.body;
```

## findVertexByPosition

`findVertexByPosition({position})`

* position XcGm3dPosition
* Return XcGmVertex or null when not found

## findEdgeByVertex

`findEdgeByVertex(vertex)`

* vertex XcGmVertex
* Return XcGmEdge array

## findEdgeByTwoVertices

`findEdgeByTwoVertices({vertex1, vertex2})`

* vertex1 XcGmVertex
* vertex2 XcGmVertex
* Return XcGmEdge or null

## findVertexWithFilter

`findVertexWithFilter({callback})`

* callback filter function in the form of `callback(vertex[, index[, array]`])
* Return filtered vertex array, which could be empty array.

## findEdgeWithFilter

`findEdgeWithFilter({callback})``

* callback filter function in the form of `callback(edge[, index[, array]`])
* Return filtered edge array, which could be empty array.

# XcGmGeometry

`class XcGmGeometry extends XcGmEntity`

## constructor

`constructor()`

# XcGmInstance

`class XcGmInstance extends XcGmTopology`

## constructor

`constructor()`

## assembly

`get assembly()`

* Return XcGmAssembly

## transform

`get transform()`

* Return XcGm3dMatrix

## part

`get part()`

* Return XcGmPart

## create

`static create({assembly, part, matrix = null})`

* assembly XcGmAssembly
* part XcGmPart
* matrix null or XcGm3dMatrix

## changePart

`changePart({part})`

* part XcGmPart

## replaceTransf

`replaceTransf({transf})`

* transf XcGmTransf

## transformBy

`transformBy({matrix})`

* matrix XcGm3dMatrix

# XcGmInterval

`class XcGmInterval`

## low

`low`

## high

`high`

## constructor

`constructor({low, high})`

## fromJSON

`static fromJSON({json})`

## toJSON

`toJSON()`

# XcGmLoop

`class XcGmLoop extends XcGmTopology`

## constructor

`constructor()`

# XcGmOffset

`class XcGmOffset extends XcGmSurface`

## constructor

`constructor()`

# XcGmPart

`class XcGmPart extends XcGmTopology`

## constructor

`constructor()`

## transmitToData

`static transmitToData({parts})`

## transmitToFile

`static transmitToFile({parts, path})`

## receiveFromData

`static receiveFromData({data})`

## receiveFromFile

`static receiveFromFile({fileName})`

## findEntityByIdent

`findEntityByIdent({identifier, cls})`

# XcGmPK_CIRCLE_sf_t

`class XcGmPK_CIRCLE_sf_t`

## radius

`radius`

## basisSet

`basisSet`

XcGmPK_AXIS2_sf_t

## constructor

`
constructor({ radius, basisSet = new XcGmPK_AXIS2_sf_t()
})
`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_LINE_sf_t

`class XcGmPK_LINE_sf_t`

## basisSet

`basisSet`

XcGmPK_AXIS1_sf_t

## constructor

`constructor(basisSet = new XcGmPK_AXIS1_sf_t())`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_POINT_sf_t

`class XcGmPK_POINT_sf_t`

## position

`position`

XcGm3dPosition

## constructor

`constructor(position = new XcGm3dPosition())`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_AXIS1_sf_t

`class XcGmPK_AXIS1_sf_t`

## location

`location`

XcGm3dPosition

## axis

`axis`

XcGm3dVector

## constructor

```
  constructor({
                location = new XcGm3dPosition(),
                axis = new XcGm3dVector({x: 0, y: 0, z: 1})
              } = {})
```

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_AXIS2_sf_t

`class XcGmPK_AXIS2_sf_t`

## location

`location`

XcGm3dPosition

## axis

`axis`

XcGm3dVector

## refDirection

`refDirection`

XcGm3dVector

## constructor

`
constructor({ location = new XcGm3dPosition(), axis = new XcGm3dVector({x: 0, y: 0, z: 1}), refDirection = new XcGm3dVector({x: 1, y: 0, z: 0})
} = {})
`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_INSTANCE_sf_t

`class XcGmPK_INSTANCE_sf_t`

## assembly

`assembly`

XcGmAssembly

## transf

`transf`

XcGmPKTransf

## part

XcGmPart

## constructor

`
constructor({ assembly = null, transf = null, part = null } = {})
`

`part`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_PLANE_sf_t

`class XcGmPK_PLANE_sf_t`

## basisSet

`basisSet`

XcGmPK_AXIS2_sf_t

## constructor

`constructor(basisSet = new XcGmPK_AXIS2_sf_t())`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPK_SPHERE_sf_t

`class XcGmPK_SPHERE_sf_t`

## radius

`radius`

## basisSet

`basisSet`

XcGmPK_AXIS2_sf_t

## constructor

```
  constructor({
                radius,
                basisSet = new XcGmPK_AXIS2_sf_t()
              })
```

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmTransf

`class XcGmTransf extends XcGmEntity`

## constructor

`constructor()`

## matrix

`get matrix()`

Return XcGm3dMatrix

## create

`static create({transfSF})`

* transfSF XcGmPK_TRANSF_sf_t

# XcGmPK_TRANSF_sf_t

`class XcGmPK_TRANSF_sf_t`

## matrix

`matrix`

XcGm3dMatrix

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmPlane

`class XcGmPlane extends XcGmSurface`

## constructor

`constructor()`

## coordinateSystem

`get coordinateSystem()`

Return XcGmCoordinateSystem

## create

`static create({coordinateSystem})`

# XcGmPrecision

`class XcGmPrecision`

## linearPrecision

`linearPrecision`

## anglePrecision

`anglePrecision`

## constructor

`constructor({linearPrecision = 1.0e-8, anglePrecision = 1.0e-11} = {})`

# XcGmSphere

`class XcGmSphere extends XcGmSurface`

## constructor

`constructor()`

## radius

`get radius()`

## coordinateSystem

`get coordinateSystem()`

Return XcGmCoordinateSystem

## create

`static create({radius, coordinateSystem})`

# XcGmSpun

`class XcGmSpun extends XcGmSurface`

## constructor

`constructor()`

# XcGmSurface

`class XcGmSurface extends XcGmGeometry`

## constructor

`constructor()`

## evaluate

`evaluate({uv})`

* uv XcGmUV
* Return XcGm3dPosition

# XcGmSwept

`class XcGmSwept extends XcGmSurface`

## constructor

`constructor()`

# XcGmTorus

`class XcGmTorus extends XcGmSurface`

## constructor

`constructor()`

# XcGmTopology

`class XcGmTopology extends XcGmEntity`

## constructor

`constructor()`

## box

`get box()`

Return XcGm3dBox

## evalMassPropsFor

`static evalMassPropsFor({topols, accuracy})`

* topols XcGmTopology object array
* accuracy Computational accuracy
* return {amount, mass, cog, mofi, periphery}

Example

```
      let {cog} = XcGmTopology.evalMassPropsFor({topols: [myTopol], accuracy: 1});
```

## render

`render()`

* return {allFaceRenderingData, allEdgeRenderingData, allVertexRenderingData}

# XcGmUV

## u

`u`

## v

`v`

## constructor

`constructor({u, v})`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmUVBox

`class XcGmUVBox`

## param

`param`

## constructor

`constructor({lowU, lowV, highU, highV})`

## toJSON

`toJSON()`

## fromJSON

`static fromJSON({json})`

# XcGmVertex

`class XcGmVertex extends XcGmTopology`

## constructor

`constructor()`

## point

`get point()`

Return XcGmPoint

## body

`get body()`

Return XcGmBody

## faces

`get faces()`

Return XcGmFace array
