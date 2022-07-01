class Xc3dUIPositionSnapper {
  constructor() {
  }

  static #testInside({child, parent}) {
    if (child === parent) {
      return true;
    } else {
      if (child.parent) {
        return Xc3dUIPositionSnapper.#testInside({child: child.parent, parent});
      } else {
        return false;
      }
    }
  }

  #getModelingObjectSnapPoints(pickedRenderingObject, kernelObject, basePosition) {
    const positionAndMarks = [];

    try {
      if (kernelObject instanceof XcGmVertex) {
        const vertex = kernelObject;
        const position = vertex.point.position;

        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          ...position.toArray(),
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
          color: new THREE.Color(0x0040ff),
          size: Xc3dUIConfig.pickingPrecisionInPixels + 5,
          sizeAttenuation: false
        });
        const pointMark = new THREE.Points(geometry, material);
        positionAndMarks.push({
          position: position,
          mark: pointMark
        });
      } else if (kernelObject instanceof XcGmEdge) {
        // TODO: Get midpoint, center point of the edge
        // TODO: Get the edge center, not the prop center.

        const {c_of_g} = XcGmTopology.evalMassPropsFor({topols: [kernelObject], accuracy: 1});
        const objectCenter = new XcGm3dPosition({x: c_of_g[0], y: c_of_g[1], z: c_of_g[2]});

        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          ...objectCenter.toArray(),
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
          color: new THREE.Color(0xffff00),
          size: Xc3dUIConfig.pickingPrecisionInPixels + 5,
          sizeAttenuation: false
        });
        const pointMark = new THREE.Points(geometry, material);
        positionAndMarks.push({
          position: objectCenter,
          mark: pointMark
        });
      } else if (kernelObject instanceof XcGmFace) {
        // TODO: Get midpoint, center point of the face, not the prop center
        const {c_of_g} = XcGmTopology.evalMassPropsFor({topols: [kernelObject], accuracy: 1});
        const objectCenter = new XcGm3dPosition({x: c_of_g[0], y: c_of_g[1], z: c_of_g[2]});

        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          ...objectCenter.toArray(),
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
          color: new THREE.Color(0x8000ff),
          size: Xc3dUIConfig.pickingPrecisionInPixels + 5,
          sizeAttenuation: false
        });
        const pointMark = new THREE.Points(geometry, material);
        positionAndMarks.push({
          position: objectCenter,
          mark: pointMark
        });
      }
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }

    const matrixWorld = XcGm3dMatrix.fromThreeMatrix4({threeMatrix4: pickedRenderingObject.matrixWorld});
    for (const {position, mark} of positionAndMarks) {
      position.transform({matrix: matrixWorld});
      mark.applyMatrix4(pickedRenderingObject.matrixWorld);
    }

    return positionAndMarks;
  }

  #addCandidate({pickedRenderingObject, basePosition, modelingObjectAndSnappingPointMarks}) {
    const associatedModelingKernelEntity = Xc3dDocDocument.getModelingKernelEntityFromRenderingObject({renderingObject: pickedRenderingObject});

    if (!associatedModelingKernelEntity) {
      return;
    }

    if (!modelingObjectAndSnappingPointMarks.has(pickedRenderingObject)) {
      const positionAndMarks = this.#getModelingObjectSnapPoints(pickedRenderingObject, associatedModelingKernelEntity, basePosition);
      modelingObjectAndSnappingPointMarks.set(pickedRenderingObject, positionAndMarks);
    }
  }

  snapAt({
           currentScreenPosition,
           basePosition = null,
           objectSnapMode = true
         }) {
    const targetRenderingObjects = [Xc3dUIManager.document.renderingScene];
    const intersects = Xc3dUIManager.pick({
      screenPosition: currentScreenPosition,
      targetRenderingObjects,
    });
    if (objectSnapMode) {
      const qualifiedIntersects = intersects.filter(intersect => {
        const associatedModelingKernelEntity = Xc3dDocDocument.getModelingKernelEntityFromRenderingObject({renderingObject: intersect.renderingObject});

        if (!associatedModelingKernelEntity) {
          return false;
        }

        if ((associatedModelingKernelEntity instanceof XcGmVertex) ||
          (associatedModelingKernelEntity instanceof XcGmEdge) ||
          (associatedModelingKernelEntity instanceof XcGmFace)) {
          return true;
        }
      });

      if (qualifiedIntersects.length > 0) {
        const modelingObjectAndSnappingPointMarks = new Map();
        let snappedPositionAndMarkOnModelingObject = null;
        for (const intersect of qualifiedIntersects) {
          this.#addCandidate({
            pickedRenderingObject: intersect.renderingObject,
            basePosition,
            modelingObjectAndSnappingPointMarks
          });
        }

        // Check if we can get a snap point from a modeling object
        let minSnapDistance = Xc3dUIConfig.pickingPrecisionInPixels;

        for (const [modellingObject, positionAndMarks] of modelingObjectAndSnappingPointMarks.entries()) {
          for (const positionAndMark of positionAndMarks) {
            const positionOnScreen = Xc3dUIManager.getPositionInScreenFromWorld({worldPosition: positionAndMark.position});
            const distance = positionOnScreen.distanceToPosition({position: currentScreenPosition});
            if (distance < minSnapDistance) {
              snappedPositionAndMarkOnModelingObject = positionAndMark;
              minSnapDistance = distance;
            }
          }
        }

        if (snappedPositionAndMarkOnModelingObject) {
          return snappedPositionAndMarkOnModelingObject;
        }
      }
    }

    if (intersects.length > 0) {
      const intersect = intersects[0];
      // TODO: we can get the precise position using kernel
      return {
        position: intersect.position,
        mark: null
      };
    }

    if (Xc3dUIManager.ucsScene.visible) {
      // Snap the grids
      const targetRenderingObjects = [Xc3dUIManager.groundPlane, Xc3dUIManager.ucsAxesHelper];
      const intersects = Xc3dUIManager.pick({
        screenPosition: currentScreenPosition,
        targetRenderingObjects,
      });
      if (intersects.length === 0) {
        return null;
      }

      const intersect = intersects[0];

      if (Xc3dUIPositionSnapper.#testInside({child: intersect.renderingObject, parent: Xc3dUIManager.groundPlane})) {
        // Get UCS position
        const ucsPosition = Xc3dUIManager.getUCSPositionFromWorldPosition({worldPosition: intersect.position});
        ucsPosition.x = Math.round(ucsPosition.x / Xc3dUIManager.ucsScene.userData.scaleLength) * Xc3dUIManager.ucsScene.userData.scaleLength;
        ucsPosition.y = Math.round(ucsPosition.y / Xc3dUIManager.ucsScene.userData.scaleLength) * Xc3dUIManager.ucsScene.userData.scaleLength;
        ucsPosition.z = 0;

        const wcsPosition = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition});

        return {
          position: wcsPosition,
          mark: null
        };
      } else {
        return {
          position: intersect.position,
          mark: null
        };
      }
    } else {
      return null;
    }
  }
}
