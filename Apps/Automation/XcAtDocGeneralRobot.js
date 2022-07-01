class XcAtDocGeneralRobot extends Xc3dDocDrawableObject {
    #geometryDefinition;
    #angles;
    #matrix;

    #jointCoordinateSystem;
    #jointTypes;
    #jointMinValue;
    #jointMaxValue;
    #DHParameters;
    #target;
    #error;

    #robotThree;
    #robotBones;
    #renderRobotBones;
    #jointMatrixes;

    constructor({
                    name = `XcAtDocGeneralRobot`,
                    geometryDefinition = null,
                    matrix = new XcGm3dMatrix(),
                }) {
        super({name});
        if(geometryDefinition) {
            this.#geometryDefinition = [...geometryDefinition];
        }
        else
        {
            this.#geometryDefinition = [];
        }

        this.#matrix = matrix.clone();

        this.#jointCoordinateSystem = [];
        this.#jointTypes = [];
        this.#jointMinValue = [];
        this.#jointMaxValue = [];
        this.#DHParameters = [];
        this.#angles = [];
        this.#jointMatrixes = [];

        this.#robotBones = [];
        this.#renderRobotBones = [];
        this.#target = null;
        this.#error = null;
        this.#robotThree = null;

        if(this.#geometryDefinition) {
            this.generateDefineParameters();
            this.generateBody();
        }
    }

    init ({
             name = `XcAtDocGeneralRobot`,
             geometryDefinition = null,
             matrix = new XcGm3dMatrix(),
          }) {
        this.name = name;
        if(geometryDefinition) {
            this.#geometryDefinition = [...geometryDefinition];
        }
        this.#matrix = matrix.clone();

        if (this.#geometryDefinition) {
            this.generateDefineParameters();
            this.generateBody();
        }
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

        const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        this.#jointMatrixes = [...arrayMatrix];
        this.#applyTransformaition();
    }

    setAngle({index, angle}) {
        if (index < this.#angles.length) {
            this.#angles[index] = angle;

            const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
            const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
            this.#jointMatrixes = [...arrayMatrix];
            this.#applyTransformaition();
        }
    }

    set geometryDefinition(geometryDefinition) {
        this.#geometryDefinition = [...geometryDefinition];
        this.generateDefineParameters();
        this.generateBody();
    }

    set matrix(matrix) {
        this.#matrix = matrix.clone();
        this.#applyTransformaition();
    }

    get target() {
        return this.#target;
    }

    set target(coordinateSystem) {
        this.#target = coordinateSystem;

        const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        const matrix = this.#target.toMatrix();
        const inverseMatrix= this.#matrix.inverse();
        matrix.multiply({matrix: inverseMatrix});
        const angles = kinematics.IK(matrix,this.#angles);
        this.#angles = [...angles];
        const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        this.#jointMatrixes = [...arrayMatrix];
        this.#applyTransformaition();
    }

    reset() {
        const angles = [];
        for(let index = 0; index < this.#angles.length; ++index) {
            angles.push(0.0);
        }
        this.#angles = angles;

        const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        this.#jointMatrixes = [...arrayMatrix];
        this.#applyTransformaition();
    }

    generateDefineParameters() {
        this.#error = null;
        for (const definition of this.#geometryDefinition) {
            if (definition) {
                const zAxisDirection = new XcGm3dVector({
                    x: definition.direction[0],
                    y: definition.direction[1],
                    z: definition.direction[2]
                });

                const jointCoordinateSystem = new XcGmCoordinateSystem({
                    origin: new XcGm3dPosition({
                        x: definition.location[0],
                        y: definition.location[1],
                        z: definition.location[2]
                    }),
                    zAxisDirection,
                    xAxisDirection: zAxisDirection.perpVector(),
                });
                this.#jointCoordinateSystem.push(jointCoordinateSystem);
                this.#jointTypes.push(definition.type);
                this.#jointMinValue.push(definition.minValue);
                this.#jointMaxValue.push(definition.maxValue);
                this.#angles.push(0.0);
            }
        }

        //test
        // let tcp = this.#jointCoordinateSystem[this.#jointCoordinateSystem.length - 1];
        // const matrixTcp = tcp.toMatrix();
        // matrixTcp.preMultiply({matrix: this.#matrix});
        // this.#target = XcGmCoordinateSystem.fromMatrix({matrix: matrixTcp});

        // const origin = new XcGm3dPosition({x: 0.0, y: 0.0, z: 0.0});
        // const xAxisDirection = new XcGm3dVector({x: 1, y: 0, z: 0});
        // const zAxisDirection = new XcGm3dVector({x: 0, y: 0, z: 1});
        // const coordinateSystemWorld = new XcGmCoordinateSystem({origin: origin, zAxisDirection: zAxisDirection, xAxisDirection: xAxisDirection});
        //
        // const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        // const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        // finalMatrix.preMultiply({matrix: this.#matrix});
        // const matrix = coordinateSystemWorld.toMatrix();
        // finalMatrix.preMultiply({matrix});
        // this.#target = XcGmCoordinateSystem.fromMatrix({matrix: finalMatrix});
        // XcSysAssert({assertion: matrixTcp.isEqualTo({matrix: finalMatrix})});

        const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        this.#jointMatrixes = [...arrayMatrix];
    }

    generateBody() {
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
                coordinateSystem
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
                coordinateSystem
            });
            linkRadius *= 0.9;

            return link;
        };

        try {
            for (let i = 1; i < this.#jointCoordinateSystem.length; ++i) {
                const joint = createjoint({coordiateSystem: this.#jointCoordinateSystem[i-1]});
                const link = createLink({
                    startLinkLocation: this.#jointCoordinateSystem[i-1],
                    endLinkLocation: this.#jointCoordinateSystem[i]
                });

                this.#robotBones.push({joint, link});
                jointRadius *= 0.9;
            }
        } catch (error) {
            this.#error = error;
            throw "The WRONG defination of the robot: " +`(${error})`;
        }
    }

    #applyTransformaition() {
        for (let index = 0; index < this.#angles.length; ++index) {
            if (this.#renderRobotBones[index]){
                this.#renderRobotBones[index].position.set(0, 0, 0);
                this.#renderRobotBones[index].rotation.set(0, 0, 0);
                this.#renderRobotBones[index].scale.set(1, 1, 1);
                this.#renderRobotBones[index].applyMatrix4(this.#jointMatrixes[index].toThreeMatrix4());
                this.#renderRobotBones[index].updateMatrix();
                this.#renderRobotBones[index].updateMatrixWorld();
            }
        }

        if (this.#robotThree){
            this.#robotThree.position.set(0, 0, 0);
            this.#robotThree.rotation.set(0, 0, 0);
            this.#robotThree.scale.set(1, 1, 1);
            this.#robotThree.applyMatrix4(this.#matrix.toThreeMatrix4());
            this.#robotThree.updateMatrix();
            this.#robotThree.updateMatrixWorld();
        }

        const origin = new XcGm3dPosition({x: 0.0, y: 0.0, z: 0.0});
        const xAxisDirection = new XcGm3dVector({x: 1, y: 0, z: 0});
        const zAxisDirection = new XcGm3dVector({x: 0, y: 0, z: 1});
        const coordinateSystemWorld = new XcGmCoordinateSystem({origin: origin, zAxisDirection: zAxisDirection, xAxisDirection: xAxisDirection});

        const kinematics = new XcAtGeneralKinematics(this.#geometryDefinition, this.#jointCoordinateSystem);
        const [finalMatrix, arrayMatrix] = kinematics.forwardKinematics(this.#angles);
        finalMatrix.preMultiply({matrix: this.#matrix});
        const matrix = coordinateSystemWorld.toMatrix();
        finalMatrix.preMultiply({matrix});
        this.#target = XcGmCoordinateSystem.fromMatrix({matrix: finalMatrix});
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
        //this.#robotThree.clear();
        this.#robotThree = new THREE.Group();
        let parentObject = this.#robotThree;

        if (this.#error) {
            return renderingObjectGroup;
        }

        for (let robotBone of this.#robotBones) {
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
                //opacity: 0.9,
                //transparent: true,
            });
            renderingObjectGroup.add(renderingObjectLink);
            parentObject.add(renderingObjectGroup);
            parentObject = renderingObjectGroup;

            this.#renderRobotBones.push(renderingObjectGroup);
            //this.#renderRobotBones.push({renderingObjectJoint, renderingObjectLink});
        }

        this.#applyTransformaition();
        return this.#robotThree;
    }

    transform({matrix}) {
        this.#matrix.Multiply({matrix});
        this.#applyTransformaition();
    }
}

Xc3dDocDocument.registerDrawableObjectType({cls: XcAtDocGeneralRobot});
