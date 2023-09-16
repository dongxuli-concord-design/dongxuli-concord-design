#include "param.h"

void PK_VECTOR_t_from_JSON(const Json::Value &json, PK_VECTOR_t *vector) {
  assert(json.isMember("coord"));
  Json::Value coord = json["coord"];
  vector->coord[0] = coord[0].asDouble();
  vector->coord[1] = coord[1].asDouble();
  vector->coord[2] = coord[2].asDouble();
}

Json::Value PK_VECTOR_t_to_JSON(const PK_VECTOR_t *vector) {
  Json::Value json;
  Json::Value coord(Json::arrayValue);
  coord.append(vector->coord[0]);
  coord.append(vector->coord[1]);
  coord.append(vector->coord[2]);
  json["coord"] = coord;
  return json;
}

void PK_AXIS1_sf_t_from_JSON(const Json::Value &json, PK_AXIS1_sf_t *basis_set) {
  assert(json.isMember("location"));
  assert(json.isMember("axis"));

  PK_VECTOR_t_from_JSON(json["location"], &basis_set->location);
  PK_VECTOR_t_from_JSON(json["axis"], &basis_set->axis);
}

Json::Value PK_AXIS1_sf_t_to_JSON(const PK_AXIS1_sf_t *basis_set) {
  Json::Value json;
  json["location"] = PK_VECTOR_t_to_JSON(&basis_set->location);
  json["axis"] = PK_VECTOR_t_to_JSON(&basis_set->axis);

  return json;
}

void PK_AXIS2_sf_t_from_JSON(const Json::Value &json, PK_AXIS2_sf_t *basis_set) {
  assert(json.isMember("location"));
  assert(json.isMember("axis"));
  assert(json.isMember("ref_direction"));

  PK_VECTOR_t_from_JSON(json["location"], &basis_set->location);
  PK_VECTOR_t_from_JSON(json["axis"], &basis_set->axis);
  PK_VECTOR_t_from_JSON(json["ref_direction"], &basis_set->ref_direction);
}

Json::Value PK_AXIS2_sf_t_to_JSON(const PK_AXIS2_sf_t *basis_set) {
  Json::Value json;
  json["location"] = PK_VECTOR_t_to_JSON(&basis_set->location);
  json["axis"] = PK_VECTOR_t_to_JSON(&basis_set->axis);
  json["ref_direction"] = PK_VECTOR_t_to_JSON(&basis_set->ref_direction);

  return json;
}

void PK_TRANSF_sf_t_from_JSON(const Json::Value &json, PK_TRANSF_sf_t *transf_sf) {
  assert(json.isMember("matrix"));
  for (int i = 0; i < 4; i += 1) {
    for (int j = 0; j < 4; ++j) {
      transf_sf->matrix[i][j] = json["matrix"][i][j].asDouble();
    }
  }
}

Json::Value PK_TRANSF_sf_t_to_JSON(const PK_TRANSF_sf_t *transf_sf) {
  Json::Value json;

  Json::Value matrixValue(Json::arrayValue);
  for (int i = 0; i < 4; i += 1) {
    for (int j = 0; j < 4; ++j) {
      matrixValue.append(transf_sf->matrix[i][j]);
    }
  }
  json["matrix"] = matrixValue;
  return json;
}

void PK_POINT_sf_t_from_JSON(const Json::Value &json, PK_POINT_sf_t *point_sf) {
  assert(json.isMember("position"));
  PK_VECTOR_t_from_JSON(json["position"], &point_sf->position);
}

Json::Value PK_POINT_sf_t_to_JSON(const PK_POINT_sf_t *point_sf) {
  Json::Value json;
  json["position"] = PK_VECTOR_t_to_JSON(&point_sf->position);
  return json;
}

void PK_LINE_sf_t_from_JSON(const Json::Value &json, PK_LINE_sf_t *line_sf) {
  assert(json.isMember("basis_set"));
  PK_AXIS1_sf_t_from_JSON(json["basis_set"], &line_sf->basis_set);
}

Json::Value PK_LINE_sf_t_to_JSON(const PK_LINE_sf_t *line_sf) {
  Json::Value json;
  json["basis_set"] = PK_AXIS1_sf_t_to_JSON(&line_sf->basis_set);
  return json;
}

void PK_CIRCLE_sf_t_from_JSON(const Json::Value &json, PK_CIRCLE_sf_t *circle_sf) {
  assert(json.isMember("basis_set"));
  assert(json.isMember("radius"));
  PK_AXIS2_sf_t_from_JSON(json["basis_set"], &circle_sf->basis_set);
  circle_sf->radius = json["radius"].asDouble();
}

Json::Value PK_CIRCLE_sf_t_to_JSON(const PK_CIRCLE_sf_t *circle_sf) {
  Json::Value json;
  json["basis_set"] = PK_AXIS2_sf_t_to_JSON(&circle_sf->basis_set);
  json["radius"] = Json::Value(circle_sf->radius);
  return json;
}

void PK_PLANE_sf_t_from_JSON(const Json::Value &json, PK_PLANE_sf_t *plane_sf) {
  assert(json.isMember("basis_set"));
  PK_AXIS2_sf_t_from_JSON(json["basis_set"], &plane_sf->basis_set);
}

Json::Value PK_PLANE_sf_t_to_JSON(const PK_PLANE_sf_t *plane_sf) {
  Json::Value json;
  json["basis_set"] = PK_AXIS2_sf_t_to_JSON(&plane_sf->basis_set);
  return json;
}

void PK_SPHERE_sf_t_from_JSON(const Json::Value &json, PK_SPHERE_sf_t *sphere_sf) {
  assert(json.isMember("basis_set"));
  assert(json.isMember("radius"));
  PK_AXIS2_sf_t_from_JSON(json["basis_set"], &sphere_sf->basis_set);
  sphere_sf->radius = json["radius"].asDouble();
}

Json::Value PK_SPHERE_sf_t_to_JSON(const PK_SPHERE_sf_t *sphere_sf) {
  Json::Value json;
  json["basis_set"] = PK_AXIS2_sf_t_to_JSON(&sphere_sf->basis_set);
  json["radius"] = sphere_sf->radius;
  return json;
}

void PK_INSTANCE_sf_t_from_JSON(const Json::Value &json, PK_INSTANCE_sf_t *instance_sf) {
  assert(json.isMember("assembly"));
  assert(json.isMember("transf"));
  assert(json.isMember("part"));

  instance_sf->assembly = json["assembly"].asInt();
  instance_sf->transf = json["transf"].asInt();
  instance_sf->part = json["part"].asInt();
}

Json::Value PK_INSTANCE_sf_t_to_JSON(const PK_INSTANCE_sf_t *instance_sf) {
  Json::Value json;
  json["assembly"] = instance_sf->assembly;
  json["transf"] = instance_sf->transf;
  json["part"] = instance_sf->part;
  return json;
}

void PK_UVBOX_t_from_JSON(const Json::Value &json, PK_UVBOX_t *uvbox) {
  assert(json.isMember("param"));
  Json::Value param = json["param"];
  uvbox->param[0] = param[0].asDouble();
  uvbox->param[1] = param[1].asDouble();
  uvbox->param[2] = param[2].asDouble();
  uvbox->param[3] = param[3].asDouble();
}

Json::Value PK_UVBOX_t_to_JSON(const PK_UVBOX_t *uvbox) {
  Json::Value json;
  Json::Value param(Json::arrayValue);
  param.append(uvbox->param[0]);
  param.append(uvbox->param[1]);
  param.append(uvbox->param[2]);
  param.append(uvbox->param[3]);
  json["param"] = param;
  return json;
}

void PK_BOX_t_from_JSON(const Json::Value &json, PK_BOX_t *box) {
  assert(json.isMember("coord"));
  Json::Value coord = json["coord"];
  box->coord[0] = coord[0].asDouble();
  box->coord[1] = coord[1].asDouble();
  box->coord[2] = coord[2].asDouble();
  box->coord[3] = coord[3].asDouble();
  box->coord[4] = coord[4].asDouble();
  box->coord[5] = coord[5].asDouble();
}

Json::Value PK_BOX_t_to_JSON(const PK_BOX_t *box) {
  Json::Value json;
  Json::Value coord(Json::arrayValue);
  coord.append(box->coord[0]);
  coord.append(box->coord[1]);
  coord.append(box->coord[2]);
  coord.append(box->coord[3]);
  coord.append(box->coord[4]);
  coord.append(box->coord[5]);
  json["coord"] = coord;
  return json;
}

void PK_INTERVAL_t_from_JSON(const Json::Value &json, PK_INTERVAL_t *interval) {
  assert(json.isMember("value"));
  Json::Value value = json["value"];
  interval->value[0] = value[0].asDouble();
  interval->value[1] = value[1].asDouble();
}

Json::Value PK_INTERVAL_t_to_JSON(const PK_INTERVAL_t *interval) {
  Json::Value json;
  Json::Value value(Json::arrayValue);
  value.append(interval->value[0]);
  value.append(interval->value[1]);
  json["value"] = value;
  return json;
}

void PK_UV_t_from_JSON(const Json::Value &json, PK_UV_t *uv) {
  assert(json.isMember("param"));
  Json::Value param = json["param"];
  uv->param[0] = param[0].asDouble();
  uv->param[1] = param[1].asDouble();
}

Json::Value PK_UV_t_to_JSON(const PK_UV_t *uv) {
  Json::Value json;
  Json::Value param(Json::arrayValue);
  param.append(uv->param[0]);
  param.append(uv->param[1]);
  json["param"] = param;
  return json;
}

void PK_BB_sf_t_from_JSON(const Json::Value &json, PK_BB_sf_t *bb_sf) {
  assert(json.isMember("create"));
  assert(json.isMember("deleet"));
  assert(json.isMember("copy"));
  assert(json.isMember("transfer"));
  assert(json.isMember("merge"));
  assert(json.isMember("split"));
  assert(json.isMember("transform"));
  assert(json.isMember("change_attrib"));
  assert(json.isMember("change"));

  Json::Value create = json["create"];
  bb_sf->create.length = create.size();
  bb_sf->create.array = new PK_CLASS_t[create.size()];

  Json::Value deleet = json["deleet"];
  bb_sf->deleet.length = deleet.size();
  bb_sf->deleet.array = new PK_CLASS_t[deleet.size()];

  Json::Value copy = json["copy"];
  bb_sf->copy.length = copy.size();
  bb_sf->copy.array = new PK_CLASS_t[copy.size()];

  Json::Value transfer = json["transfer"];
  bb_sf->transfer.length = create.size();
  bb_sf->transfer.array = new PK_CLASS_t[transfer.size()];

  Json::Value merge = json["merge"];
  bb_sf->merge.length = merge.size();
  bb_sf->merge.array = new PK_CLASS_t[merge.size()];

  Json::Value split = json["split"];
  bb_sf->split.length = split.size();
  bb_sf->split.array = new PK_CLASS_t[split.size()];

  Json::Value transform = json["transform"];
  bb_sf->transform.length = transform.size();
  bb_sf->transform.array = new PK_CLASS_t[transform.size()];

  Json::Value change_attrib = json["change_attrib"];
  bb_sf->change_attrib.length = change_attrib.size();
  bb_sf->change_attrib.array = new PK_CLASS_t[change_attrib.size()];

  Json::Value change = json["change"];
  bb_sf->change.length = change.size();
  bb_sf->change.array = new PK_CLASS_t[change.size()];
}

Json::Value PK_BB_sf_t_to_JSON(const PK_BB_sf_t *bb_sf) {
  Json::Value json(Json::objectValue);

  Json::Value create(Json::arrayValue);
  for (int i = 0; i < bb_sf->create.length; i += 1) {
    create.append(bb_sf->create.array[i]);
  }
  json["create"] = create;

  Json::Value deleet(Json::arrayValue);
  for (int i = 0; i < bb_sf->deleet.length; i += 1) {
    deleet.append(bb_sf->deleet.array[i]);
  }
  json["deleet"] = deleet;

  Json::Value copy(Json::arrayValue);
  for (int i = 0; i < bb_sf->copy.length; i += 1) {
    copy.append(bb_sf->copy.array[i]);
  }
  json["copy"] = copy;

  Json::Value transfer(Json::arrayValue);
  for (int i = 0; i < bb_sf->transfer.length; i += 1) {
    transfer.append(bb_sf->transfer.array[i]);
  }
  json["transfer"] = transfer;

  Json::Value merge(Json::arrayValue);
  for (int i = 0; i < bb_sf->merge.length; i += 1) {
    merge.append(bb_sf->merge.array[i]);
  }
  json["merge"] = merge;

  Json::Value split(Json::arrayValue);
  for (int i = 0; i < bb_sf->split.length; i += 1) {
    split.append(bb_sf->split.array[i]);
  }
  json["split"] = split;

  Json::Value transform(Json::arrayValue);
  for (int i = 0; i < bb_sf->transform.length; i += 1) {
    transform.append(bb_sf->transform.array[i]);
  }
  json["transform"] = transform;

  Json::Value change_attrib(Json::arrayValue);
  for (int i = 0; i < bb_sf->change_attrib.length; i += 1) {
    change_attrib.append(bb_sf->change_attrib.array[i]);
  }
  json["change_attrib"] = change_attrib;

  Json::Value change(Json::arrayValue);
  for (int i = 0; i < bb_sf->change.length; i += 1) {
    change.append(bb_sf->change.array[i]);
  }
  json["change"] = change;

  return json;
}

void PK_BCURVE_sf_t_from_JSON(const Json::Value &json, PK_BCURVE_sf_t *bcurve_sf) {
  assert(json.isMember("degree"));
  assert(json.isMember("n_vertices"));
  assert(json.isMember("vertex_dim"));
  assert(json.isMember("is_rational"));
  assert(json.isMember("vertex"));
  assert(json.isMember("form"));
  assert(json.isMember("n_knots"));
  assert(json.isMember("knot_mult"));
  assert(json.isMember("knot"));
  assert(json.isMember("knot_type"));
  assert(json.isMember("is_periodic"));
  assert(json.isMember("is_closed"));
  assert(json.isMember("self_intersecting"));

  bcurve_sf->degree = json["degree"].asInt();
  bcurve_sf->n_vertices = json["n_vertices"].asInt();
  bcurve_sf->vertex_dim = json["vertex_dim"].asInt();
  bcurve_sf->is_rational = json["is_rational"].asBool();

  double *vertex = new double[bcurve_sf->n_vertices * bcurve_sf->vertex_dim];
  for (int i = 0; i < bcurve_sf->n_vertices * bcurve_sf->vertex_dim; i += 1) {
    vertex[i] = json["vertex"][i].asDouble();
  }
  bcurve_sf->vertex = vertex;

  bcurve_sf->form = json["form"].asInt();
  bcurve_sf->n_knots = json["n_knots"].asInt();

  int *knot_mult = new int[bcurve_sf->n_knots];
  for (int i = 0; i < bcurve_sf->n_knots; i += 1) {
    knot_mult[i] = json["knot_mult"][i].asInt();
  }
  bcurve_sf->knot_mult = knot_mult;

  double *knot = new double[bcurve_sf->n_knots];
  for (int i = 0; i < bcurve_sf->n_knots; i += 1) {
    knot[i] = json["knot"][i].asDouble();
  }
  bcurve_sf->knot = knot;

  bcurve_sf->knot_type = json["knot_type"].asInt();
  bcurve_sf->is_periodic = json["is_periodic"].asBool();
  bcurve_sf->is_closed = json["is_closed"].asBool();
  bcurve_sf->self_intersecting = json["self_intersecting"].asInt();
}

Json::Value PK_BCURVE_sf_t_to_JSON(const PK_BCURVE_sf_t *bcurve_sf) {
  Json::Value json(Json::objectValue);
  json["degree"] = bcurve_sf->degree;
  json["n_vertices"] = bcurve_sf->n_vertices;
  json["vertex_dim"] = bcurve_sf->vertex_dim;
  json["is_rational"] = bcurve_sf->is_rational;

  Json::Value vertex(Json::arrayValue);
  for (int i = 0; i < bcurve_sf->n_vertices * bcurve_sf->vertex_dim; i += 1) {
    vertex.append(bcurve_sf->vertex[i]);
  }
  json["vertex"] = vertex;

  json["form"] = bcurve_sf->form;
  json["n_knots"] = bcurve_sf->n_knots;

  Json::Value knot_mult(Json::arrayValue);
  for (int i = 0; i < bcurve_sf->n_knots; i += 1) {
    knot_mult.append(bcurve_sf->knot_mult[i]);
  }
  json["knot_mult"] = knot_mult;

  Json::Value knot(Json::arrayValue);
  for (int i = 0; i < bcurve_sf->n_knots; i += 1) {
    knot.append(bcurve_sf->knot[i]);
  }
  json["knot"] = knot;

  json["knot_type"] = bcurve_sf->knot_type;
  json["is_periodic"] = bcurve_sf->is_periodic;
  json["is_closed"] = bcurve_sf->is_closed;
  json["self_intersecting"] = bcurve_sf->self_intersecting;

  return json;
}

void PK_BSURF_sf_t_from_JSON(const Json::Value &json, PK_BSURF_sf_t *bsurf_sf) {
  // TODO
  assert(json.isMember("u_degree"));
  assert(json.isMember("v_degree"));
  assert(json.isMember("n_u_vertices"));
  assert(json.isMember("n_v_vertices"));
  assert(json.isMember("vertex_dim"));
  assert(json.isMember("is_rational"));
  assert(json.isMember("vertex"));
  assert(json.isMember("form"));
  assert(json.isMember("n_u_knots"));
  assert(json.isMember("n_v_knots"));
  assert(json.isMember("u_knot_mult"));
  assert(json.isMember("v_knot_mult"));
  assert(json.isMember("u_knot"));
  assert(json.isMember("v_knot"));
  assert(json.isMember("u_knot_type"));
  assert(json.isMember("v_knot_type"));
  assert(json.isMember("is_u_periodic"));
  assert(json.isMember("is_v_periodic"));
  assert(json.isMember("is_u_closed"));
  assert(json.isMember("is_v_closed"));
  assert(json.isMember("self_intersecting"));
  assert(json.isMember("convexity"));

  bsurf_sf->u_degree = json["u_degree"].asInt();
}

Json::Value PK_BSURF_sf_t_to_JSON(const PK_BSURF_sf_t *bsurf_sf) {
  // TODO
}

void PK_BODY_extrude_o_t_from_JSON(const Json::Value &json, _PK_BODY_extrude_o_t *options) {
  PK_bound_def_s_from_JSON(json["start_bound"], &options->start_bound);
  PK_bound_def_s_from_JSON(json["end_bound"], &options->end_bound);
  options->extruded_body = json["extruded_body"].asInt();
  options->allow_disjoint = json["allow_disjoint"].asBool();
  options->consistent_params = json["consistent_params"].asBool();
}

Json::Value PK_BODY_extrude_o_t_to_JSON(const _PK_BODY_extrude_o_t *options) {
  Json::Value json;

  json["start_bound"] = PK_bound_def_s_to_JSON(&options->start_bound);
  json["end_bound"] = PK_bound_def_s_to_JSON(&options->end_bound);
  json["extruded_body"] = options->extruded_body;
  json["allow_disjoint"] = options->allow_disjoint;
  json["consistent_params"] = options->consistent_params;
  return json;
}

void PK_bound_def_s_from_JSON(const Json::Value &json, _PK_bound_def_s *bound) {
  bound->bound = json["bound"].asInt();
  bound->forward = json["forward"].asInt();
  bound->distance = json["distance"].asDouble();
  bound->entity = json["entity"].asInt();
  bound->nearest = json["nearest"].asBool();
  bound->nth_division = json["nth_division"].asInt();
  bound->side = json["side"].asInt();
}

Json::Value PK_bound_def_s_to_JSON(const _PK_bound_def_s *bound) {
  Json::Value json;
  json["bound"] = bound->bound;
  json["forward"] = bound->forward;
  json["distance"] = bound->distance;
  json["entity"] = bound->entity;
  json["nearest"] = bound->nearest;
  json["nth_division"] = bound->nth_division;
  json["side"] = bound->side;

  return json;
}
