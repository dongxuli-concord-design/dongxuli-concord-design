class XcAtDoc6DOFRobotArm extends Xc3dDocDrawableObject {
  #geometryDefinition;
  #angles;

  #matrix;

  #jointAxis0;
  #jointAxis1;
  #jointAxis2;
  #jointAxis3;
  #jointAxis4;
  #jointAxis5;

  #joint0;
  #joint1;
  #joint2;
  #joint3;
  #joint4;
  #joint5;

  #link0;
  #link1;
  #link2;
  #link3;
  #link4;

  #error;

  #target;

  constructor({
                name = `XcAtDoc6DOFRobotArm`,
                geometryDefinition = XcRsApp.defaultRobotGeometryDefinition,
                angles = [0, 0, 0, 0, 0, 0],
                matrix = new XcGm3dMatrix(),
              }) {
    super({name});
    this.#geometryDefinition = [...geometryDefinition];
    this.#angles = [...angles];
    this.#matrix = matrix.clone();

    this.#jointAxis0 = null;
    this.#jointAxis1 = null;
    this.#jointAxis2 = null;
    this.#jointAxis3 = null;
    this.#jointAxis4 = null;
    this.#jointAxis5 = null;

    this.#joint0 = null;
    this.#joint1 = null;
    this.#joint2 = null;
    this.#joint3 = null;
    this.#joint4 = null;
    this.#joint5 = null;

    this.#link0 = null;
    this.#link1 = null;
    this.#link2 = null;
    this.#link3 = null;
    this.#link4 = null;

    this.#target = [];

    this.#error = null;

    this.generateBody();
  }

  static load({json, document}) {
    const robot = new XcAtDoc6DOFRobotArm({
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
    this.generateBody();
  }

  set geometryDefinition(geometryDefinition) {
    this.#geometryDefinition = [...geometryDefinition];
    this.generateBody();
  }

  set matrix(matrix) {
    this.#matrix = matrix.clone();
    this.generateBody();
  }

  get target() {
    return this.#target;
  }

  set target({x, y, z, a, b, c}) {
    const eulerAngles = new THREE.Euler(a, b, c, 'XYZ');
    const xDir = new THREE.Vector3(1, 0, 0);
    const yDir = new THREE.Vector3(0, 1, 0);
    const zDir = new THREE.Vector3(0, 0, 1);
    xDir.applyEuler(eulerAngles);
    yDir.applyEuler(eulerAngles);
    zDir.applyEuler(eulerAngles);
    const xVector = XcGm3dVector.fromThreeVector3({threeVector3: xDir});
    const yVector = XcGm3dVector.fromThreeVector3({threeVector3: yDir});
    const zVector = XcGm3dVector.fromThreeVector3({threeVector3: zDir});
    const location = new XcGm3dPosition({x, y, z});
    const inverseMatrix = this.#matrix.inverse();
    location.transform({matrix: inverseMatrix});
    xVector.transform({matrix: inverseMatrix});
    yVector.transform({matrix: inverseMatrix});
    zVector.transform({matrix: inverseMatrix});
    xVector.normalize();
    yVector.normalize();
    zVector.normalize();
    const localCoordinateSystem = new XcGmCoordinateSystem({
      origin: location,
      zAxisDirection: zVector,
      xAxisDirection: xVector,
    });
    const rotationMatrix = localCoordinateSystem.toMatrix();
    const newEulerAngles = new THREE.Euler();
    newEulerAngles.setFromRotationMatrix(rotationMatrix.toThreeMatrix4());

    const kinematrics = new XcAtKinematics(this.#geometryDefinition);
    kinematrics.calculateAngles(location.x, location.y, location.z, newEulerAngles.x, newEulerAngles.y, newEulerAngles.z, this.#angles);
    this.generateBody();
  }

  generateBody() {
    this.#error = null;

    try {
      for (const angle of this.#angles) {
        if (Number.isNaN(angle)) {
          throw 'The robot pose is not reachable';
        }
      }

      // Set target (TCP)
      // TODO: Add euler to XcGm
      const kinematrics = new XcAtKinematics(this.#geometryDefinition);
      kinematrics.calculateTCP(this.#angles[0], this.#angles[1], this.#angles[2], this.#angles[3], this.#angles[4], this.#angles[5], this.#target);
      // transform target position
      const targetPosition = new XcGm3dPosition({x: this.#target[0], y: this.#target[1], z: this.#target[2]});
      targetPosition.transform({matrix: this.#matrix});
      // transform target rotation
      const threeMatrix4 = new THREE.Matrix4();
      const eulerAngle = new THREE.Euler(this.#target[3], this.#target[4], this.#target[5], 'XYZ');
      threeMatrix4.makeRotationFromEuler(eulerAngle);
      const rotationMatrix = XcGm3dMatrix.fromThreeMatrix4({threeMatrix4});
      rotationMatrix.preMultiply({matrix: this.#matrix});
      const newEulerAngle = new THREE.Euler();
      newEulerAngle.setFromRotationMatrix(rotationMatrix.toThreeMatrix4());

      this.#target[0] = targetPosition.x;
      this.#target[1] = targetPosition.y;
      this.#target[2] = targetPosition.z;
      this.#target[3] = newEulerAngle.x;
      this.#target[4] = newEulerAngle.y;
      this.#target[5] = newEulerAngle.z;

      const jointRadius = 0.05;
      const jointHeight = 0.05;
      const linkThickness = 0.05;

      const robotOrigin = new XcGm3dPosition({x: 0, y: 0, z: 0});

      this.#jointAxis0 = new XcGm3dAxis({
        position: robotOrigin,
        direction: new XcGm3dVector({x: 0, y: 0, z: 1}),
      });
      this.#jointAxis1 = new XcGm3dAxis({
        position: new XcGm3dPosition({
          x: this.#jointAxis0.position.x + this.#geometryDefinition[0][0],
          y: this.#jointAxis0.position.y + this.#geometryDefinition[0][1],
          z: this.#jointAxis0.position.z + this.#geometryDefinition[0][2]
        }),
        direction: new XcGm3dVector({x: 0, y: 1, z: 0})
      });
      this.#jointAxis2 = new XcGm3dAxis({
        position: new XcGm3dPosition({
          x: this.#jointAxis1.position.x + this.#geometryDefinition[1][0],
          y: this.#jointAxis1.position.y + this.#geometryDefinition[1][1],
          z: this.#jointAxis1.position.z + this.#geometryDefinition[1][2]
        }),
        direction: new XcGm3dVector({x: 0, y: 1, z: 0})
      });
      this.#jointAxis3 = new XcGm3dAxis({
        position: new XcGm3dPosition({
          x: this.#jointAxis2.position.x + this.#geometryDefinition[2][0],
          y: this.#jointAxis2.position.y + this.#geometryDefinition[2][1],
          z: this.#jointAxis2.position.z + this.#geometryDefinition[2][2]
        }),
        direction: new XcGm3dVector({x: 1, y: 0, z: 0})
      });
      this.#jointAxis4 = new XcGm3dAxis({
        position: new XcGm3dPosition({
          x: this.#jointAxis3.position.x + this.#geometryDefinition[3][0],
          y: this.#jointAxis3.position.y + this.#geometryDefinition[3][1],
          z: this.#jointAxis3.position.z + this.#geometryDefinition[3][2]
        }),
        direction: new XcGm3dVector({x: 0, y: 1, z: 0})
      });
      this.#jointAxis5 = new XcGm3dAxis({
        position: new XcGm3dPosition({
          x: this.#jointAxis4.position.x + this.#geometryDefinition[4][0],
          y: this.#jointAxis4.position.y + this.#geometryDefinition[4][1],
          z: this.#jointAxis4.position.z + this.#geometryDefinition[4][2]
        }),
        direction: new XcGm3dVector({x: 1, y: 0, z: 0})
      });

      // Joints
      const joint0CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis0.position.x,
          y: this.#jointAxis0.position.y,
          z: this.#jointAxis0.position.z - jointHeight / 2
        }),
        zAxisDirection: this.#jointAxis0.direction,
        xAxisDirection: this.#jointAxis0.direction.perpVector(), //new XcGm3dVector({x: 1, y: 0, z: 0}),
      });
      this.#joint0 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint0CoordinateSystem
      });

      const joint1CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis1.position.x,
          y: this.#jointAxis1.position.y - jointHeight / 2,
          z: this.#jointAxis1.position.z
        }),
        zAxisDirection: this.#jointAxis1.direction,
        xAxisDirection: this.#jointAxis1.direction.perpVector(), // new XcGm3dVector({x: 1, y: 0, z: 0}),
      });
      this.#joint1 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint1CoordinateSystem
      });

      const joint2CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis2.position.x,
          y: this.#jointAxis2.position.y - jointHeight / 2,
          z: this.#jointAxis2.position.z
        }),
        zAxisDirection: this.#jointAxis2.direction,
        xAxisDirection: this.#jointAxis2.direction.perpVector(), // new XcGm3dVector({x: 1, y: 0, z: 0}),
      });
      this.#joint2 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint2CoordinateSystem
      });

      const joint3CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis3.position.x - jointHeight / 2,
          y: this.#jointAxis3.position.y,
          z: this.#jointAxis3.position.z
        }),
        zAxisDirection: this.#jointAxis3.direction,
        xAxisDirection: this.#jointAxis3.direction.perpVector(), // new XcGm3dVector({x: 0, y: 0, z: -1}),
      });
      this.#joint3 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint3CoordinateSystem
      });

      const joint4CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis4.position.x,
          y: this.#jointAxis4.position.y - jointHeight / 2,
          z: this.#jointAxis4.position.z
        }),
        zAxisDirection: this.#jointAxis4.direction,
        xAxisDirection: this.#jointAxis4.direction.perpVector(), // new XcGm3dVector({x: 1, y: 0, z: 0}),
      });
      this.#joint4 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint4CoordinateSystem
      });

      const joint5CoordinateSystem = new XcGmCoordinateSystem({
        origin: new XcGm3dPosition({
          x: this.#jointAxis5.position.x - jointHeight / 2,
          y: this.#jointAxis5.position.y,
          z: this.#jointAxis5.position.z
        }),
        zAxisDirection: this.#jointAxis5.direction,
        xAxisDirection: this.#jointAxis5.direction.perpVector(), // new XcGm3dVector({x: 0, y: 0, z: -1}),
      });
      this.#joint5 = XcGmBody.createSolidCylinder({
        radius: jointRadius,
        height: jointHeight,
        coordinateSystem: joint5CoordinateSystem
      });

      // Links
      const createLink = ({startLinkLocation, endLinkLocation, linkX, linkY, linkZ}) => {
        const linkLocation = new XcGm3dPosition({
          x: (startLinkLocation.x + endLinkLocation.x) / 2,
          y: (startLinkLocation.y + endLinkLocation.y) / 2,
          z: (startLinkLocation.z + endLinkLocation.z) / 2
        });
        const zDiff = Math.abs(endLinkLocation.z - startLinkLocation.z);
        linkLocation.z -= (zDiff / 2 + linkThickness / 2);
        const linkCoordinateSystem = new XcGmCoordinateSystem({
          origin: linkLocation,
        });
        const link = XcGmBody.createSolidBlock({
          x: linkX + linkThickness,
          y: linkY + linkThickness,
          z: linkZ + linkThickness,
          coordinateSystem: linkCoordinateSystem
        });

        return link;
      };

      this.#link0 = createLink({
        startLinkLocation: this.#jointAxis0.position,
        endLinkLocation: this.#jointAxis1.position,
        linkX: this.#geometryDefinition[0][0],
        linkY: this.#geometryDefinition[0][1],
        linkZ: this.#geometryDefinition[0][2],
      });

      this.#link1 = createLink({
        startLinkLocation: this.#jointAxis1.position,
        endLinkLocation: this.#jointAxis2.position,
        linkX: this.#geometryDefinition[1][0],
        linkY: this.#geometryDefinition[1][1],
        linkZ: this.#geometryDefinition[1][2],
      });

      this.#link2 = createLink({
        startLinkLocation: this.#jointAxis2.position,
        endLinkLocation: this.#jointAxis3.position,
        linkX: this.#geometryDefinition[2][0],
        linkY: this.#geometryDefinition[2][1],
        linkZ: this.#geometryDefinition[2][2],
      });

      this.#link3 = createLink({
        startLinkLocation: this.#jointAxis3.position,
        endLinkLocation: this.#jointAxis4.position,
        linkX: this.#geometryDefinition[3][0],
        linkY: this.#geometryDefinition[3][1],
        linkZ: this.#geometryDefinition[3][2],
      });

      this.#link4 = createLink({
        startLinkLocation: this.#jointAxis4.position,
        endLinkLocation: this.#jointAxis5.position,
        linkX: this.#geometryDefinition[4][0],
        linkY: this.#geometryDefinition[4][1],
        linkZ: this.#geometryDefinition[4][2],
      });

      // Apply angles
      const transformObjects = ({bodies, jointAxes, matrix}) => {
        for (const body of bodies) {
          body.transform({matrix});
        }
        for (const jointAxis of jointAxes) {
          jointAxis.transform({matrix});
        }
      }

      // Transform objects using angles
      transformObjects({
        bodies: [
          this.#joint0, this.#joint1, this.#joint2, this.#joint3, this.#joint4, this.#joint5,
          this.#link0, this.#link1, this.#link2, this.#link3, this.#link4
        ],
        jointAxes: [this.#jointAxis0, this.#jointAxis1, this.#jointAxis2, this.#jointAxis3, this.#jointAxis4, this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[0], axis: this.#jointAxis0})
      });
      transformObjects({
        bodies: [
          this.#joint1, this.#joint2, this.#joint3, this.#joint4, this.#joint5,
          this.#link1, this.#link2, this.#link3, this.#link4
        ],
        jointAxes: [this.#jointAxis1, this.#jointAxis2, this.#jointAxis3, this.#jointAxis4, this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[1], axis: this.#jointAxis1})
      });
      transformObjects({
        bodies: [
          this.#joint2, this.#joint3, this.#joint4, this.#joint5,
          this.#link2, this.#link3, this.#link4
        ],
        jointAxes: [this.#jointAxis2, this.#jointAxis3, this.#jointAxis4, this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[2], axis: this.#jointAxis2})
      });
      transformObjects({
        bodies: [
          this.#joint3, this.#joint4, this.#joint5,
          this.#link3, this.#link4
        ],
        jointAxes: [this.#jointAxis3, this.#jointAxis4, this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[3], axis: this.#jointAxis3})
      });
      transformObjects({
        bodies: [
          this.#joint4, this.#joint5,
          this.#link4
        ],
        jointAxes: [this.#jointAxis4, this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[4], axis: this.#jointAxis4})
      });
      transformObjects({
        bodies: [
          this.#joint5,
        ],
        jointAxes: [this.#jointAxis5],
        matrix: XcGm3dMatrix.rotationMatrix({angle: this.#angles[5], axis: this.#jointAxis5})
      });

      // Apply global transformation
      const bodies = [
        this.#joint0, this.#joint1, this.#joint2, this.#joint3, this.#joint4, this.#joint5,
        this.#link0, this.#link1, this.#link2, this.#link3, this.#link4
      ];

      for (const body of bodies) {
        body.transform({matrix: this.#matrix});
      }

      const jointAxes = [this.#jointAxis0, this.#jointAxis1, this.#jointAxis2, this.#jointAxis3, this.#jointAxis4, this.#jointAxis5];
      for (const jointAxis of jointAxes) {
        jointAxis.transform({matrix: this.#matrix});
      }
    } catch (error) {
      this.#error = error;
      console.error(error);
    }
  }

  clone() {
    const newRobot = new XcAtDoc6DOFRobotArm({
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
    this.#angles = [...other.angles];
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
    const renderingObjectGroup = new THREE.Group();

    if (this.#error) {
      return renderingObjectGroup;
    }

    const bodies = [
      this.#joint0, this.#joint1, this.#joint2, this.#joint3, this.#joint4, this.#joint5,
      this.#link0, this.#link1, this.#link2, this.#link3, this.#link4
    ];

    for (const body of bodies) {
      const renderingObject = Xc3dDocDocument.generateRenderingForBody({body});
      renderingObjectGroup.add(renderingObject);
    }

    // Draw target
    // TODO: Use XcGm lib
    const eulerAngles = new THREE.Euler(this.#target[3], this.#target[4], this.#target[5], 'XYZ');
    const xDir = new THREE.Vector3(1, 0, 0);
    const yDir = new THREE.Vector3(0, 1, 0);
    const zDir = new THREE.Vector3(0, 0, 1);
    xDir.applyEuler(eulerAngles);
    yDir.applyEuler(eulerAngles);
    zDir.applyEuler(eulerAngles);
    const origin = new XcGm3dPosition({x: this.#target[0], y: this.#target[1], z: this.#target[2]});
    const axisLength = (XcSysManager.canvasDiv.clientHeight / 4.0) / Xc3dUIManager.getNumPixelsInUnit();
    const xArrow = new THREE.ArrowHelper(xDir, origin, axisLength, new THREE.Color('red'));
    const yArrow = new THREE.ArrowHelper(yDir, origin, axisLength, new THREE.Color('green'));
    const zArrow = new THREE.ArrowHelper(zDir, origin, axisLength, new THREE.Color('blue'));
    const arrows = new THREE.Group();
    arrows.add(xArrow);
    arrows.add(yArrow);
    arrows.add(zArrow);
    renderingObjectGroup.add(arrows);

    return renderingObjectGroup;
  }

  transform({matrix}) {
    this.#matrix.preMultiply({matrix});
    this.generateBody();
  }
}

Xc3dDocDocument.registerDrawableObjectType({cls: XcAtDoc6DOFRobotArm});
