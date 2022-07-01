class XcGmEntity {
  static #tagObjMap = new Map();

  static #registry = new FinalizationRegistry(tag => {
    try {
      // TODO: Delete Parasolid entities.
      // XcGmEntity.PKDelete({entityTag: tag});
    } catch (error) {
      console.debug(error);
    }
  });

  tag;

  constructor() {
    this.tag = null;
  }

  // Parasolid stuff
  static #getClassFromClassToken({classToken}) {
    switch (classToken) {
      case 2004:
        return XcGmTransf;
      case 1002:
        return XcGmTopology;
      case 5012:
        return XcGmPart;
      case 5008:
        return XcGmAssembly;
      case 5006:
        return XcGmBody;
      case 5007:
        return XcGmInstance;
      //case 5011: return XcGmRegion;
      //case 5005: return XcGmShell;
      case 5004:
        return XcGmFace;
      case 5003:
        return XcGmLoop;
      case 5002:
        return XcGmEdge;
      //case 5010: XcGmFin;
      case 5001:
        return XcGmVertex;
      case 1001:
        return XcGmGeometry;
      case 2003:
        return XcGmSurface;
      case 4001:
        return XcGmPlane;
      case 4002:
        return XcGmCylinder;
      case 4003:
        return XcGmCone;
      case 4004:
        return XcGmSphere;
      case 4005:
        return XcGmTorus;
      case 4006:
        return XcGmBSurface;
      case 4008:
        return XcGmOffset;
      case 4009:
        return XcGmSwept;
      case 4010:
        return XcGmSpun;
      case 4007:
        return XcGmBlendSurface;
      case 2002:
        return XcGm3dCurve;
      case 3001:
        return XcGm3dLine;
      case 3002:
        return XcGm3dCircle;
      case 3003:
        return XcGm3dEllipse;
      case 3005:
        return XcGm3dBCurve;
      //case 3004: return XcGmICurve;
      //case 3006: return XcGmSPCurve;
      //case 3009: return XcGmTrimmedCurve;
      case 2501:
        return XcGm3dPoint;
    }
  }

  static getObjFromTag({entityTag}) {
    if (0 === entityTag) {
      return null;
    }

    if (XcGmEntity.#tagObjMap.has(entityTag)) {
      const ref = XcGmEntity.#tagObjMap.get(entityTag);
      const element = ref.deref();
      if (element) {
        return element;
      } else {
        XcGmEntity.#tagObjMap.delete(entityTag);
      }
    }

    // Query the object from the backend using _tag
    const params = {
      entity: entityTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_ask_class', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    // Create object
    // Bug: const obj = new XcGmEntity.#getClassFromClassToken({entityClass})();
    const objConstructor = XcGmEntity.#getClassFromClassToken({classToken: pkReturnValue.cls});
    const obj = new objConstructor();

    XcGmAssert({
      assertion: !XcGmEntity.#tagObjMap.has(entityTag),
      message: 'Set _tag should be called once only.'
    });
    obj.tag = entityTag;
    XcGmEntity.#tagObjMap.set(entityTag, new WeakRef(obj));

    if (objConstructor === XcGmBody) {
      XcGmEntity.#registry.register(obj, entityTag);
    }

    return obj;
  }

  static PKDelete({entityTag}) {
    const params = {
      entity: entityTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_delete', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }

  toJSON() {
    return {
      tag: this.tag
    };
  }

  clone() {
    const params = {
      entity: this.tag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_copy_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const newEntity = XcGmEntity.getObjFromTag({entityTag: pkReturnValue.entity_copy});
    return newEntity;
  }

}
