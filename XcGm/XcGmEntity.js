class XcGmEntity {
  static #_pkTagObjMap = new Map();

  static #_pkRegistry = new FinalizationRegistry(tag => {
    try {
      // TODO: Delete Parasolid entities.
      // XcGmEntity._pkDelete({entityTag: _pkTag});
    } catch (error) {
      console.debug(error);
    }
  });

  _pkTag;

  constructor() {
    this._pkTag = null;
  }

  clone() {
    XcGmAssert({assertion: false, message: 'The subclass has to implement this function'});
  }

  _pkClone() {
    const params = {
      entity: this._pkTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_copy_2', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
    const newEntity = XcGmEntity._getPkObjectFromPkTag({entityTag: pkReturnValue.entity_copy});
    return newEntity;
  }

  // Parasolid stuff
  static #_getPkClassFromClassToken({classToken}) {
    switch (classToken) {
      case 2004:
        return _XcGmTransf;
      case 1002:
        return XcGmTopology;
      case 5012:
        return XcGmPart;
      // case 5008:
      //   return XcGmAssembly;
      case 5006:
        return XcGmBody;
      // case 5007:
      //   return XcGmInstance;
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
        return XcGm3dGeometry;
      case 2003:
        return XcGmSurface;
      case 4001:
        return XcGmPlanarSurface;
      case 4002:
        return XcGmCylinderSurface;
      case 4003:
        return XcGmConeSurface;
      case 4004:
        return XcGmSphereSurface;
      case 4005:
        return XcGmTorusSurface;
      case 4006:
        return XcGmNurbsSurface;
      case 4008:
        return XcGmOffsetSurface;
      case 4009:
        return XcGmSweptSurface;
      case 4010:
        return XcGmSpunSurface;
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
        return XcGm3dNurbsCurve;
      //case 3004: return XcGmICurve;
      //case 3006: return XcGmSPCurve;
      //case 3009: return XcGmTrimmedCurve;
      case 2501:
        return XcGm3dPoint;
      default:
        XcGmAssert({assertion: false, message: `Unsupported class token: ${classToken}`});
    }
  }

  static _getPkObjectFromPkTag({entityTag}) {
    if (0 === entityTag) {
      return null;
    }

    if (XcGmEntity.#_pkTagObjMap.has(entityTag)) {
      const ref = XcGmEntity.#_pkTagObjMap.get(entityTag);
      const element = ref.deref();
      if (element) {
        return element;
      } else {
        XcGmEntity.#_pkTagObjMap.delete(entityTag);
      }
    }

    // Query the object from the backend using _tag
    const params = {
      entity: entityTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_ask_class', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});

    // Create object
    // Bug: const obj = new XcGmEntity.#_getPkClassFromClassToken({entityClass})();
    const objConstructor = XcGmEntity.#_getPkClassFromClassToken({classToken: pkReturnValue.cls});
    const obj = new objConstructor();

    XcGmAssert({
      assertion: !XcGmEntity.#_pkTagObjMap.has(entityTag),
      message: 'Set _tag should be called once only.'
    });
    obj._pkTag = entityTag;
    XcGmEntity.#_pkTagObjMap.set(entityTag, new WeakRef(obj));

    if (objConstructor === XcGmBody) {
      XcGmEntity.#_pkRegistry.register(obj, entityTag);
    }

    return obj;
  }

  static _pkDelete({entityTag}) {
    const params = {
      entity: entityTag
    };
    const {error, pkReturnValue} = XcGmCallPkApi('ENTITY_delete', {params});
    XcGmAssert({assertion: !error, message: `Modeling error: ${error}`});
  }
}
