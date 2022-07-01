# Introduction

Document classes for 3D modeling

# Xc3dUICommand

`class Xc3dUICommand`

A command object

## constructor

`constructor({name, entry, icon = null, help = null, keywords=[]})`

* **name** String representing command name.
* **entry** Generator function as the entry of the command.
* **icon** Path string for the icon file.
* **help** Path string for the help document.
* **keywords** Array of strings used for command search.


# Xc3dUIInputState

```
const Xc3dUIInputState = {
  eInputNormal: Symbol('eInputNormal'), // User cancelled the input
  eInputCancel: Symbol('eInputCancel'), // User cancelled the input
  eInputNone: Symbol('eInputNone'), // User input nothing and return (click the Done button directly)
};
```

# Xc3dUIParser

`class Xc3dUIParser`

## parseInteger

`static parseInteger({string})`

* **string** String to be parsed.
* **return** Integer number.

This function will parse a string to an integer number. This function will throw exception when the string cannot be parsed correctly.

## parseFloat

`static parseFloat({string})`

* **string** String to be parsed.
* **return** Float number.

This function will parse a string to an float number. This function will throw exception when the string cannot be parsed correctly.

## parseDistance

`static parseDistance({string})`

* **string** String to be parsed.
* **return** Float number representing a distance.

This function will parse a string to an float number. This function will throw exception when the string cannot be parsed correctly.

## parsePosition

`static parsePosition({string})`

* **string** String to be parsed.
* **return** XcGm3dPosition object.

This function will parse a string to `XcGm3dPosition` object. This function will throw exception when the string cannot be parsed correctly.

## parseScreenPosition

`static parseScreenPosition(string)`

* **string** String to be parsed.
* **return** XcGm2dVector object.

This function will parse a string to `XcGm2dVector` object. This function will throw exception when the string cannot be parsed correctly.

## parseVector

`static parseVector(string)`

* **string** String to be parsed.
* **return** XcGm3dVector object.

This function will parse a string to `XcGm3dVector` object. This function will throw exception when the string cannot be parsed correctly.

# Xc3dUIMouseEvent

`class Xc3dUIMouseEvent`

## TYPE

```
  static TYPE = {
    DOWN: Symbol('DOWN'),
    UP: Symbol('UP'),
    ENTER: Symbol('ENTER'),
    LEAVE: Symbol('LEAVE'),
    MOVE: Symbol('MOVE')
  };

```

## constructor

`constructor({type, position, which = null})`

## type (getter)

`get type()`

## which (getter)

`get which()`

## position (getter)

`get position()`

# Xc3dUITouchEvent

## TYPE

```
  static TYPE = {
    START: Symbol('START'),
    MOVE: Symbol('MOVE'),
    END: Symbol('END')
  };
```

## constructor

`constructor({type, touches, targetTouches, changedTouches})`

## type (getter)

`get type()`

## touches (getter)

`get touches()`

## targetTouches (getter)

`get targetTouches()`

## changedTouches (getter)

`get changedTouches()`

# Xc3dUIManager

## renderingFont

`static renderingFont`

An `THREE.Font` object.

## canvas

`static canvas`

The canvas element of the application.

## mainScene

`static mainScene`

The `THREE.Scene` object for the main rendering scene of the canvas.

## overlayScene

`static overlayScene`

The `THREE.Scene` object for the overlay scene of the canvas.

## webGLRenderer

`static webGLRenderer`

The `THREE.WebGLRenderer` object for the WebGL render.

## renderingCamera

`static renderingCamera`

The `THREE.OrthographicCamera` object.

## groundPlane

`static groundPlane`

The Three.js Object3D representing the ground plane.

## ucsAxesHelper

`static ucsAxesHelper`

The Three.js Object3D representing the axes.

## document

`static document`

The `Xc3dDocDocument` object managed by this manager.

## namedViews

`static namedViews`

A `Map` object manages the names and camera views.

## DraggingIntensity

```
  static DraggingIntensity = {
    LOW: Symbol('LOW'),
    MEDIUM: Symbol('MEDIUM'),
    HIGH: Symbol('HIGH')
  };
```

## customRenderingObjectGroup

`static customRenderingObjectGroup`

## customOverlayRenderingObjectGroup

`static customOverlayRenderingObjectGroup`

## highlightsRenderingObjectGroup

`static highlightsRenderingObjectGroup`

## ucs (getter)

`static get ucs()`

* **return** XcGmCoordinateSystem representing the current user coordinate system.

## ucs (setter)

`static set ucs(coordinateSystem)`

* **coordinateSystem** XcGmCoordinateSystem representing the current user coordinate system.

## resetUCS

`static resetUCS()`

Reset the coordinate system to the default world coordinate system.

## init

`static init()`

## resetCamera

`static resetCamera()`

Reset the camera to default settings.

## orthogonalizeCamera

`static orthogonalizeCamera()`

Orthogonalize the camera.

## zoomCamera

`static zoomCamera({factor})`

* **factor** Float number representing the zoom factor, which could less then 1 or greater than 1.

## zoomExtent

`static zoomExtent()`

Zoom the camera to show all objects in the scene.

## panCamera

`static panCamera({panVector})`

* **panVector** THREE.Vector2 representing the pan camera vector.

Pan camera.

## orbitCamera

`static orbitCamera({orbitVector})`

* **orbitVector** THREE.Vector2 representing the orbit camera vector.

## setNamedView

`static setNamedView({name, viewJSONData})`

* **name** String representing the view name.
* **viewJSONData** JSON object representing view settings, which could get from `getCurrentViewJSONData`.

Add named view.

## namedViews

`static get namedViews()`

* **return** Return entries of named view map, including the name and the view JSON data.

## getCurrentViewJSONData

`static getCurrentViewJSONData()`

* **return** JSON object representing view settings.

## deleteNamedView

`static deleteNamedView({name})`

* **name** String representing the view name.

## setCurrentView

`static setCurrentView({name})`

* **name** String representing the view name.

## setViewToLookAtUCS

`static *setViewToLookAtUCS()`

Change the view to look at user coordinate system with animation.

## renderingObjectsOfUCS

`static renderingObjectsOfUCS()`

* **return** Three.js Object3D representing user coordinate system, including the ground plane and axes.


## redraw

`static redraw()`

Redraw the scene.

## getNumPixelsInUnit

`static getNumPixelsInUnit()`

* **return** Integer value.

Get the number of pixels of one unit in the model space.

## getPositionInNDCFromScreen

`static getPositionInNDCFromScreen({screenPosition})`

Get Normalized device coordinate from screen position.

## getUCSPositionFromWorldPosition

`static getUCSPositionFromWorldPosition({worldPosition})`
* **worldPosition** XcGm3dPosition in world coordinate system.
* **return** XcGm3dPosition in user coordinate system.

## getWorldPositionFromUCSPosition

`static getWorldPositionFromUCSPosition({ucsPosition})`

* **ucsPosition** XcGm3dPosition in user coordinate system.
* **return** XcGm3dPosition in world coordinate system.

## getPositionInScreenFromWorld

`static getPositionInScreenFromWorld({worldPosition})`

* **worldPosition** XcGm3dPosition in world coordinate system.
* **return** XcGm2dPosition in screen coordinate system.

## getPositionWorldFromScreen

```
static getPositionWorldFromScreen({
                                       screenPosition,
                                       depth = XcGm3dPosition.fromThreeVector3({threeVector3: Xc3dUIManager.renderingCamera.position}).distanceToPosition({position: Xc3dUIManager.renderingCameraTarget})
                                     })
```
* **screenPosition** XcGm2DPosition in screen coordinate system.
* **depth** Float number representing the depth from the view point.
* **return** XcGm3dPosition in world coordinate system.

## pick

```
static pick({
                screenPosition,
                targetRenderingObjects
    })
```
* **screenPosition** XcGm2DPosition in screen coordinate system.
* **targetRenderingObjects** Array of Three.Object3D objects.
* **return** Array of picking object in {renderingObject, position} form.

## showUCSGrid

`static showUCSGrid()`

## hideUCSGrid

`static hideUCSGrid()`

## toggleUCSGrid

`static toggleUCSGrid()`

## computerScreenPositionFromMouseCoordinates

`static computerScreenPositionFromMouseCoordinates({clientX, clientY})`

* **clientX** Integer number representing `x` coordinate of the mouse position.
* **clientY** Integer number representing `y` coordinate of the mouse position.
* **return** XcGm2dPosition in screen coordinate system.

## showDrawableObject

`static showDrawableObject({drawableObject})`

## hideDrawableObject

`static hideDrawableObject({drawableObject})`

## computeDraggingInterval

`static computeDraggingInterval({draggingIntensity})`

* **draggingIntensity** Xc3dUIManager.DraggingIntensity.LOW, Xc3dUIManager.DraggingIntensity.MEDIUM, or Xc3dUIManager.DraggingIntensity.HIGH
* **return** Time to delay in milliseconds.

## generateHighlightingRenderingObject

`static generateHighlightingRenderingObject({renderingObject})`

## addCustomRenderingObject

`static addCustomRenderingObject({renderingObject})`

## removeCustomRenderingObject

`static removeCustomRenderingObject({renderingObject})`

## clearCustomRenderingObjects

`static clearCustomRenderingObjects()`

## addCustomOverlayRenderingObject

`static addCustomOverlayRenderingObject({renderingObject})`

## removeCustomOverlayRenderingObject

`static removeCustomOverlayRenderingObject({renderingObject})`

## clearCustomOverlayRenderingObjects

`static clearCustomOverlayRenderingObjects()`

## computeStandardValueFromValueWithUnit

```
  static computeStandardValueFromValueWithUnit({
                            value,
                            unit = Xc3dUIConfig.unit
                          })
```
* **value** Float number representing unitless value.
* **unit** String representing unit.
* **return** Return unitless value.

## computeValueWithUnitFromStandardValue

```
  static computeValueWithUnitFromStandardValue({
                        value,
                        unit = Xc3dUIConfig.unit
                      } = {})
```
* **value** Float number representing unitless value.
* **unit** String representing unit.
* **return** Return value under the given unit.

## generateTextLabel

`static generateTextLabel({text, position, size = 0.1, height = 0.01, color = 0x000000} = {})`

* **text** String representing the text.
* **position** XcGm2dPosition object representing position on screen.
* **size** Float number representing size.
* **height** Float number representing height.
* **color** Three.Color in HEX or color name.
* **return** Return Three Object3D representing text label.

## getAngle

```
Xc3dUIManager.getAngle = function* ({
                                              prompt,
                                              allowReturnNull = false,
                                              draggingCallback = null,
                                              draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                            })
```

## getAxis

```
Xc3dUIManager.getAxis = function* ({
                                             prompt,
                                             allowReturnNull = false,
                                             draggingCallback = null,
                                             draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                           })
```

## getChoice

```  
Xc3dUIManager.getChoice = function* ({prompt, choices, allowReturnNull = false})
```

## getCommand

```
Xc3dUIManager.getCommand = function* ({prompt, commands, showCanvasElement = true})
```

## getDialog

`Xc3dUIManager.getDialog = function* ({prompt, dialog, allowReturnNull = false})`

## getDirection

```
Xc3dUIManager.getDirection = function* ({
                                                  prompt,
                                                  allowReturnNull = false,
                                                  draggingCallback = null,
                                                  draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                                })
```

## getDistance

```
Xc3dUIManager.getDistance = function* ({
                                                 prompt,
                                                 allowReturnNull = false,
                                                 draggingCallback = null,
                                                 draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                               })
```

## getDrawableObject

```
Xc3dUIManager.getDrawableObject = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       filter = [Xc3dDocDrawableObject]
                                                     })
```

## getFaceEdgeVertex

```
Xc3dUIManager.getFaceEdgeVertex = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       targetRenderingObjects = [Xc3dUIManager.document.renderingScene],
                                                       type = Xc3dUIManager.PICK_TYPE.VERTEX | Xc3dUIManager.PICK_TYPE.EDGE | Xc3dUIManager.PICK_TYPE.FACE,
                                                     })
```

## getFloat

```
Xc3dUIManager.getFloat = function* ({
                                              prompt,
                                              allowReturnNull = false
                                            })
```

## getInteger

```
Xc3dUIManager.getInteger = function* ({
                                                prompt,
                                                allowReturnNull = false
                                              })
```

## getPosition

```
Xc3dUIManager.getPosition = function* ({
                                                 prompt,
                                                 allowReturnNull = false,
                                                 basePosition = null,
                                                 mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                 touchIndicator = Xc3dUITouchEvent.TYPE.END,
                                                 draggingCallback = null,
                                                 draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM,
                                                 objectSnapMode = true,
                                               })
```

## getScreenPosition

```
Xc3dUIManager.getScreenPosition = function* ({
                                                       prompt,
                                                       allowReturnNull = false,
                                                       mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                       touchIndicator = Xc3dUITouchEvent.TYPE.END,
                                                       depth = Xc3dUIManager.renderingCamera.position.distanceTo(new THREE.Vector3(0, 0, 0)),
                                                       draggingCallback = null,
                                                       draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM
                                                     })
```

## getString

```
Xc3dUIManager.getString = function* ({
                                               prompt,
                                               allowReturnNull = false
                                             })
```

## getTransform

```
Xc3dUIManager.getTransform = function* ({
                                                  prompt,
                                                  coordinateSystem,
                                                  mouseIndicator = Xc3dUIMouseEvent.TYPE.UP,
                                                  draggingCallback = null,
                                                  draggingIntensity = Xc3dUIManager.DraggingIntensity.MEDIUM,
                                                  needTranslation = true,
                                                  needRotation = true,
                                                  needScale = true
                                                })
```

# Xc3dUIAnimation

Animation API

Example:

Code to create models:

```javascript
Xc3dUIGetObject.inputObject = function() {
  const model1 = new XcAtDocBlock({
    name: '1', x: 0.2, y: 0.6, z: 0.6,
    coordinateSystem: new XcGmCoordinateSystem({origin: new XcGm3dPosition({x: 0.2, y: 0.5, z: 0})}),
    color: new THREE.Color('red')
  });

  const model2 = new XcAtDocBlock({
    name: '2', x: 0.2, y: 0.6, z: 0.6,
    coordinateSystem: new XcGmCoordinateSystem({origin: new XcGm3dPosition({x: -0.2, y: -0.5, z: 0})}),
    color: new THREE.Color('skyblue')
  });

  const model3 = new XcAtDocMixerTest({name: '3', position: new XcGm3dPosition()});

  return [model1, model2, model3];
}
```
Code to run animation:

```javascript
Xc3dUIGetObject.inputObject = function* () {
  Xc3dUIManager.document.undoEnabled = false;
  
  const drawableObject1 = Xc3dUIManager.document.queryDrawableObjectsByName({name: '1'})[0];
  const drawableObject2 = Xc3dUIManager.document.queryDrawableObjectsByName({name: '2'})[0];
  const drawableObject3 = Xc3dUIManager.document.queryDrawableObjectsByName({name: '3'})[0];

  yield* Xc3dUIAnimation.runParallelAnimations({
    actions: [
      Xc3dUIAnimation.rotate({drawableObject: drawableObject2, angle: 720, axis: new XcGm3dAxis({position: new XcGm3dPosition(), direction: new XcGm3dVector({x: 0, y: 0, z: 1})}), duration: 2000}),
      Xc3dUIAnimation.runCustomAction({action: drawableObject3.dance10times()}),
    ]
  });

  Xc3dUIManager.document.undoEnabled = true;
};
```

## StopEvent

```static StopEvent = Symbol('StopEvent');```

## animationDelay

By default, animations will be run at 24 fps.

```static animationDelay = (1.0 / 24.0) * 1000; ```

## runParallelAnimations

```static* runParallelAnimations({actions}) ```

## runSerialAnimations

```static* runSerialAnimations({actions}) ```

## setView

```static* setView({name})```

## orbitView

```static* orbitView({vector, duration})```

## panView

```static* panView({vector, duration})```

## zoomView

```static* zoomView({factor, duration})```


## translate

```static* translate({drawableObject, distance, direction, duration})```

## rotate

```static* rotate({drawableObject, angle, axis, duration})```

## transparentize

```static* transparentize({drawableObject, start, end, duration})```

## runCustomAction

```static* runCustomAction({action})```
