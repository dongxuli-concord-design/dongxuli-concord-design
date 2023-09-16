_PK_boolean_intersect_c = 15901;
_PK_boolean_subtract_c = 15902;
_PK_boolean_unite_c = 15903;

class _XcGmPK_UVBox_t {
  param;

  constructor({param = [0, 0, 1, 1]} = {}) {
    this.param = [...param];
  }

  static fromXcGmUVBox({uvBox}) {
    const pkUVBox = new _XcGmPK_UVBox_t({
      param: [
        uvBox.lowU,
        uvBox.lowV,
        uvBox.highU,
        uvBox.highV,
      ]
    });
    return pkUVBox;
  }

  static fromJSON({json}) {
    const pkUVBox = new _XcGmPK_UVBox_t({param: json.param});
    return pkUVBox;
  }

  toJSON() {
    return {
      param: this.param,
    }
  }

  toXcGmUVBox() {
    return new XcGmUVBox({
      lowU: this.param[0],
      lowV: this.param[1],
      highU: this.param[2],
      highV: this.param[3],
    });
  }
}

class _XcGmPK_UV_t {
  param;

  constructor({param = [0, 1]} = {}) {
    this.param = [...param];
  }

  static fromXcGmUV({uv}) {
    const pkUV = new _XcGmPK_UV_t({
      param: [
        uv.u,
        uv.v,
      ]
    });
    return pkUV;
  }

  static fromJSON({json}) {
    const pkUV = new _XcGmPK_UV_t({param: json.param});
    return pkUV;
  }

  toJSON() {
    return {
      param: this.param,
    }
  }

  toXcGmUV() {
    return new XcGmUV({
      u: this.param[0],
      v: this.param[1],
    });
  }
}

class _XcGmPK_BOX_t {
  coord;

  constructor({coord = [0, 0, 0, 1, 1, 1]} = {}) {
    this.coord = [...coord];
  }

  static fromXcGm3dBox({box}) {
    const pkBox = new _XcGmPK_BOX_t({
      coord: [
        box.minimumX,
        box.minimumY,
        box.minimumZ,
        box.maximumX,
        box.maximumY,
        box.maximumZ,
      ]
    });
    return pkBox;
  }

  static fromJSON({json}) {
    const pkBox = new _XcGmPK_BOX_t({coord: json.coord});
    return pkBox;
  }

  toJSON() {
    return {
      coord: this.coord,
    }
  }

  toXcGm3dBox() {
    return new XcGm3dBox({
      minimumX: this.coord[0],
      minimumY: this.coord[1],
      minimumZ: this.coord[2],
      maximumX: this.coord[3],
      maximumY: this.coord[4],
      maximumZ: this.coord[5],
    });
  }
}

class _XcGmPK_INTERVAL_t {
  value;

  constructor({value = [0, 1]} = {}) {
    this.value = [...value];
  }

  static fromXcGmInterval({interval}) {
    const pkInterval = new _XcGmPK_INTERVAL_t({value: [interval.low, interval.high]});
    return pkInterval;
  }

  static fromJSON({json}) {
    const pkInterval = new _XcGmPK_INTERVAL_t({value: json.value});
    return pkInterval;
  }

  toJSON() {
    return {
      value: this.value,
    }
  }

  toXcGmInterval() {
    return new XcGmInterval({low: this.value[0], high: this.value[1]});
  }
}

class _XcGmPK_VECTOR_t {
  coord;

  constructor({coord = [0, 0, 0]} = {}) {
    this.coord = [...coord];
  }

  static fromXcGm3dPosition({position}) {
    const pkVector = new _XcGmPK_VECTOR_t({coord: [...position.toArray()]});
    return pkVector;
  }

  static fromJSON({json}) {
    const pkVector = new _XcGmPK_VECTOR_t({coord: json.coord});
    return pkVector;
  }

  toJSON() {
    return {
      coord: this.coord,
    }
  }

  toXcGm3dPosition() {
    return new XcGm3dPosition({x: this.coord[0], y: this.coord[1], z: this.coord[2]});
  }

  toXcGm3dVector() {
    return new XcGm3dVector({x: this.coord[0], y: this.coord[1], z: this.coord[2]});
  }
}

class _XcGmPK_AXIS1_sf_t {
  location;
  axis;

  constructor({
                location = new _XcGmPK_VECTOR_t({coord: [0, 0, 0]}),
                axis = new _XcGmPK_VECTOR_t({coord: [0, 0, 1]}),
              } = {}) {
    this.location = location;
    this.axis = axis;
  }

  static fromXcGm3dAxis({axis}) {
    const axis1 = new _XcGmPK_AXIS1_sf_t({
      location: new _XcGmPK_VECTOR_t({coord: [axis.position.x, axis.position.y, axis.position.z]}),
      axis: new _XcGmPK_VECTOR_t({coord: [axis.direction.x, axis.direction.y, axis.direction.z]})
    });
    return axis1;
  }

  static fromJSON({json}) {
    const location = _XcGmPK_VECTOR_t.fromJSON({json: json.location});
    const axis = _XcGmPK_VECTOR_t.fromJSON({json: json.axis});
    const axis1 = new _XcGmPK_AXIS1_sf_t({location, axis});
    return axis1;
  }

  toJSON() {
    return {
      location: this.location.toJSON(),
      axis: this.axis.toJSON()
    }
  };
}

class _XcGmPK_AXIS2_sf_t {
  location;
  axis;
  ref_direction;

  constructor({
                location = new _XcGmPK_VECTOR_t({coord: [0, 0, 0]}),
                axis = new XcGm3dVector({x: 0, y: 0, z: 1}),
                ref_direction = new XcGm3dVector({x: 1, y: 0, z: 0})
              } = {}) {
    this.location = location;
    this.axis = axis;
    this.ref_direction = ref_direction;
  }

  static fromXcGm3dCoordinateSystem({coordinateSystem}) {
    const location = new _XcGmPK_VECTOR_t({coord: [coordinateSystem.origin.x, coordinateSystem.origin.y, coordinateSystem.origin.z]});
    const axis = new _XcGmPK_VECTOR_t({coord: [coordinateSystem.zAxisDirection.x, coordinateSystem.zAxisDirection.y, coordinateSystem.zAxisDirection.z]});
    const ref_direction = new _XcGmPK_VECTOR_t({coord: [coordinateSystem.xAxisDirection.x, coordinateSystem.xAxisDirection.y, coordinateSystem.xAxisDirection.z]});
    const axis2 = new _XcGmPK_AXIS2_sf_t({location, axis, ref_direction});
    return axis2;
  }

  static fromJSON({json}) {
    const location = _XcGmPK_VECTOR_t.fromJSON({json: json.location});
    const axis = _XcGmPK_VECTOR_t.fromJSON({json: json.axis});
    const ref_direction = _XcGmPK_VECTOR_t.fromJSON({json: json.ref_direction});
    const axis2 = new _XcGmPK_AXIS2_sf_t({location, axis, ref_direction});
    return axis2;
  }

  toJSON() {
    return {
      location: this.location.toJSON(),
      axis: this.axis.toJSON(),
      ref_direction: this.ref_direction.toJSON()
    }
  }
}

class _XcGmPK_TRANSF_sf_t {
  matrix;

  constructor({matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]} = {}) {
    this.matrix = [...matrix];
  }

  static fromXcGm3dMatrix({matrix}) {
    const transfSF = new _XcGmPK_TRANSF_sf_t({matrix: [...matrix.entry]});
    return transfSF;
  }

  static fromJSON({json}) {
    const transfSF = new _XcGmPK_TRANSF_sf_t({matrix: JSON.parse(json.matrix)});
    return transfSF;
  }

  toJSON() {
    return {
      matrix: this.matrix
    }
  }
}

class _XcGmPK_CIRCLE_sf_t {
  radius;
  basis_set;

  constructor({
                radius,
                basis_set = new _XcGmPK_AXIS2_sf_t()
              }) {
    this.radius = radius;
    this.basis_set = basis_set;
  }

  static fromJSON({json}) {
    const radius = json.radius;
    const basis_set = _XcGmPK_AXIS2_sf_t.fromJSON({json: json.basis_set})
    const circleSF = new _XcGmPK_CIRCLE_sf_t({radius, basis_set});
    return circleSF;
  }

  toJSON() {
    return {
      radius: this.radius,
      basis_set: this.basis_set.toJSON()
    }
  }
}

class _XcGmPK_LINE_sf_t {
  basis_set;

  constructor({basis_set = new _XcGmPK_AXIS1_sf_t()} = {}) {
    this.basis_set = basis_set;
  }

  static fromXcGm3dAxis({axis}) {
    const basis_set = _XcGmPK_AXIS1_sf_t.fromXcGm3dAxis({axis});
    const lineSF = new _XcGmPK_LINE_sf_t({basis_set});
    return lineSF;
  }

  static fromJSON({json}) {
    const basis_set = _XcGmPK_AXIS1_sf_t.fromJSON({json: json.basis_set});
    const lineSF = new _XcGmPK_LINE_sf_t({basis_set});
    return lineSF;
  }

  toJSON() {
    return {
      basis_set: this.basis_set.toJSON()
    }
  }
}

class _XcGmPK_POINT_sf_t {
  position;

  constructor({position = new _XcGmPK_VECTOR_t()}) {
    this.position = position;
  }

  static fromXcGm3dPosition({position}) {
    const pointSF = new _XcGmPK_POINT_sf_t({position: _XcGmPK_VECTOR_t.fromXcGm3dPosition({position})});
    return pointSF;
  }

  static fromJSON({json}) {
    const position = _XcGmPK_VECTOR_t.fromJSON({json: json.position});
    const pointSF = new _XcGmPK_POINT_sf_t({position});
    return pointSF;
  }

  toJSON() {
    return {
      position: this.position.toJSON()
    }
  };
}

class _XcGmPK_BCURVE_sf_t {
  static PK_BCURVE_form_t = {
    PK_BCURVE_form_unset_c: 8650,
    PK_BCURVE_form_arbitrary_c: 8651,
    PK_BCURVE_form_polyline_c: 8652,
    PK_BCURVE_form_circular_c: 8653,
    PK_BCURVE_form_elliptic_c: 8654,
    PK_BCURVE_form_parabolic_c: 8655,
    PK_BCURVE_form_hyperbolic_c: 8656,
  };
  static PK_knot_type_t = {
    PK_knot_unset_c: 8500,
    PK_knot_non_uniform_c: 8501,
    PK_knot_uniform_c: 8502,
    PK_knot_quasi_uniform_c: 8503,
    PK_knot_piecewise_bezier_c: 8504,
    PK_knot_bezier_ends_c: 8505,
    PK_knot_smooth_seam_c: 8506,
  };
  static PK_self_intersect_t = {
    PK_self_intersect_unset_c: 8550,
    PK_self_intersect_false_c: 8551,
    PK_self_intersect_true_c: 8552,
  }
  degree;
  n_vertices;
  vertex_dim;
  is_rational;
  vertex;
  form;
  n_knots;
  knot_mult;
  knot;
  knot_type;
  is_periodic;
  is_closed;
  self_intersecting;

  constructor({
                degree,
                n_vertices,
                vertex_dim,
                is_rational,
                vertex,
                form,
                n_knots,
                knot_mult,
                knot,
                knot_type,
                is_periodic,
                is_closed,
                self_intersecting,
              }) {
    this.degree = degree;
    this.n_vertices = n_vertices;
    this.vertex_dim = vertex_dim;
    this.is_rational = is_rational;
    this.vertex = vertex;
    this.form = form;
    this.n_knots = n_knots;
    this.knot_mult = knot_mult;
    this.knot = knot;
    this.knot_type = knot_type;
    this.is_periodic = is_periodic;
    this.is_closed = is_closed;
    this.self_intersecting = self_intersecting;
  }

  static fromJSON({json}) {
    const bCurveSF = new _XcGmPK_BCURVE_sf_t({
      degree: json.degree,
      n_vertices: json.n_vertices,
      vertex_dim: json.vertex_dim,
      is_rational: json.is_rational,
      vertex: json.vertex,
      form: json.form,
      n_knots: json.n_knots,
      knot_mult: json.knot_mult,
      knot: json.knot,
      knot_type: json.knot_type,
      is_periodic: json.is_periodic,
      is_closed: json.is_closed,
      self_intersecting: json.self_intersecting,
    });

    return bCurveSF;
  }

  toJSON() {
    return {
      degree: this.degree,
      n_vertices: this.n_vertices,
      vertex_dim: this.vertex_dim,
      is_rational: this.is_rational,
      vertex: this.vertex,
      form: this.form,
      n_knots: this.n_knots,
      knot_mult: this.knot_mult,
      knot: this.knot,
      knot_type: this.knot_type,
      is_periodic: this.is_periodic,
      is_closed: this.is_closed,
      self_intersecting: this.self_intersecting,
    }
  }
}

class _XcGmPK_INSTANCE_sf_t {
  assembly;
  transf;
  part;

  constructor({
                assembly = null,
                transf = null,
                part = null
              } = {}) {
    this.assembly = assembly;   //--- owning assembly
    this.transf = transf;     //--- transform (must be a rigid motion, or PK_ENTITY_null)
    this.part = part;       //--- instanced part
  }

  static fromJSON({json}) {
    const instanceSF = new _XcGmPK_INSTANCE_sf_t();
    instanceSF.assembly = XcGmEntity._getObjectFromPkTag({entityTag: json.assembly});
    instanceSF.transf = json.transf ? XcGmEntity._getObjectFromPkTag({entityTag: json.transf}) : null;
    instanceSF.part = XcGmEntity._getObjectFromPkTag({entityTag: json.part});

    return instanceSF;
  }

  toJSON() {
    const transfTag = this.transf ? this.transf.tag() : null;
    return {
      assembly: this.assembly.tag,
      transf: transfTag,
      part: this.part.tag
    }
  };
}

class _XcGmPK_PLANE_sf_t {
  basis_set;

  constructor({basis_set = new _XcGmPK_AXIS2_sf_t()}) {
    this.basis_set = basis_set;
  }

  static fromXcGm3dCoordinateSystem({coordinateSystem}) {
    const basis_set = _XcGmPK_AXIS2_sf_t.fromXcGm3dCoordinateSystem({coordinateSystem});
    const planeSF = new _XcGmPK_PLANE_sf_t({basis_set});
    return planeSF;
  }

  static fromJSON({json}) {
    const basis_set = _XcGmPK_AXIS2_sf_t.fromJSON({json: json.basis_set});
    const planeSF = new _XcGmPK_PLANE_sf_t({basis_set});
    return planeSF;
  }

  toJSON() {
    return {
      basis_set: this.basis_set.toJSON()
    }
  }
}

class _XcGmPK_SPHERE_sf_t {
  radius;
  basis_set;

  constructor({
                radius,
                basis_set = new _XcGmPK_AXIS2_sf_t()
              }) {
    this.radius = radius;
    this.basis_set = basis_set;
  }

  static fromJSON({json}) {
    const sphereSF = new _XcGmPK_SPHERE_sf_t();
    sphereSF.radius = json.radius;
    sphereSF.basis_set = _XcGmPK_AXIS2_sf_t.fromJSON({json: json.basis_set})
  }

  toJSON() {
    return {
      radius: this.radius,
      basis_set: this.basis_set.toJSON()
    }
  }
}

class _PK_BODY_extrude_o_t {
  start_bound;
  end_bound;
  extruded_body;
  allow_disjoint;
  consistent_params;

  constructor({
                start_bound = new _PK_bound_def_s({
                  bound: _XcGmPkTokens.PK_bound_distance_c,
                  forward: true,
                  distance: 0.0,
                  entity: 0,
                  nearest: true,
                  nth_division: 1,
                  side: _XcGmPkTokens.PK_bound_side_both_c
                }),
                end_bound = new _PK_bound_def_s({
                  bound: _XcGmPkTokens.PK_bound_distance_c,
                  forward: true,
                  distance: 1.0,
                  entity: 0,
                  nearest: true,
                  nth_division: 1,
                  side: _XcGmPkTokens.PK_bound_side_both_c
                }),
                extruded_body = 0,
                allow_disjoint = false,
                consistent_params = _XcGmPkTokens.PK_PARAM_consistent_unset_c,
              } = {}) {
    this.start_bound = start_bound;
    this.end_bound = end_bound;
    this.extruded_body = extruded_body;
    this.allow_disjoint = allow_disjoint;
    this.consistent_params = consistent_params;
  }

  static fromJSON({json}) {
    const extrudeOption = new _PK_BODY_extrude_o_t({
      start_bound: _PK_bound_def_s.fromJSON(json.start_bound),
      end_bound: _PK_bound_def_s.fromJSON(json.end_bound),
      extruded_body: json.extruded_body,
      allow_disjoint: json.allow_disjoint,
      consistent_params: json.consistent_params,
    });
    return extrudeOption;
  }

  toJSON() {
    return {
      start_bound: this.start_bound.toJSON(),
      end_bound: this.end_bound.toJSON(),
      extruded_body: this.extruded_body,
      allow_disjoint: this.allow_disjoint,
      consistent_params: this.consistent_params,
    }
  }
}

class _PK_bound_def_s {
  bound;
  forward;
  distance;
  entity;
  nearest;
  nth_division;
  side;

  constructor({bound, forward, distance, entity, nearest, nth_division, side}) {
    this.bound = bound;
    this.forward = forward;
    this.distance = distance;
    this.entity = entity;
    this.nearest = nearest;
    this.nth_division = nth_division;
    this.side = side;
  }

  static fromJSON({json}) {
    const boundDef = new _PK_bound_def_s({
      bound: json.bound,
      forward: json.forward,
      distance: json.distance,
      entity: json.entity,
      nearest: json.nearest,
      nth_division: json.nth_division,
      side: json.side,
    });
    return boundDef;
  }

  toJSON() {
    return {
      bound: this.bound,
      forward: this.forward,
      distance: this.distance,
      entity: this.entity,
      nearest: this.nearest,
      nth_division: this.nth_division,
      side: this.side,
    }
  }
}
