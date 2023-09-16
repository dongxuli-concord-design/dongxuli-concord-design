#pragma once

#include <iostream>
#include <cassert>

#include "parasolid/frustrum_tokens.h"
#include "parasolid/frustrum_ifails.h"
#include "parasolid/parasolid_kernel.h"
#include "json.h"

void PK_VECTOR_t_from_JSON(const Json::Value &json, PK_VECTOR_t *vector);
Json::Value PK_VECTOR_t_to_JSON(const PK_VECTOR_t *vector);

void PK_AXIS1_sf_t_from_JSON(const Json::Value &json, PK_AXIS1_sf_t *basis_set);
Json::Value PK_AXIS1_sf_t_to_JSON(const PK_AXIS1_sf_t *basis_set);

void PK_AXIS2_sf_t_from_JSON(const Json::Value &json, PK_AXIS2_sf_t *basis_set);
Json::Value PK_AXIS2_sf_t_to_JSON(const PK_AXIS2_sf_t *basis_set);

void PK_TRANSF_sf_t_from_JSON(const Json::Value &json, PK_TRANSF_sf_t *transf_sf);
Json::Value PK_TRANSF_sf_t_to_JSON(const PK_TRANSF_sf_t *transf_sf);

void PK_POINT_sf_t_from_JSON(const Json::Value &json, PK_POINT_sf_t *point_sf);
Json::Value PK_POINT_sf_t_to_JSON(const PK_POINT_sf_t *point_sf);

void PK_LINE_sf_t_from_JSON(const Json::Value &json, PK_LINE_sf_t *line_sf);
Json::Value PK_LINE_sf_t_to_JSON(const PK_LINE_sf_t *line_sf);

void PK_CIRCLE_sf_t_from_JSON(const Json::Value &json, PK_CIRCLE_sf_t *circle_sf);
Json::Value PK_CIRCLE_sf_t_to_JSON(const PK_CIRCLE_sf_t *circle_sf);

void PK_PLANE_sf_t_from_JSON(const Json::Value &json, PK_PLANE_sf_t *plane_sf);
Json::Value PK_PLANE_sf_t_to_JSON(const PK_PLANE_sf_t *plane_sf);

void PK_SPHERE_sf_t_from_JSON(const Json::Value &json, PK_SPHERE_sf_t *sphere_sf);
Json::Value PK_SPHERE_sf_t_to_JSON(const PK_SPHERE_sf_t *sphere_sf);

void PK_INSTANCE_sf_t_from_JSON(const Json::Value &json, PK_INSTANCE_sf_t *instance_sf);
Json::Value PK_INSTANCE_sf_t_to_JSON(const PK_INSTANCE_sf_t *instance_sf);

void PK_INTERVAL_t_from_JSON(const Json::Value &json, PK_INTERVAL_t *interval);
Json::Value PK_INTERVAL_t_to_JSON(const PK_INTERVAL_t *interval);

void PK_UVBOX_t_from_JSON(const Json::Value &json, PK_UVBOX_t *uvbox);
Json::Value PK_UVBOX_t_to_JSON(const PK_UVBOX_t *uvbox);

void PK_BOX_t_from_JSON(const Json::Value &json, PK_BOX_t *box);
Json::Value PK_BOX_t_to_JSON(const PK_BOX_t *box);

void PK_UV_t_from_JSON(const Json::Value &json, PK_UV_t *uv);
Json::Value PK_UV_t_to_JSON(const PK_UV_t *uv);

void PK_BB_sf_t_from_JSON(const Json::Value &json, PK_BB_sf_t *bb_sf);
Json::Value PK_BB_sf_t_to_JSON(const PK_BB_sf_t *bb_sf);

void PK_BCURVE_sf_t_from_JSON(const Json::Value &json, PK_BCURVE_sf_t *bcurve_sf);
Json::Value PK_BCURVE_sf_t_to_JSON(const PK_BCURVE_sf_t *bcurve_sf);

void PK_BSURF_sf_t_from_JSON(const Json::Value &json, PK_BSURF_sf_t *bsurf_sf);
Json::Value PK_BSURF_sf_t_to_JSON(const PK_BSURF_sf_t *bsurf_sf);

void PK_BODY_extrude_o_t_from_JSON(const Json::Value &json, _PK_BODY_extrude_o_t *options);
Json::Value PK_BODY_extrude_o_t_to_JSON(const _PK_BODY_extrude_o_t *options);

void PK_bound_def_s_from_JSON(const Json::Value &json, _PK_bound_def_s *bound);
Json::Value PK_bound_def_s_to_JSON(const _PK_bound_def_s *bound);
