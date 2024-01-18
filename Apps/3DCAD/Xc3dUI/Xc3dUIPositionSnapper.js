class Xc3dUIPositionSnapper {
  constructor() {
  }

  static #testAncestor({child, parent}) {
    if (child === parent) {
      return true;
    } else {
      if (child.parent) {
        return Xc3dUIPositionSnapper.#testAncestor({child: child.parent, parent});
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
        const mark = this.#makeSnapMark({position, color: new THREE.Color('blue')});
        positionAndMarks.push({position, mark});
      } else if (kernelObject instanceof XcGmEdge) {
        // TODO: Get midpoint, center point of the edge
        // TODO: Get the edge center, not the prop center.

        const {c_of_g} = XcGmTopology._pkComputeMassProps({topols: [kernelObject], accuracy: 1});
        const objectCenter = new XcGm3dPosition({x: c_of_g[0], y: c_of_g[1], z: c_of_g[2]});
        const mark = this.#makeSnapMark({position: objectCenter, color: new THREE.Color('yellow')});
        positionAndMarks.push({position: objectCenter, mark});
      } else if (kernelObject instanceof XcGmFace) {
        // TODO: Get midpoint, center point of the face, not the prop center
        const {c_of_g} = XcGmTopology._pkComputeMassProps({topols: [kernelObject], accuracy: 1});
        const objectCenter = new XcGm3dPosition({x: c_of_g[0], y: c_of_g[1], z: c_of_g[2]});
        const mark = this.#makeSnapMark({position: objectCenter, color: new THREE.Color('yellow')});
        positionAndMarks.push({position: objectCenter, mark});
      }
    } catch (error) {
      XcSysManager.outputDisplay.warn(error);
    }

    const matrixWorld = XcGm3dMatrix.fromThreeMatrix4({threeMatrix4: pickedRenderingObject.matrixWorld});
    positionAndMarks.forEach(({position, mark}) => {
      position.transform({matrix: matrixWorld});
      mark.applyMatrix4(pickedRenderingObject.matrixWorld);
    });

    return positionAndMarks;
  }

  #makeSnapMark({position, color}) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([...position.toArray()]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: Xc3dUIConfig.pickingPrecisionInPixels,
      sizeAttenuation: false
    });
    const mark = new THREE.Points(geometry, material);
    return mark;
  }

  snapAt({
           currentScreenPosition,
           basePosition = null,
         }) {
    let returnValue = null;

    const targetRenderingObjects = [Xc3dUIManager.document.renderingScene];
    const intersects = Xc3dUIManager.pick({
      screenPosition: currentScreenPosition,
      targetRenderingObjects,
    });

    if (intersects.length > 0) {
      const intersect = intersects[0];

      const associatedModelingKernelEntity = Xc3dDocDocument.getModelingKernelEntityFromRenderingObject({renderingObject: intersect.renderingObject});
      if (associatedModelingKernelEntity &&
        (associatedModelingKernelEntity instanceof XcGmVertex) || (associatedModelingKernelEntity instanceof XcGmEdge) || (associatedModelingKernelEntity instanceof XcGmFace)) {
        const snappingPointMarks = this.#getModelingObjectSnapPoints(intersect.renderingObject, associatedModelingKernelEntity, basePosition);

        // Check if we can get a snap point from a modeling object
        const nearbysnappingPointMarks = snappingPointMarks.filter(positionAndMark => {
          const positionOnScreen = Xc3dUIManager.getPositionInScreenFromWorld({worldPosition: positionAndMark.position});
          const distance = positionOnScreen.distanceToPosition({position: currentScreenPosition});
          return distance < Xc3dUIConfig.pickingPrecisionInPixels;
        });

        if (nearbysnappingPointMarks.length > 0) {
          const nearbysnappingPointMark = nearbysnappingPointMarks[0];
          returnValue = {
            position: nearbysnappingPointMark.position,
            mark: nearbysnappingPointMark.mark,
          }
        } else {
          // TODO: get the position on the kernel object
          const mark = this.#makeSnapMark({position: intersect.position, color: new THREE.Color('black')});
          returnValue = {
            position: intersect.position,
            mark,
          }
        }
      } else {
        // Get snap points from rendering objects
        // TODO: Three.js has a bug that the intersect position is not consistent.
        const mark = this.#makeSnapMark({position: intersect.position, color: new THREE.Color('black')});
        returnValue = {
          position: intersect.position,
          mark,
        };
      }
    } else {
      // Try UCS grid
      if (Xc3dUIManager.ucsScene.visible) {
        const targetRenderingObjects = [Xc3dUIManager.groundPlane, Xc3dUIManager.ucsAxesHelper];
        const intersects = Xc3dUIManager.pick({
          screenPosition: currentScreenPosition,
          targetRenderingObjects,
        });

        if (intersects.length > 0) {
          const intersect = intersects[0];

          if (Xc3dUIPositionSnapper.#testAncestor({child: intersect.renderingObject, parent: Xc3dUIManager.groundPlane})) {
            // Get UCS position
            const ucsPosition = Xc3dUIManager.getUCSPositionFromWorldPosition({worldPosition: intersect.position});
            ucsPosition.x = Math.round(ucsPosition.x / Xc3dUIManager.ucsScene.userData.scaleLength) * Xc3dUIManager.ucsScene.userData.scaleLength;
            ucsPosition.y = Math.round(ucsPosition.y / Xc3dUIManager.ucsScene.userData.scaleLength) * Xc3dUIManager.ucsScene.userData.scaleLength;
            ucsPosition.z = 0;

            const wcsPosition = Xc3dUIManager.getWorldPositionFromUCSPosition({ucsPosition});

            const mark = this.#makeSnapMark({position: wcsPosition, color: new THREE.Color('blue')});
            returnValue = {
              position: wcsPosition,
              mark,
            };
          } else {
            const mark = this.#makeSnapMark({position: intersect.position, color: new THREE.Color('black')});
            returnValue = {
              position: intersect.position,
              mark,
            };
          }
        } else {
          returnValue = null;
        }
      } else {
        returnValue = null;
      }
    }

    return returnValue;
  }
}
