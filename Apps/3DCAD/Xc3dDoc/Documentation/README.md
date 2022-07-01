# Introduction

Document and key object model classes for 3D modeling.

# Xc3dDocDocument

## fileVersion

`static fileVersion`

* **fileVersion** Integer number representing the document file version.

## constructor

`constructor({filePath})`

* **filePath** String representing file path.

## renderingScene (getter)

`get renderingScene()`

* **return** Three.Scene

## userData (getter)

`get userData()`

* **return** An object containing user data.

User data is the place to put user-defined data.

## registerDrawableObjectType

`static registerDrawableObjectType({cls})`

* **cls** Class object representing the object type.

Any user-defined model classes need to be registered so that the class objects can be serialized. The name will used as
the class identifier in the serialized data.

Example:

```
class MyModelingModel extends Xc3dDocDrawableObject {
  ...
}

Xc3dDocDocument.registerDrawableObjectType({
  cls: MyModelingModel
});
```

## getDrawableObjectClassByType

`static getDrawableObjectClassByType({className})`

* **className** String representing class name.
* **return** Class object representing the object type.

## getRenderingObjectFromDrawableObject

`static getRenderingObjectFromDrawableObject({drawableObject})`

* **drawableObject** 
* **return**

## getDrawableObjectFromRenderingObject

`static getDrawableObjectFromRenderingObject({renderingObject})`

* **renderingObject** 
* **return**

## getDrawableObjectFromKernelEntity

`static getDrawableObjectFromKernelEntity({kernelEntity})`

## getRenderingObjectFromModelingKernelEntity

`static getRenderingObjectFromModelingKernelEntity({kernelEntity})`

## getModelingKernelEntityFromRenderingObject

`static getModelingKernelEntityFromRenderingObject({renderingObject})`

## generateRenderingForBody

```
  static generateRenderingForBody({
                                    body,
                                    color = null,
                                    map = null,
                                    opacity = 1.0,
                                    transparent = false
                                  })
```

## generateMeshForFace

```
static generateMeshForFace({face, color, map, opacity, transparent})
```

## generateLineForEdge

`static generateLineForEdge({edge, color})`

## generatePointForVertex

`static generatePointForVertex({vertex, color, size = 1})`

## load

`static load({json, filePath})`

## get drawableObjects

`get drawableObjects()`

## get textures

`get textures()`

## get undoEnabled

```get undoEnabled()```

## set undoEnabled

```set undoEnabled(v)```

## cleanRuntimeData

`cleanRuntimeData()`

Clean all runtime data, including undo and redo data. This is usually be called whenever there is an excpetion or
critical error happened in the system.

## addDrawableObject

`addDrawableObject({drawableObject})`

* **drawableObject** Xc3dDocDrawableObject objects.
* **return** String representing object ID.

Add a Xc3dDocDrawableObject object to the document.

## removeDrawableObject

`removeDrawableObject({drawableObject})`

* **drawableObject** Xc3dDocDrawableObject objects.

Remove a Xc3dDocDrawableObject object from the document.

## modifyDrawableObject

`modifyDrawableObject({drawableObject})`

* **drawableObject** Xc3dDocDrawableObject objects.

Modify a Xc3dDocDrawableObject object from the document.

## startTransaction

`startTransaction()`

Start a transaction.

## endTransaction

`endTransaction()`

End a transaction. `startTransaction()` is supposed to be called previously.

## addTexture

`addTexture({texture})`

* **texture** Xc3dDocTexture object.

Add a texture to the system.

## removeTexture

`removeTexture({texture})`

* **texture** Xc3dDocTexture object.

Remove a texture from the system.

## getObjectID

`getObjectID({object})`

## getObjectById

`getObjectById({id})`

## queryDrawableObjectsByName

`queryDrawableObjectsByName({name})`

## undo

`undo()`

Undo the last change in the document.

## redo

`redo()`

Redo the last change in the document.

## save

`save()`

* **return** Object containing the document data.

Serialize the document to data.

# Xc3dDocModel

`class Xc3dDocModel extends Xc3dDocDrawableObject`

Represent a document model which is built from the XcGm kernel.

## constructor

`constructor({body = null, color = null, name = 'model', texture = null} = {})`

* **body** XcGmBody object.
* **color** Three.js color object.
* **name** String representing name.
* **texture** Xc3dDocTexture object.

## body (getter)

`get body()`

* **return** XcGmBody object.

Get the internal XcGmBody.

## body (setter)

`set body(body)`

* **body** XcGmBody object.

Set the internal XcGmBody.

## getModelFromBody

`static getModelFromBody({body})`

* **body** XcGmBody object.
* **return** Xc3dDocModel object or undefined if not found.

Find the Xc3dDocModel object.

## setAttributesFrom

`setAttributesFrom({model})`

* **model** Xc3dDocModel object.

Set the attributes for the object from another Xc3dDocModel object.

## clone

`clone()`

* **return** Xc3dDocModel object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.

# Xc3dDocAnnotation

`class Xc3dDocAnnotation extends Xc3dDocDrawableObject`

## constructor

`constructor()`

## setAssociatedParts

`setAssociatedParts({associatedParts})`

* **associatedParts** Array containing associated parts.

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

# Xc3dDocConstruction

`class Xc3dDocConstruction extends Xc3dDocDrawableObject`

## constructor

`constructor()`

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

# Xc3dDocDrawableObject

`class Xc3dDocDrawableObject`

## constructor

`constructor({name = ''} = {})`

* **name** String representing name.

## userData

`get userData()`

* **return* Object containing user data.

## clone

`clone()`

* **return** Xc3dDocModel object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.

# Xc3dDocExternalDocument

`class Xc3dDocExternalDocument extends Xc3dDocDrawableObject`

## constructor

`constructor({filePath, name = 'assembly', matrix = new XcGm3dMatrix()} = {})`

* **filePath** String representing file path.
* **name** String representing the name.
* **matrix** XcGm3dMatrix representing transform.

## getModelFromAssembly

`static getModelFromAssembly({assembly})`

* **assembly** XcGmAssembly object
* **return** Xc3dDocExternalDocument object or undefined if not found.

Find the Xc3dDocExternalDocument object using XcGmAssembly object.

## filePath

`filePath` String representing file path.

## matrix

`matrix` XcGm3dMatrix representing transform.

## clone

`clone()`

* **return** Xc3dDocExternalDocument object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.

# Xc3dDocLinearDimension

`class Xc3dDocLinearDimension extends Xc3dDocAnnotation`

## constructor

`constructor({position1, position2, upVector, height, name = 'linear dimension'})`

## setParameters

`setParameters({position1, position2, upVector, height})`

## clone

`clone()`

* **return** Xc3dDocModel object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.

# Xc3dDocProgrammableModel

`class Xc3dDocProgrammableModel extends Xc3dDocDrawableObject`

## matrix

`matrix` XcGm3dMatrix object representing a transform.

## constructor

`constructor({ color = null, name = 'programmable model', texture = null, matrix = null, } = {})`

## code (getter)

`get code()`

## code (setter)

`set code(code)`

## clone

`clone()`

* **return** Xc3dDocModel object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.

# Xc3dDocSTLModel

`class Xc3dDocSTLModel extends Xc3dDocDrawableObject`

## constructor

```
constructor({
                name = 'stl model',
                filePath,
                document,
                isStaticPath = false,
                matrix = new XcGm3dMatrix(),
                color = new THREE.Color('lightslategray'),  
              })
```

* **name** String representing Xc3dDocSTLModel object's name.

* **filePath** String representing file path.

* **document** Xc3dDocDocument object representing document for 3D modeling.

* **isStaticPath** Boolean representing the path whether static or not.

* **matrix** XcGm3dMatrix object representing the position and direction of Xc3dDocSTLModel object.

* **color** THREE.Color object representing object color, the default color is `lightslategray`.

## clone

`clone()`

* **return** Xc3dDocExternalDocument object.

Clone the object.

## save

`save()`

* **return** Object containing the serialized data.

## load

`load({data})`

* **data** Object containing the serialized data.

Load the serialized data.

## generateRenderingObject

`generateRenderingObject()`

* **return** Three.js Object3D.

Generate the Three.js Object3D representing the object.

## transformBy

`transformBy({matrix})`

* **matrix** XcGm3dMatrix object representing a transform.

Transform the object using the provided matrix.
