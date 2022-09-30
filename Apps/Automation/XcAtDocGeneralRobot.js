class XcAtDocGeneralRobot extends Xc3dDocDrawableObject {
  static ANGLE_TOLERANCE = 0.001; // The max angle tolerance.
  static ROBOT_MOVE_DELT = 0.2;
  #geometryDefinition;
  #angles;
  #matrix;    

  #jointCoordinateSystems;
  #jointTypes;
  #jointMinValues;
  #jointMaxValues;
  #target;
  #error;

  #robotBones;
  #renderRobotBonesOriginal;
  #renderRobotBones;
  #jointMatrixes;
  #robotRenderObject;

  #kinematics;

  constructor({
              name = 'XcAtDocGeneralRobot',
              geometryDefinition,
              matrix = new XcGm3dMatrix(),
            }) {
    super({name});
    this.#geometryDefinition = [...geometryDefinition];
    this.#matrix = matrix.clone();

    this.#jointCoordinateSystems = [];
    this.#jointTypes = [];
    this.#jointMinValues = [];
    this.#jointMaxValues = [];
    this.#angles = [];
    this.#jointMatrixes = [];

    this.#robotBones = [];
    this.#renderRobotBonesOriginal = [];
    this.#renderRobotBones = [];
    this.#target = null;
    this.#error = null;
    this.#robotRenderObject = null;

    this.#generateDefinitionParameters();
    this.#generateBody();
  }

  static load({json, document}) {
    const robot = new XcAtDocGeneralRobot({
      name: json.name,
      geometryDefinition: json.geometryDefinition,
      angles: json.angles,
      matrix: XcGm3dMatrix.fromJSON({json: json.matrix}),
    });

    const userData = {...json.userData};
    robot.userData = userData;

    return robot;
  }

  get angles() {
    return this.#angles;
  }

  set angles(angles) {
    this.#angles = [...angles];

    const [, arrayMatrix] = this.#kinematics.forwardKinematics(this.#angles);
    this.#jointMatrixes = [...arrayMatrix];
  }

  set matrix(matrix) {
    this.#matrix = matrix.clone();
  }

  get target() {
    const origin = new XcGm3dPosition({x: 0, y: 0, z: 0});
    const xAxisDirection = new XcGm3dVector({x: 1, y: 0, z: 0});
    const zAxisDirection = new XcGm3dVector({x: 0, y: 0, z: 1});
    const coordinateSystemWorld = new XcGmCoordinateSystem({origin: origin, zAxisDirection: zAxisDirection, xAxisDirection: xAxisDirection});

    const [finalMatrix, ] = this.#kinematics.forwardKinematics(this.#angles);
    finalMatrix.preMultiply({matrix: this.#matrix});
    const matrix = coordinateSystemWorld.toMatrix();
    finalMatrix.preMultiply({matrix});
    this.#target = XcGmCoordinateSystem.fromMatrix({matrix: finalMatrix});
    return this.#target;
  }

  set target(coordinateSystem) {
    const matrix = coordinateSystem.toMatrix();
    const angles = this.#kinematics.IK(matrix,this.#angles);
    this.#angles = [...angles];
    const [, arrayMatrix] = this.#kinematics.forwardKinematics(this.#angles);
    this.#jointMatrixes = [...arrayMatrix];
  }

  #generateDefinitionParameters() {
    this.#error = null;
    for (const definition of this.#geometryDefinition) {
        const zAxisDirection = new XcGm3dVector({
          x: definition.direction[0],
          y: definition.direction[1],
          z: definition.direction[2],
        });

        const jointCoordinateSystems = new XcGmCoordinateSystem({
          origin: new XcGm3dPosition({
            x: definition.location[0],
            y: definition.location[1],
            z: definition.location[2],
          }),
          zAxisDirection,
          xAxisDirection: zAxisDirection.perpVector(),
        });
        this.#jointCoordinateSystems.push(jointCoordinateSystems);
        this.#jointTypes.push(definition.type);
        this.#jointMinValues.push(definition.minValue);
        this.#jointMaxValues.push(definition.maxValue);
        this.#angles.push(0.0);
    }

    this.#kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystems);
    const [, arrayMatrix] = this.#kinematics.forwardKinematics(this.#angles);
    this.#jointMatrixes = [...arrayMatrix];
  }

  #generateBody() {
    this.#error = null;
    let linkRadius = 0.1;
    let jointRadius = 0.8 * linkRadius;

    // Joint
    const createjoint = ({coordiateSystem}) => {
      const coordinateSystem = coordiateSystem.clone();
      const vector = coordinateSystem.zAxisDirection.clone();
      vector.multiply({scale: -1 * jointRadius});
      const zTranMatrix = XcGm3dMatrix.translationMatrix({vector})
      coordinateSystem.origin.transform({matrix: zTranMatrix});
      let joint = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: 2 * jointRadius,
        coordinateSystem,
      });
      return joint;
    }

    // Link
    const createLink = ({startLinkLocation, endLinkLocation}) => {
      const zAxisDirection = XcGm3dVector.subtract({vector1: endLinkLocation.origin,vector2: startLinkLocation.origin});
      const height = zAxisDirection.length();
      zAxisDirection.normalize();
      const coordinateSystem = new XcGmCoordinateSystem({
        origin: startLinkLocation.origin,
        zAxisDirection,
        xAxisDirection: zAxisDirection.perpVector(),
      });

      const link = XcGmBody.createSolidCylinder({
        radius: linkRadius,
        height,
        coordinateSystem,
      });
      linkRadius *= 0.9;

      return link;
    };

    try {
      for (let i = 1; i < this.#jointCoordinateSystems.length; ++i) {
        const joint = createjoint({coordiateSystem: this.#jointCoordinateSystems[i-1]});
        const link = createLink({
          startLinkLocation: this.#jointCoordinateSystems[i-1],
          endLinkLocation: this.#jointCoordinateSystems[i],
        });

        this.#robotBones.push({joint, link});
        jointRadius *= 0.9;
      }
    } catch (error) {
      this.#error = error;
      throw "The WRONG defination of the robot: " +`(${error})`;
    }

    this.#renderRobotBones = [];
    this.#renderRobotBonesOriginal = [];
    for (const robotBone of this.#robotBones) {
      const renderingObjectGroup = new THREE.Group();
      const renderingObjectJoint = Xc3dDocDocument.generateRenderingForBody({
        body: robotBone.joint,
        color: new THREE.Color('gold'),
        opacity: 0.5,
        transparent: true,
      });
      renderingObjectGroup.add(renderingObjectJoint);

      const renderingObjectLink = Xc3dDocDocument.generateRenderingForBody({
        body: robotBone.link,
        color: new THREE.Color( `lightgray` ),
      });
      renderingObjectGroup.add(renderingObjectLink);

      this.#renderRobotBonesOriginal.push(renderingObjectGroup);
      this.#renderRobotBones.push(renderingObjectGroup.clone());
    }
  }

  clone() {
    const newRobot = new XcAtDocGeneralRobot({
      name: this.name + ' clone',
      geometryDefinition: [...this.#geometryDefinition],
      angles: [...this.#angles],
      matrix: this.#matrix.clone(),
    });

    newRobot.userData = {...this.userData};
    return newRobot;
  }

  copy({other}) {
    super.copy({other});
    this.#geometryDefinition = [...other.#geometryDefinition];
    this.#angles = [...other.#angles];
    this.#matrix = other.#matrix.clone();
  }

  save({document}) {
    const data = super.save({document});

    return {
      ...data,
      geometryDefinition: [...this.#geometryDefinition],
      angles: [...this.#angles],
      matrix: this.#matrix.toJSON(),
    }
  }

  generateRenderingObject() {
    this.#robotRenderObject = new THREE.Group();
    let parentObject = this.#robotRenderObject;

    this.#renderRobotBones = [];
    for (let index = 0; index < this.#renderRobotBonesOriginal.length; ++index) {
      const boneClone = this.#renderRobotBonesOriginal[index].clone();
      boneClone.applyMatrix4(this.#jointMatrixes[index].toThreeMatrix4());
      parentObject.add(boneClone);
      this.#renderRobotBones.push(boneClone);
      parentObject = boneClone;
    }
   
    this.#robotRenderObject.applyMatrix4(this.#matrix.toThreeMatrix4());
    this.#robotRenderObject.updateMatrix();
    this.#robotRenderObject.updateMatrixWorld();

    return this.#robotRenderObject;
  }

  transform({matrix}) {
    this.#matrix.multiply({matrix});
  }

  *moveToOriginalPosition() {
    for(let index = 0; index < this.#angles.length; ++index) {
      this.#angles[index] = 0.0;
    }

    const [, arrayMatrix] = this.#kinematics.forwardKinematics(this.#angles);
    this.#jointMatrixes = [...arrayMatrix];
    yield;
  }
  
  * moveLine({targetCoordinateSystem}) {
    const currentCoordinateSystem = this.target;
    const currentPosition = currentCoordinateSystem.origin;
    const targetPostion = targetCoordinateSystem.origin;
    const targetXDir = targetCoordinateSystem.xAxisDirection;
    const targetZDir = targetCoordinateSystem.zAxisDirection;

    const detPosition = XcGm3dPosition.subtract({position: targetPostion, positionOrVector: currentPosition.toVector()});
    const distance = detPosition.length();
    const steps = Math.ceil(distance / XcAtDocGeneralRobot.ROBOT_MOVE_DELT);
    detPosition.divide({scale: steps});

    const position = currentPosition.clone();
    for (let i = 0; i < steps; ++i) {
      const detCoordinateSystem = new XcGmCoordinateSystem();
      position.add({vector: detPosition});
      detCoordinateSystem.origin = position;
      detCoordinateSystem.xAxisDirection = targetXDir;
      detCoordinateSystem.zAxisDirection = targetZDir;
      
      this.#angles = this.#kinematics.IK(detCoordinateSystem.toMatrix(),this.#angles);
      const [, arrayMatrix] = this.#kinematics.forwardKinematics(this.#angles);
      this.#jointMatrixes = [...arrayMatrix];

      for (let index = 0; index < this.#renderRobotBones.length; ++index) {
        this.#renderRobotBones[index].position.set(0, 0, 0);
        this.#renderRobotBones[index].rotation.set(0, 0, 0);
        this.#renderRobotBones[index].scale.set(1, 1, 1);
        this.#renderRobotBones[index].applyMatrix4(this.#jointMatrixes[index].toThreeMatrix4());
        this.#renderRobotBones[index].updateMatrix();
        this.#renderRobotBones[index].updateMatrixWorld();
      }
    
      this.#robotRenderObject.rotation.set(0, 0, 0);
      this.#robotRenderObject.scale.set(1, 1, 1);
      this.#robotRenderObject.applyMatrix4(this.#matrix.toThreeMatrix4());
      this.#robotRenderObject.updateMatrix();
      this.#robotRenderObject.updateMatrixWorld();

      yield;
    }
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: XcAtDocGeneralRobot});
