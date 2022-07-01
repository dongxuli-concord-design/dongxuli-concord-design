# Introduction

Document and key object model classes for automation.

# XcAtDocGeneralRobot

## constructor

```javascript
constructor({name = `XcAtDocGeneralRobot`,
            geometryDefinition = null,  
            matrix = new XcGm3dMatrix(),
            })
```

* **geometryDefinition** the geometry definition of a robot.

Example:
``` javascript
let defaultRobotGeometryDefinition = [
    {
    location: [0,0,0],
    direction: [0,0,1],
    type: 'revolute',  //`fix` `prismatic`
    minValue: -110,
    maxValue: 77
    },
    {
    location: [0,0.0,0.5],
    direction: [0,1,0],
    type: 'revolute',
    minValue: -110,
    maxValue: 77
    },
    {
    location: [0.5,0.0,1],
    direction: [0,0,1],
    type: 'revolute',
    minValue: -110,
    maxValue: 77
    },
]
```

* **matrix** XcGm3dMatrix object representing a transform.

## init

```javascript
init({
    name = `XcAtDocGeneralRobot`,
    geometryDefinition = null,
    matrix = new XcGm3dMatrix(),
})
```

Example:
``` javascript
const defaultRobotGeometryDefinition = [
    {
    location: [0,0,0],
    direction: [0,0,1],
    type: 'revolute',  //`fix` `prismatic`
    minValue: -110,
    maxValue: 77
    },
    {
    location: [0,0.0,0.5],
    direction: [0,1,0],
    type: 'revolute',
    minValue: -110,
    maxValue: 77
    },
]

const myRobot = new XcAtDocGeneralRobot({name: `myRobot`}）;
myRobot.init({geometryDefinition: defaultRobotGeometryDefinition}); 
```

Initialize the XcAtDocGeneralRobot object.

## get angles

`get angles()`

## set angles

`set angles(angles)`

## set geometryDefinition

`set geometryDefinition(geometryDefinition)`

## set matrix

`set matrix(matrix)`

## clone

`clone()`

* **return** XcAtDocGeneralRobot object.

Clone the object.

## copy

`copy()`

* **return** XcAtDocGeneralRobot object.

Copy the object.

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