#include <memory>
#include <cassert>
#include <map>
#include <iostream>
#include <string>
#include <map>
#include "api.h"
#include "pksession.h"
#include "param.h"
#include "base64.h"
#include "util.h"

using namespace std;
typedef Json::Value (*apiFunc)(const Json::Value &params);

#define API_METHOD_ENTRY(api) {#api, api},

map<string, apiFunc> API_FUNC_MAP{
    API_METHOD_ENTRY(Test1)
    API_METHOD_ENTRY(Test2)
    API_METHOD_ENTRY(ASSEMBLY_ask_instances)
    API_METHOD_ENTRY(ASSEMBLY_ask_parts)
    API_METHOD_ENTRY(ASSEMBLY_ask_parts_transfs)
    API_METHOD_ENTRY(ASSEMBLY_create_empty)
    API_METHOD_ENTRY(ASSEMBLY_make_level_assembly)
    API_METHOD_ENTRY(ASSEMBLY_transform)
    API_METHOD_ENTRY(BCURVE_add_knot)
    API_METHOD_ENTRY(BCURVE_ask)
    API_METHOD_ENTRY(BCURVE_ask_knots)
    API_METHOD_ENTRY(BCURVE_ask_piecewise)
    API_METHOD_ENTRY(BCURVE_ask_splinewise)
    API_METHOD_ENTRY(BCURVE_clamp_knots)
    API_METHOD_ENTRY(BCURVE_combine)
    API_METHOD_ENTRY(BCURVE_create)
    API_METHOD_ENTRY(BCURVE_create_by_fitting)
    API_METHOD_ENTRY(BCURVE_create_fitted)
    API_METHOD_ENTRY(BCURVE_create_piecewise)
    API_METHOD_ENTRY(BCURVE_create_spline_2)
    API_METHOD_ENTRY(BCURVE_create_splinewise)
    API_METHOD_ENTRY(BCURVE_extend)
    API_METHOD_ENTRY(BCURVE_find_g1_discontinuity)
    API_METHOD_ENTRY(BCURVE_join)
    API_METHOD_ENTRY(BCURVE_lower_degree)
    API_METHOD_ENTRY(BCURVE_make_bsurf_lofted)
    API_METHOD_ENTRY(BCURVE_make_matched)
    API_METHOD_ENTRY(BCURVE_raise_degree)
    API_METHOD_ENTRY(BCURVE_remove_knots)
    API_METHOD_ENTRY(BCURVE_reparameterise)
    API_METHOD_ENTRY(BCURVE_spin)
    API_METHOD_ENTRY(BCURVE_sweep)
    API_METHOD_ENTRY(BODY_apply_knit_pattern)
    API_METHOD_ENTRY(BODY_ask_curve_nmnl_state)
    API_METHOD_ENTRY(BODY_ask_edges)
    API_METHOD_ENTRY(BODY_ask_faces)
    API_METHOD_ENTRY(BODY_ask_fins)
    API_METHOD_ENTRY(BODY_ask_first_edge)
    API_METHOD_ENTRY(BODY_ask_first_face)
    API_METHOD_ENTRY(BODY_ask_loops)
    API_METHOD_ENTRY(BODY_ask_shells)
    API_METHOD_ENTRY(BODY_ask_topology)
    API_METHOD_ENTRY(BODY_ask_type)
    API_METHOD_ENTRY(BODY_ask_vertices)
    API_METHOD_ENTRY(BODY_boolean_2)
    API_METHOD_ENTRY(BODY_check)
    API_METHOD_ENTRY(BODY_contains_vector)
    API_METHOD_ENTRY(BODY_copy_topology)
    API_METHOD_ENTRY(BODY_create_sheet_circle)
    API_METHOD_ENTRY(BODY_create_sheet_planar)
    API_METHOD_ENTRY(BODY_create_sheet_polygon)
    API_METHOD_ENTRY(BODY_create_sheet_rectangle)
    API_METHOD_ENTRY(BODY_create_solid_block)
    API_METHOD_ENTRY(BODY_create_solid_cone)
    API_METHOD_ENTRY(BODY_create_solid_cyl)
    API_METHOD_ENTRY(BODY_create_solid_prism)
    API_METHOD_ENTRY(BODY_create_solid_sphere)
    API_METHOD_ENTRY(BODY_create_solid_torus)
    API_METHOD_ENTRY(BODY_create_topology_2)
    API_METHOD_ENTRY(BODY_disjoin)
    API_METHOD_ENTRY(BODY_embed_in_surf)
    API_METHOD_ENTRY(BODY_emboss)
    API_METHOD_ENTRY(BODY_extend)
    API_METHOD_ENTRY(BODY_extrude)
    API_METHOD_ENTRY(BODY_fill_hole)
    API_METHOD_ENTRY(BODY_find_extreme)
    API_METHOD_ENTRY(BODY_find_facesets)
    API_METHOD_ENTRY(BODY_find_knit_pattern)
    API_METHOD_ENTRY(BODY_find_laminar_edges)
    API_METHOD_ENTRY(BODY_fix_blends)
    API_METHOD_ENTRY(BODY_hollow_2)
    API_METHOD_ENTRY(BODY_identify_details)
    API_METHOD_ENTRY(BODY_identify_facesets)
    API_METHOD_ENTRY(BODY_identify_general)
    API_METHOD_ENTRY(BODY_imprint_body)
    API_METHOD_ENTRY(BODY_imprint_curve)
    API_METHOD_ENTRY(BODY_imprint_cus_shadow)
    API_METHOD_ENTRY(BODY_imprint_faces_2)
    API_METHOD_ENTRY(BODY_imprint_plane_2)
    API_METHOD_ENTRY(BODY_intersect_bodies)
    API_METHOD_ENTRY(BODY_knit)
    API_METHOD_ENTRY(BODY_make_curves_outline)
    API_METHOD_ENTRY(BODY_make_lofted_body)
    API_METHOD_ENTRY(BODY_make_manifold_bodies)
    API_METHOD_ENTRY(BODY_make_section)
    API_METHOD_ENTRY(BODY_make_section_with_surfs)
    API_METHOD_ENTRY(BODY_make_spun_outline)
    API_METHOD_ENTRY(BODY_make_swept_body_2)
    API_METHOD_ENTRY(BODY_make_swept_tool)
    API_METHOD_ENTRY(BODY_offset_2)
    API_METHOD_ENTRY(BODY_offset_planar_wire)
    API_METHOD_ENTRY(BODY_pick_topols)
    API_METHOD_ENTRY(BODY_remove_from_parents)
    API_METHOD_ENTRY(BODY_repair_shells)
    API_METHOD_ENTRY(BODY_reverse_orientation)
    API_METHOD_ENTRY(BODY_section_with_sheet_2)
    API_METHOD_ENTRY(BODY_section_with_surf)
    API_METHOD_ENTRY(BODY_set_curve_nmnl_state)
    API_METHOD_ENTRY(BODY_set_type)
    API_METHOD_ENTRY(BODY_sew_bodies)
    API_METHOD_ENTRY(BODY_share_geom)
    API_METHOD_ENTRY(BODY_simplify_geom)
    API_METHOD_ENTRY(BODY_spin)
    API_METHOD_ENTRY(BODY_subtract_bodies)
    API_METHOD_ENTRY(BODY_sweep)
    API_METHOD_ENTRY(BODY_taper)
    API_METHOD_ENTRY(BODY_thicken_3)
    API_METHOD_ENTRY(BODY_transform_2)
    API_METHOD_ENTRY(BODY_trim)
    API_METHOD_ENTRY(BODY_trim_gap_analysis)
    API_METHOD_ENTRY(BODY_trim_neutral_sheets_2)
    API_METHOD_ENTRY(BODY_unite_bodies)
    API_METHOD_ENTRY(BSURF_add_u_knot)
    API_METHOD_ENTRY(BSURF_add_v_knot)
    API_METHOD_ENTRY(BSURF_ask)
    API_METHOD_ENTRY(BSURF_ask_knots)
    API_METHOD_ENTRY(BSURF_ask_piecewise)
    API_METHOD_ENTRY(BSURF_ask_splinewise)
    API_METHOD_ENTRY(BSURF_clamp_knots)
    API_METHOD_ENTRY(BSURF_create)
    API_METHOD_ENTRY(BSURF_create_constrained)
    API_METHOD_ENTRY(BSURF_create_fitted)
    API_METHOD_ENTRY(BSURF_create_piecewise)
    API_METHOD_ENTRY(BSURF_create_splinewise)
    API_METHOD_ENTRY(BSURF_find_g1_discontinuity)
    API_METHOD_ENTRY(BSURF_lower_degree)
    API_METHOD_ENTRY(BSURF_raise_degree)
    API_METHOD_ENTRY(BSURF_remove_knots)
    API_METHOD_ENTRY(BSURF_reparameterise)
    API_METHOD_ENTRY(CIRCLE_ask)
    API_METHOD_ENTRY(CIRCLE_create)
    API_METHOD_ENTRY(CONE_ask)
    API_METHOD_ENTRY(CONE_create)
    API_METHOD_ENTRY(CONE_make_solid_body)
    API_METHOD_ENTRY(CURVE_ask_edges)
    API_METHOD_ENTRY(CURVE_ask_edges_nmnl)
    API_METHOD_ENTRY(CURVE_ask_fin)
    API_METHOD_ENTRY(CURVE_ask_interval)
    API_METHOD_ENTRY(CURVE_ask_param)
    API_METHOD_ENTRY(CURVE_ask_parm_different)
    API_METHOD_ENTRY(CURVE_ask_part)
    API_METHOD_ENTRY(CURVE_convert_parm_to_ki)
    API_METHOD_ENTRY(CURVE_convert_parm_to_pk)
    API_METHOD_ENTRY(CURVE_embed_in_surf_2)
    API_METHOD_ENTRY(CURVE_eval)
    API_METHOD_ENTRY(CURVE_eval_curvature)
    API_METHOD_ENTRY(CURVE_eval_curvature_handed)
    API_METHOD_ENTRY(CURVE_eval_handed)
    API_METHOD_ENTRY(CURVE_eval_with_tan_handed)
    API_METHOD_ENTRY(CURVE_eval_with_tangent)
    API_METHOD_ENTRY(CURVE_find_degens)
    API_METHOD_ENTRY(CURVE_find_discontinuity)
    API_METHOD_ENTRY(CURVE_find_length)
    API_METHOD_ENTRY(CURVE_find_min_radius)
    API_METHOD_ENTRY(CURVE_find_non_aligned_box)
    API_METHOD_ENTRY(CURVE_find_self_int)
    API_METHOD_ENTRY(CURVE_find_surfs_common)
    API_METHOD_ENTRY(CURVE_find_vector_interval)
    API_METHOD_ENTRY(CURVE_find_vectors)
    API_METHOD_ENTRY(CURVE_fix_degens)
    API_METHOD_ENTRY(CURVE_fix_self_int)
    API_METHOD_ENTRY(CURVE_intersect_curve)
    API_METHOD_ENTRY(CURVE_is_isoparam)
    API_METHOD_ENTRY(CURVE_make_approx)
    API_METHOD_ENTRY(CURVE_make_bcurve_2)
    API_METHOD_ENTRY(CURVE_make_curve_reversed)
    API_METHOD_ENTRY(CURVE_make_helical_surf)
    API_METHOD_ENTRY(CURVE_make_spcurves_2)
    API_METHOD_ENTRY(CURVE_make_surf_isocline)
    API_METHOD_ENTRY(CURVE_make_wire_body_2)
    API_METHOD_ENTRY(CURVE_output_vectors)
    API_METHOD_ENTRY(CURVE_parameterise_vector)
    API_METHOD_ENTRY(CURVE_project)
    API_METHOD_ENTRY(CURVE_spin_2)
    API_METHOD_ENTRY(CURVE_sweep)
    API_METHOD_ENTRY(CYL_ask)
    API_METHOD_ENTRY(CYL_create)
    API_METHOD_ENTRY(CYL_make_solid_body)
    API_METHOD_ENTRY(EDGE_ask_blend)
    API_METHOD_ENTRY(EDGE_ask_body)
    API_METHOD_ENTRY(EDGE_ask_convexity)
    API_METHOD_ENTRY(EDGE_ask_curve)
    API_METHOD_ENTRY(EDGE_ask_curve_nmnl)
    API_METHOD_ENTRY(EDGE_ask_faces)
    API_METHOD_ENTRY(EDGE_ask_fins)
    API_METHOD_ENTRY(EDGE_ask_first_fin)
    API_METHOD_ENTRY(EDGE_ask_geometry)
    API_METHOD_ENTRY(EDGE_ask_geometry_nmnl)
    API_METHOD_ENTRY(EDGE_ask_next_in_body)
    API_METHOD_ENTRY(EDGE_ask_oriented_curve)
    API_METHOD_ENTRY(EDGE_ask_precision)
    API_METHOD_ENTRY(EDGE_ask_shells)
    API_METHOD_ENTRY(EDGE_ask_type)
    API_METHOD_ENTRY(EDGE_ask_vertices)
    API_METHOD_ENTRY(EDGE_attach_curve_nmnl)
    API_METHOD_ENTRY(EDGE_attach_curves_2)
    API_METHOD_ENTRY(EDGE_check)
    API_METHOD_ENTRY(EDGE_contains_vector)
    API_METHOD_ENTRY(EDGE_delete)
    API_METHOD_ENTRY(EDGE_delete_wireframe)
    API_METHOD_ENTRY(EDGE_detach_curve_nmnl)
    API_METHOD_ENTRY(EDGE_find_deviation_2)
    API_METHOD_ENTRY(EDGE_find_end_tangents)
    API_METHOD_ENTRY(EDGE_find_extreme)
    API_METHOD_ENTRY(EDGE_find_g1_edges)
    API_METHOD_ENTRY(EDGE_find_interval)
    API_METHOD_ENTRY(EDGE_imprint_point)
    API_METHOD_ENTRY(EDGE_is_planar)
    API_METHOD_ENTRY(EDGE_is_smooth)
    API_METHOD_ENTRY(EDGE_make_curve)
    API_METHOD_ENTRY(EDGE_make_faces_from_wire)
    API_METHOD_ENTRY(EDGE_make_wire_body)
    API_METHOD_ENTRY(EDGE_offset_on_body)
    API_METHOD_ENTRY(EDGE_optimise)
    API_METHOD_ENTRY(EDGE_propagate_orientation)
    API_METHOD_ENTRY(EDGE_remove_blend)
    API_METHOD_ENTRY(EDGE_remove_to_bodies)
    API_METHOD_ENTRY(EDGE_repair)
    API_METHOD_ENTRY(EDGE_reset_precision_2)
    API_METHOD_ENTRY(EDGE_reverse_2)
    API_METHOD_ENTRY(EDGE_set_blend_chamfer)
    API_METHOD_ENTRY(EDGE_set_blend_constant)
    API_METHOD_ENTRY(EDGE_set_blend_variable)
    API_METHOD_ENTRY(EDGE_set_precision_2)
    API_METHOD_ENTRY(EDGE_split_at_param)
    API_METHOD_ENTRY(ELLIPSE_ask)
    API_METHOD_ENTRY(ELLIPSE_create)
    API_METHOD_ENTRY(ENTITY_ask_attribs)
    API_METHOD_ENTRY(ENTITY_ask_class)
    API_METHOD_ENTRY(ENTITY_ask_description)
    API_METHOD_ENTRY(ENTITY_ask_first_attrib)
    API_METHOD_ENTRY(ENTITY_ask_identifier)
    API_METHOD_ENTRY(ENTITY_ask_owning_groups)
    API_METHOD_ENTRY(ENTITY_ask_partition)
    API_METHOD_ENTRY(ENTITY_ask_user_field)
    API_METHOD_ENTRY(ENTITY_check_attribs)
    API_METHOD_ENTRY(ENTITY_copy_2)
    API_METHOD_ENTRY(ENTITY_delete)
    API_METHOD_ENTRY(ENTITY_delete_attribs)
    API_METHOD_ENTRY(ENTITY_is)
    API_METHOD_ENTRY(ENTITY_is_curve)
    API_METHOD_ENTRY(ENTITY_is_geom)
    API_METHOD_ENTRY(ENTITY_is_part)
    API_METHOD_ENTRY(ENTITY_is_surf)
    API_METHOD_ENTRY(ENTITY_is_topol)
    API_METHOD_ENTRY(FACE_ask_body)
    API_METHOD_ENTRY(FACE_ask_edges)
    API_METHOD_ENTRY(FACE_ask_faces_adjacent)
    API_METHOD_ENTRY(FACE_ask_first_loop)
    API_METHOD_ENTRY(FACE_ask_loops)
    API_METHOD_ENTRY(FACE_ask_next_in_body)
    API_METHOD_ENTRY(FACE_ask_oriented_surf)
    API_METHOD_ENTRY(FACE_ask_shells)
    API_METHOD_ENTRY(FACE_ask_surf)
    API_METHOD_ENTRY(FACE_ask_vertices)
    API_METHOD_ENTRY(FACE_attach_surf_fitting)
    API_METHOD_ENTRY(FACE_attach_surfs)
    API_METHOD_ENTRY(FACE_boolean_2)
    API_METHOD_ENTRY(FACE_change)
    API_METHOD_ENTRY(FACE_check)
    API_METHOD_ENTRY(FACE_check_pair)
    API_METHOD_ENTRY(FACE_classify_details)
    API_METHOD_ENTRY(FACE_close_gaps)
    API_METHOD_ENTRY(FACE_contains_vectors)
    API_METHOD_ENTRY(FACE_cover)
    API_METHOD_ENTRY(FACE_delete_2)
    API_METHOD_ENTRY(FACE_delete_blends)
    API_METHOD_ENTRY(FACE_delete_facesets)
    API_METHOD_ENTRY(FACE_delete_from_gen_body)
    API_METHOD_ENTRY(FACE_delete_from_sheet)
    API_METHOD_ENTRY(FACE_emboss)
    API_METHOD_ENTRY(FACE_euler_make_loop)
    API_METHOD_ENTRY(FACE_euler_make_ring_face)
    API_METHOD_ENTRY(FACE_euler_make_ring_loop)
    API_METHOD_ENTRY(FACE_euler_unslit)
    API_METHOD_ENTRY(FACE_find_blend_unders)
    API_METHOD_ENTRY(FACE_find_edges_common)
    API_METHOD_ENTRY(FACE_find_extreme)
    API_METHOD_ENTRY(FACE_find_interior_vec)
    API_METHOD_ENTRY(FACE_find_outer_loop)
    API_METHOD_ENTRY(FACE_find_uvbox)
    API_METHOD_ENTRY(FACE_hollow_3)
    API_METHOD_ENTRY(FACE_identify_blends)
    API_METHOD_ENTRY(FACE_imprint_curves_2)
    API_METHOD_ENTRY(FACE_imprint_cus_isoclin)
    API_METHOD_ENTRY(FACE_imprint_faces_2)
    API_METHOD_ENTRY(FACE_imprint_point)
    API_METHOD_ENTRY(FACE_instance_bodies)
    API_METHOD_ENTRY(FACE_instance_tools)
    API_METHOD_ENTRY(FACE_intersect_curve)
    API_METHOD_ENTRY(FACE_intersect_face)
    API_METHOD_ENTRY(FACE_intersect_surf)
    API_METHOD_ENTRY(FACE_is_coincident)
    API_METHOD_ENTRY(FACE_is_periodic)
    API_METHOD_ENTRY(FACE_is_uvbox)
    API_METHOD_ENTRY(FACE_make_3_face_blend)
    API_METHOD_ENTRY(FACE_make_blend)
    API_METHOD_ENTRY(FACE_make_neutral_sheet_2)
    API_METHOD_ENTRY(FACE_make_sect_with_sfs)
    API_METHOD_ENTRY(FACE_make_sheet_bodies)
    API_METHOD_ENTRY(FACE_make_solid_bodies)
    API_METHOD_ENTRY(FACE_offset_2)
    API_METHOD_ENTRY(FACE_output_surf_trimmed)
    API_METHOD_ENTRY(FACE_pattern)
    API_METHOD_ENTRY(FACE_remove_to_solid_bodies)
    API_METHOD_ENTRY(FACE_repair)
    API_METHOD_ENTRY(FACE_replace_surfs_3)
    API_METHOD_ENTRY(FACE_replace_with_sheet)
    API_METHOD_ENTRY(FACE_reverse)
    API_METHOD_ENTRY(FACE_section_with_sheet_2)
    API_METHOD_ENTRY(FACE_set_approx)
    API_METHOD_ENTRY(FACE_simplify_geom)
    API_METHOD_ENTRY(FACE_spin)
    API_METHOD_ENTRY(FACE_split_at_param)
    API_METHOD_ENTRY(FACE_sweep)
    API_METHOD_ENTRY(FACE_taper)
    API_METHOD_ENTRY(FACE_transform_2)
    API_METHOD_ENTRY(FACE_unset_approx)
    API_METHOD_ENTRY(FCURVE_ask)
    API_METHOD_ENTRY(FCURVE_create)
    API_METHOD_ENTRY(FSURF_ask)
    API_METHOD_ENTRY(FSURF_create)
    API_METHOD_ENTRY(GEOM_ask_dependents)
    API_METHOD_ENTRY(GEOM_ask_geom_owners)
    API_METHOD_ENTRY(GEOM_check)
    API_METHOD_ENTRY(GEOM_copy)
    API_METHOD_ENTRY(GEOM_delete_single)
    API_METHOD_ENTRY(GEOM_is_coincident)
    API_METHOD_ENTRY(GEOM_range)
    API_METHOD_ENTRY(GEOM_range_array)
    API_METHOD_ENTRY(GEOM_range_array_vector)
    API_METHOD_ENTRY(GEOM_range_local)
    API_METHOD_ENTRY(GEOM_range_local_vector)
    API_METHOD_ENTRY(GEOM_range_vector)
    API_METHOD_ENTRY(GEOM_range_vector_many)
    API_METHOD_ENTRY(GEOM_render_line)
    API_METHOD_ENTRY(GEOM_transform_2)
    API_METHOD_ENTRY(INSTANCE_ask)
    API_METHOD_ENTRY(INSTANCE_change_part)
    API_METHOD_ENTRY(INSTANCE_create)
    API_METHOD_ENTRY(INSTANCE_replace_transf)
    API_METHOD_ENTRY(INSTANCE_transform)
    API_METHOD_ENTRY(LINE_ask)
    API_METHOD_ENTRY(LINE_create)
    API_METHOD_ENTRY(LOOP_ask_body)
    API_METHOD_ENTRY(LOOP_ask_edges)
    API_METHOD_ENTRY(LOOP_ask_face)
    API_METHOD_ENTRY(LOOP_ask_first_fin)
    API_METHOD_ENTRY(LOOP_ask_next_in_face)
    API_METHOD_ENTRY(LOOP_ask_type)
    API_METHOD_ENTRY(LOOP_ask_vertices)
    API_METHOD_ENTRY(LOOP_close_gaps)
    API_METHOD_ENTRY(LOOP_delete_from_sheet_body)
    API_METHOD_ENTRY(LOOP_euler_create_edge)
    API_METHOD_ENTRY(LOOP_euler_delete_isolated)
    API_METHOD_ENTRY(LOOP_euler_delete_make_edge)
    API_METHOD_ENTRY(LOOP_euler_make_edge)
    API_METHOD_ENTRY(LOOP_euler_make_edge_face)
    API_METHOD_ENTRY(LOOP_euler_make_edge_loop)
    API_METHOD_ENTRY(LOOP_euler_transfer)
    API_METHOD_ENTRY(LOOP_is_isolated)
    API_METHOD_ENTRY(OFFSET_ask)
    API_METHOD_ENTRY(OFFSET_create)
    API_METHOD_ENTRY(PART_add_geoms)
    API_METHOD_ENTRY(PART_ask_all_attdefs)
    API_METHOD_ENTRY(PART_ask_all_attribs)
    API_METHOD_ENTRY(PART_ask_attribs_cb)
    API_METHOD_ENTRY(PART_ask_construction_curves)
    API_METHOD_ENTRY(PART_ask_construction_points)
    API_METHOD_ENTRY(PART_ask_construction_surfs)
    API_METHOD_ENTRY(PART_ask_geoms)
    API_METHOD_ENTRY(PART_ask_groups)
    API_METHOD_ENTRY(PART_ask_ref_instances)
    API_METHOD_ENTRY(PART_delete_attribs)
    API_METHOD_ENTRY(PART_find_entity_by_ident)
    API_METHOD_ENTRY(PART_receive)
    API_METHOD_ENTRY(PART_receive_b)
    API_METHOD_ENTRY(PART_receive_u)
    API_METHOD_ENTRY(PART_receive_version)
    API_METHOD_ENTRY(PART_receive_version_b)
    API_METHOD_ENTRY(PART_receive_version_u)
    API_METHOD_ENTRY(PART_rectify_identifiers)
    API_METHOD_ENTRY(PART_remove_geoms)
    API_METHOD_ENTRY(PART_transmit)
    API_METHOD_ENTRY(PART_transmit_b)
    API_METHOD_ENTRY(PART_transmit_u)
    API_METHOD_ENTRY(PLANE_ask)
    API_METHOD_ENTRY(PLANE_create)
    API_METHOD_ENTRY(POINT_ask)
    API_METHOD_ENTRY(POINT_ask_part)
    API_METHOD_ENTRY(POINT_ask_vertex)
    API_METHOD_ENTRY(POINT_create)
    API_METHOD_ENTRY(POINT_make_helical_curve)
    API_METHOD_ENTRY(POINT_make_minimum_body)
    API_METHOD_ENTRY(SESSION_ask_parts)
    API_METHOD_ENTRY(SHELL_ask_acorn_vertex)
    API_METHOD_ENTRY(SHELL_ask_body)
    API_METHOD_ENTRY(SHELL_ask_oriented_faces)
    API_METHOD_ENTRY(SHELL_ask_region)
    API_METHOD_ENTRY(SHELL_ask_type)
    API_METHOD_ENTRY(SHELL_ask_wireframe_edges)
    API_METHOD_ENTRY(SHELL_find_sign)
    API_METHOD_ENTRY(SPCURVE_ask)
    API_METHOD_ENTRY(SPCURVE_create)
    API_METHOD_ENTRY(SPHERE_ask)
    API_METHOD_ENTRY(SPHERE_create)
    API_METHOD_ENTRY(SPHERE_make_solid_body)
    API_METHOD_ENTRY(SPUN_ask)
    API_METHOD_ENTRY(SPUN_create)
    API_METHOD_ENTRY(SURF_ask_faces)
    API_METHOD_ENTRY(SURF_ask_params)
    API_METHOD_ENTRY(SURF_ask_part)
    API_METHOD_ENTRY(SURF_ask_uvbox)
    API_METHOD_ENTRY(SURF_create_blend)
    API_METHOD_ENTRY(SURF_eval)
    API_METHOD_ENTRY(SURF_eval_curvature)
    API_METHOD_ENTRY(SURF_eval_curvature_handed)
    API_METHOD_ENTRY(SURF_eval_grid)
    API_METHOD_ENTRY(SURF_eval_handed)
    API_METHOD_ENTRY(SURF_eval_with_normal)
    API_METHOD_ENTRY(SURF_eval_with_normal_handed)
    API_METHOD_ENTRY(SURF_extend)
    API_METHOD_ENTRY(SURF_find_curves_common)
    API_METHOD_ENTRY(SURF_find_degens)
    API_METHOD_ENTRY(SURF_find_discontinuity)
    API_METHOD_ENTRY(SURF_find_min_radii)
    API_METHOD_ENTRY(SURF_find_non_aligned_box)
    API_METHOD_ENTRY(SURF_find_self_int)
    API_METHOD_ENTRY(SURF_fix_degens)
    API_METHOD_ENTRY(SURF_fix_self_int)
    API_METHOD_ENTRY(SURF_intersect_curve)
    API_METHOD_ENTRY(SURF_intersect_surf)
    API_METHOD_ENTRY(SURF_make_bsurf_2)
    API_METHOD_ENTRY(SURF_make_curve_isoparam)
    API_METHOD_ENTRY(SURF_make_cus_isocline)
    API_METHOD_ENTRY(SURF_make_sheet_body)
    API_METHOD_ENTRY(SURF_make_sheet_trimmed)
    API_METHOD_ENTRY(SURF_offset)
    API_METHOD_ENTRY(SURF_parameterise_vector)
    API_METHOD_ENTRY(SWEPT_ask)
    API_METHOD_ENTRY(SWEPT_create)
    API_METHOD_ENTRY(TOPOL_ask_entities_by_attdef)
    API_METHOD_ENTRY(TOPOL_clash)
    API_METHOD_ENTRY(TOPOL_delete_redundant_2)
    API_METHOD_ENTRY(TOPOL_detach_geom)
    API_METHOD_ENTRY(TOPOL_eval_mass_props)
    API_METHOD_ENTRY(TOPOL_facet_2)
    API_METHOD_ENTRY(TOPOL_find_box)
    API_METHOD_ENTRY(TOPOL_find_nabox)
    API_METHOD_ENTRY(TOPOL_identify_redundant)
    API_METHOD_ENTRY(TOPOL_make_general_body)
    API_METHOD_ENTRY(TOPOL_make_new)
    API_METHOD_ENTRY(TOPOL_range)
    API_METHOD_ENTRY(TOPOL_range_array)
    API_METHOD_ENTRY(TOPOL_range_array_vector)
    API_METHOD_ENTRY(TOPOL_range_geom)
    API_METHOD_ENTRY(TOPOL_range_geom_array)
    API_METHOD_ENTRY(TOPOL_range_local)
    API_METHOD_ENTRY(TOPOL_range_local_vector)
    API_METHOD_ENTRY(TOPOL_range_vector)
    API_METHOD_ENTRY(TOPOL_remove_body_component)
    API_METHOD_ENTRY(TOPOL_render_facet)
    API_METHOD_ENTRY(TOPOL_render_line)
    API_METHOD_ENTRY(TORUS_ask)
    API_METHOD_ENTRY(TORUS_create)
    API_METHOD_ENTRY(TORUS_make_solid_body)
    API_METHOD_ENTRY(TRANSF_ask)
    API_METHOD_ENTRY(TRANSF_check)
    API_METHOD_ENTRY(TRANSF_classify)
    API_METHOD_ENTRY(TRANSF_create)
    API_METHOD_ENTRY(TRANSF_create_equal_scale)
    API_METHOD_ENTRY(TRANSF_create_reflection)
    API_METHOD_ENTRY(TRANSF_create_rotation)
    API_METHOD_ENTRY(TRANSF_create_translation)
    API_METHOD_ENTRY(TRANSF_create_view)
    API_METHOD_ENTRY(TRANSF_is_equal)
    API_METHOD_ENTRY(TRANSF_transform)
    API_METHOD_ENTRY(TRCURVE_ask)
    API_METHOD_ENTRY(VERTEX_ask_body)
    API_METHOD_ENTRY(VERTEX_ask_faces)
    API_METHOD_ENTRY(VERTEX_ask_isolated_loops)
    API_METHOD_ENTRY(VERTEX_ask_oriented_edges)
    API_METHOD_ENTRY(VERTEX_ask_point)
    API_METHOD_ENTRY(VERTEX_ask_point)
    API_METHOD_ENTRY(VERTEX_ask_precision)
    API_METHOD_ENTRY(VERTEX_ask_shells)
    API_METHOD_ENTRY(VERTEX_ask_type)
    API_METHOD_ENTRY(VERTEX_attach_points)
    API_METHOD_ENTRY(VERTEX_delete_acorn)
    API_METHOD_ENTRY(VERTEX_make_blend)
    API_METHOD_ENTRY(VERTEX_remove_edge)
    API_METHOD_ENTRY(VERTEX_spin)
    API_METHOD_ENTRY(VERTEX_sweep)
};

Json::Value callAPI(const string &apiStr) {
  Json::Value api(Json::objectValue);
  Json::CharReaderBuilder jsonBuilder;
  std::string errors;
  auto reader = std::unique_ptr<Json::CharReader>(jsonBuilder.newCharReader());
  bool ret = reader->parse(apiStr.c_str(), apiStr.c_str() + apiStr.length(), &api, &errors);
  apiAssert(ret, "parse API string error");

  string methodName = api[0].asString();
  Json::Value params = api[1];

  auto search = API_FUNC_MAP.find(methodName);
  if (search != API_FUNC_MAP.end()) {
    return search->second(params);
  } else {
    apiAssert(false, "API not found.");
  }
}

Json::Value Test1(const Json::Value &params) {
  assertParam(testParam);

  int testParam = params["testParam"].asInt();
  Json::Value returnValue = "test1";
  return returnValue;
}

Json::Value Test2(const Json::Value &params) {
  assertParam(testParam);

  int testParam = params["testParam"].asInt();
  Json::Value returnValue = "test2";
  return returnValue;
}

Json::Value ASSEMBLY_ask_instances(const Json::Value &params) {
  assertParam(assembly);

  int assembly = params["assembly"].asInt();

  int n_instances = 0;
  PK_INSTANCE_t *instances = nullptr;
  PK_ERROR_code_t error = PK_ASSEMBLY_ask_instances(assembly, &n_instances, &instances);

  assertModelingError;

  Json::Value instanceTags(Json::arrayValue);
  for (int i = 0; i < n_instances; i += 1) {
    instanceTags.append(instances[i]);
  }

  delete[] instances;
  instances = nullptr;

  Json::Value returnValue;
  returnValue["instances"] = instanceTags;

  return returnValue;
}

Json::Value ASSEMBLY_ask_parts(const Json::Value &params) {
  assertParam(assembly);
  PK_ASSEMBLY_t assembly = params["assembly"].asInt();

  int n_parts = 0;
  PK_INSTANCE_t *parts = nullptr;
  PK_ERROR_code_t error = PK_ASSEMBLY_ask_parts(assembly, &n_parts, &parts);

  assertModelingError;

  Json::Value partTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    partTags.append(parts[i]);
  }

  delete[] parts;
  parts = nullptr;

  Json::Value returnValue;
  returnValue["parts"] = partTags;

  return returnValue;
}

Json::Value ASSEMBLY_ask_parts_transfs(const Json::Value &params) {
  assertParam(assembly);
  PK_ASSEMBLY_t assembly = params["assembly"].asInt();

  int n_parts = 0;
  PK_INSTANCE_t *parts = nullptr;
  PK_TRANSF_t *transfs = nullptr;

  PK_ERROR_code_t error = PK_ASSEMBLY_ask_parts_transfs(assembly, &n_parts, &parts, &transfs);

  assertModelingError;

  Json::Value partTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    partTags[i] = parts[i];
  }

  Json::Value transfTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    transfTags[i] = transfs[i];
  }

  delete[] parts;
  parts = nullptr;
  delete[] transfs;
  transfs = nullptr;

  Json::Value returnValue;
  returnValue["parts"] = partTags;
  returnValue["transfs"] = transfTags;

  return returnValue;
}

Json::Value ASSEMBLY_create_empty(const Json::Value &params) {
  PK_ASSEMBLY_t assembly = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ASSEMBLY_create_empty(&assembly);

  assertModelingError;

  Json::Value returnValue;
  returnValue["assembly"] = assembly;

  return returnValue;
}

Json::Value ASSEMBLY_make_level_assembly(const Json::Value &params) {
  assertParam(assembly);
  PK_ASSEMBLY_t assembly = params["assembly"].asInt();

  PK_ASSEMBLY_t level_assembly = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ASSEMBLY_make_level_assembly(assembly, &level_assembly);

  assertModelingError;

  Json::Value returnValue;
  returnValue["level_assembly"] = level_assembly;

  return returnValue;
}

Json::Value ASSEMBLY_transform(const Json::Value &params) {
  assertParam(assembly);
  assertParam(transf);
  PK_ASSEMBLY_t assembly = params["assembly"].asInt();
  PK_TRANSF_t transf = params["transf"].asInt();
  PK_ERROR_code_t error = PK_ASSEMBLY_transform(assembly, transf);

  assertModelingError;

  return Json::nullValue;
}

Json::Value BCURVE_add_knot(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_ask_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_ask_piecewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_ask_splinewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_clamp_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_combine(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_create(const Json::Value &params) {
  assertParam(bcurve_sf);
  PK_BCURVE_sf_t bcurve_sf;
  PK_BCURVE_sf_t_from_JSON(params["bcurve_sf"], &bcurve_sf);

  PK_BCURVE_t bcurve = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_BCURVE_create(&bcurve_sf, &bcurve);

  assertModelingError;

  Json::Value returnValue;
  returnValue["bcurve"] = bcurve;
  return returnValue;
}

Json::Value BCURVE_create_by_fitting(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_create_fitted(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_create_piecewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_create_spline_2(const Json::Value &params) {
  assertParam(n_positions);
  assertParam(positions);

  Json::Value nPositionsParam = params["n_positions"];
  Json::Value positionsParam = params["positions"];

  int n_positions = nPositionsParam.asInt();

  PK_VECTOR_t *positions = new PK_VECTOR_t[n_positions];
  for (int i = 0; i < n_positions; i += 1) {
    PK_VECTOR_t position;
    PK_VECTOR_t_from_JSON(positionsParam[i], &position);
    positions[i].coord[0] = position.coord[0];
    positions[i].coord[1] = position.coord[1];
    positions[i].coord[2] = position.coord[2];
  }

  PK_BCURVE_create_spline_2_o_t options;
  PK_BCURVE_create_spline_2_o_m(options);

  PK_BCURVE_spline_r_t results;

  PK_ERROR_code_t error = PK_BCURVE_create_spline_2(n_positions, positions, &options, &results);

  delete[] positions;
  positions = nullptr;

  assertModelingError;

  apiAssert(results.fault == PK_BCURVE_spline_ok_c, "Modeling error: " + to_string(results.fault));

  Json::Value bCurveTags(Json::arrayValue);
  for (auto i = 0; i < results.n_bcurves; i += 1) {
    bCurveTags.append(results.bcurves[i].bcurve);
  }

  PK_BCURVE_spline_r_f(&results);

  Json::Value returnValue;
  returnValue["bcurves"] = bCurveTags;
  return returnValue;
}

Json::Value BCURVE_create_splinewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_extend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_find_g1_discontinuity(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_join(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_lower_degree(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_make_bsurf_lofted(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_make_matched(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_raise_degree(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_remove_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_reparameterise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_spin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BCURVE_sweep(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_apply_knit_pattern(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_curve_nmnl_state(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_edges(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();

  int n_edges = 0;
  PK_VERTEX_t *edges = nullptr;
  PK_ERROR_code_t error = PK_BODY_ask_edges(body, &n_edges, &edges);

  assertModelingError;

  Json::Value edgeTags(Json::arrayValue);
  for (auto i = 0; i < n_edges; i += 1) {
    edgeTags.append(edges[i]);
  }

  delete[] edges;
  edges = nullptr;

  Json::Value returnValue;
  returnValue["edges"] = edgeTags;
  return returnValue;
}

Json::Value BODY_ask_faces(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();

  int n_faces = 0;
  PK_VERTEX_t *faces = nullptr;
  PK_ERROR_code_t error = PK_BODY_ask_faces(body, &n_faces, &faces);

  assertModelingError;

  Json::Value faceTags(Json::arrayValue);
  for (auto i = 0; i < n_faces; i += 1) {
    faceTags.append(faces[i]);
  }

  delete[] faces;
  faces = nullptr;

  Json::Value returnValue;
  returnValue["faces"] = faceTags;
  return returnValue;
}

Json::Value BODY_ask_fins(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_first_edge(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();
  PK_EDGE_t first_edge = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_BODY_ask_first_edge(body, &first_edge);

  assertModelingError;

  Json::Value returnValue;
  returnValue["first_edge"] = first_edge;
  return returnValue;
}

Json::Value BODY_ask_first_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_loops(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_shells(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_topology(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_ask_type(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();

  PK_BODY_type_t body_type = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_BODY_ask_type(body, &body_type);

  assertModelingError;

  Json::Value returnValue;
  returnValue["body_type"] = body_type;
  return returnValue;
}

Json::Value BODY_ask_vertices(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();

  int n_vertices = 0;
  PK_VERTEX_t *vertices = nullptr;
  PK_ERROR_code_t error = PK_BODY_ask_vertices(body, &n_vertices, &vertices);

  assertModelingError;

  Json::Value vertexTags(Json::arrayValue);
  for (auto i = 0; i < n_vertices; i += 1) {
    vertexTags.append(vertices[i]);
  }

  delete[] vertices;
  vertices = nullptr;

  Json::Value returnValue;
  returnValue["vertices"] = vertexTags;
  return returnValue;
}

Json::Value BODY_boolean_2(const Json::Value &params) {
  assertParam(target);
  assertParam(tools);
  //assertParam(options);
  assertParam(func);

  PK_BODY_t target = params["target"].asInt();
  int n_tools = params["tools"].size();
  PK_BODY_t *tools = new PK_BODY_t[n_tools];
  for (int i = 0; i < n_tools; i += 1) {
    tools[i] = params["tools"][i].asInt();
  }

  //Json::Value options = params["options"];
  int func = params["func"].asInt();

  PK_BODY_boolean_o_t options;
  PK_BODY_boolean_o_m(options);
  options.function = func;
  PK_boolean_match_o_t boolmatch;
  PK_boolean_match_o_m(boolmatch);
  boolmatch.match_style = PK_boolean_match_style_auto_c;
  options.matched_region = &boolmatch;
  options.merge_imprinted = PK_LOGICAL_true;
  options.selective_merge = PK_LOGICAL_true;

  PK_TOPOL_track_r_t tracking;
  PK_boolean_r_t results;
  PK_ERROR_code_t error = PK_BODY_boolean_2(target, n_tools, tools, &options, &tracking, &results);

  delete[] tools;
  tools = nullptr;

  assertModelingError;

  apiAssert(results.result != PK_boolean_result_failed_c, "Boolean error: " + to_string(results.result));

  Json::Value bodyTags(Json::arrayValue);
  for (int i = 0; i < results.n_bodies; i += 1) {
    bodyTags.append(results.bodies[i]);
  }

  PK_TOPOL_track_r_f(&tracking);
  PK_boolean_r_f(&results);

  Json::Value returnValue;
  returnValue["bodies"] = bodyTags;
  return returnValue;
}

Json::Value BODY_check(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_contains_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_copy_topology(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_create_sheet_circle(const Json::Value &params) {
  assertParam(radius);
  assertParam(basis_set);

  double radius = params["radius"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;
  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_sheet_circle(radius, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_sheet_circle(radius, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_sheet_planar(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_create_sheet_polygon(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_create_sheet_rectangle(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_create_solid_block(const Json::Value &params) {
  assertParam(x);
  assertParam(y);
  assertParam(z);
  assertParam(basis_set);

  double x = params["x"].asDouble();
  double y = params["y"].asDouble();
  double z = params["z"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;
  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_block(x, y, z, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_block(x, y, z, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_solid_cone(const Json::Value &params) {
  assertParam(radius);
  assertParam(height);
  assertParam(semi_angle);
  assertParam(basis_set);

  double radius = params["radius"].asDouble();
  double height = params["height"].asDouble();
  double semi_angle = params["semi_angle"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;

  assertModelingError;

  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_cone(radius, height, semi_angle, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_cone(radius, height, semi_angle, &basis_set, &body);
  }

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_solid_cyl(const Json::Value &params) {
  assertParam(radius);
  assertParam(height);
  assertParam(basis_set);

  double radius = params["radius"].asDouble();
  double height = params["height"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;

  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_cyl(radius, height, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_cyl(radius, height, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_solid_prism(const Json::Value &params) {
  assertParam(radius);
  assertParam(height);
  assertParam(n_sides);
  assertParam(basis_set);

  double radius = params["radius"].asDouble();
  double height = params["height"].asDouble();
  double n_sides = params["n_sides"].asInt();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;

  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_prism(radius, height, n_sides, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_prism(radius, height, n_sides, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_solid_sphere(const Json::Value &params) {
  assertParam(radius);
  assertParam(basis_set);

  double radius = params["radius"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;

  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_sphere(radius, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_sphere(radius, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_solid_torus(const Json::Value &params) {
  assertParam(major_radius);
  assertParam(minor_radius);
  assertParam(basis_set);

  double major_radius = params["major_radius"].asDouble();
  double minor_radius = params["minor_radius"].asDouble();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ERROR_no_errors;

  if (params["basis_set"].isNull()) {
    error = PK_BODY_create_solid_torus(major_radius, minor_radius, NULL, &body);
  } else {
    PK_AXIS2_sf_t basis_set;
    PK_AXIS2_sf_t_from_JSON(params["basis_set"], &basis_set);
    error = PK_BODY_create_solid_torus(major_radius, minor_radius, &basis_set, &body);
  }

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value BODY_create_topology_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_disjoin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_embed_in_surf(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_emboss(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_extend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_extrude(const Json::Value &params) {
  assertParam(profile);
  assertParam(path);
  assertParam(options);

  PK_BODY_t profile = params["profile"].asInt();
  PK_VECTOR1_t path;
  PK_VECTOR_t_from_JSON(params["path"], &path);

  _PK_BODY_extrude_o_t options;
  PK_BODY_extrude_o_m(options);
  PK_BODY_extrude_o_t_from_JSON(params["options"], &options);

  PK_TOPOL_track_r_t tracking;
  PK_TOPOL_local_r_t results;
  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_BODY_extrude(profile, path, &options, &body, &tracking, &results);

  assertModelingError;

  PK_TOPOL_track_r_f(&tracking);
  PK_TOPOL_local_r_f(&results);

  Json::Value returnValue;
  returnValue["body"] = body;

  return returnValue;
}

Json::Value BODY_fill_hole(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_find_extreme(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_find_facesets(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_find_knit_pattern(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_find_laminar_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_fix_blends(const Json::Value &params) {
  assertParam(body);
  PK_BODY_t body = params["body"].asInt();

  PK_BODY_fix_blends_o_t fboptions;
  PK_BODY_fix_blends_o_m(fboptions);
  //fboptions.tracking_type = PK_blend_track_type_unders_c;
  //fboptions.vx_twin = PK_LOGICAL_true;
  fboptions.tracking_type = PK_blend_track_type_basic_c;

  /**
   * Refer to Parasolid docs - Functional Description 71.3.6
   *
   * "The default behavior is that any topology in the region completely
   * overlapped by the blend is deleted. For example, if the edge of a block
   * which has a hole in it is blended with a radius sufficiently large that
   * the blend completely overlaps the hole, the hole is deleted along with
   * any topology connected to it.
   *
   * Setting the transfer option results in the hole being preserved by moving
   * it into the new blend face (provided that the original hole is
   * sufficiently deep that it intersects with the blend)."
   */
  fboptions.transfer = PK_blend_transfer_topol_yes_c;

  /**
   * Refer to Parasolid docs - Functional Description 71.3.8
   *
   * "The vx_blend_data option controls whether to use vertex blending to
   * further smooth blended edges at any vertex. Vertex blending allows smooth
   * blending past sharp edges of opposite convexity to the blend."
   */
  fboptions.vx_blend_data.vertex_blend = PK_LOGICAL_true;

  int nblends = 0;
  PK_FACE_t *blends = nullptr;
  PK_FACE_array_t *unders = nullptr;
  int *topolsrepl = nullptr;
  PK_blend_fault_t fault;
  PK_EDGE_t faultedge = PK_ENTITY_null;
  PK_ENTITY_t faultopol = PK_ENTITY_null;

  PK_ERROR_code_t error =
      PK_BODY_fix_blends(body, &fboptions, &nblends, &blends, &unders, &topolsrepl, &fault, &faultedge, &faultopol);

  assertModelingError;

  apiAssert((fault == PK_blend_fault_no_fault_c) || (fault == PK_blend_fault_repaired_c),
            "Blend error: " + to_string(fault));

  delete[] blends;
  blends = nullptr;
  delete[] unders;
  unders = nullptr;
  delete[] topolsrepl;
  topolsrepl = nullptr;

  //TODO: return the tracking results!
  return Json::nullValue;
}

Json::Value BODY_hollow_2(const Json::Value &params) {
  assertParam(body);
  assertParam(offset);
  assertParam(faces);

  PK_BODY_t body = params["body"].asInt();
  double offset = params["offset"].asDouble();
  Json::Value faceArray = params["faces"];
  PK_FACE_t *faces = new PK_FACE_t[faceArray.size()];
  for (int i = 0; i < faceArray.size(); i += 1) {
    faces[i] = faceArray[i].asInt();
  }

  PK_BODY_hollow_o_t hollow_opts;
  PK_BODY_hollow_o_m(hollow_opts);
  PK_TOPOL_track_r_t tracking;
  PK_TOPOL_local_r_t results;
  hollow_opts.n_pierce_faces = faceArray.size();
  hollow_opts.pierce_faces = faces;

  double tolerance = 1e-6;
  PK_ERROR_code_t error = PK_SESSION_ask_precision(&tolerance);

  error = PK_BODY_hollow_2(body, offset, tolerance, &hollow_opts, &tracking, &results);

  delete[] faces;
  faces = nullptr;

  assertModelingError;

  PK_TOPOL_track_r_f(&tracking);
  PK_TOPOL_local_r_f(&results);

  return Json::nullValue;
}

Json::Value BODY_identify_details(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_identify_facesets(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_identify_general(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_imprint_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_imprint_curve(const Json::Value &params) {
  assertParam(body);
  assertParam(curve);
  assertParam(bounds);
  PK_BODY_t body = params["body"].asInt();
  PK_CURVE_t curve = params["curve"].asInt();
  PK_INTERVAL_t bounds;
  PK_INTERVAL_t_from_JSON(params["bounds"], &bounds);

  int n_new_edges = 0;//    --- number of new edges
  PK_EDGE_t *new_edges = NULL; //       --- new edges (optional)
  int n_new_faces = 0; //     --- number of new faces
  PK_FACE_t *new_faces = NULL; //        --- new faces (optional)
  PK_ERROR_code_t
      error = PK_BODY_imprint_curve(body, curve, bounds, &n_new_edges, &new_edges, &n_new_faces, &new_faces);

  assertModelingError;

  Json::Value returnValue;
  Json::Value newEdgesArray(Json::arrayValue);
  for (int i = 0; i < n_new_edges; i += 1) {
    newEdgesArray.append(new_edges[i]);
  }
  returnValue["new_edges"] = newEdgesArray;

  Json::Value newFacesArray(Json::arrayValue);
  for (int i = 0; i < n_new_faces; i += 1) {
    newFacesArray.append(new_faces[i]);
  }
  returnValue["new_faces"] = newFacesArray;

  delete[] new_edges;
  new_edges = nullptr;
  delete[] new_faces;
  new_faces = nullptr;

  return returnValue;
}

Json::Value BODY_imprint_cus_shadow(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_imprint_faces_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_imprint_plane_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_intersect_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_knit(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_curves_outline(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_lofted_body(const Json::Value &params) {
  assertParam(profiles);
  assertParam(start_vertices);
  assertParam(guide_wires);

  Json::Value profilesParam = params["profiles"];
  Json::Value startVerticesParam = params["start_vertices"];
  Json::Value guideWiresParam = params["guide_wires"];

  int n_profiles = profilesParam.size();
  PK_BODY_t *profiles = new PK_BODY_t[n_profiles];
  for (int i = 0; i < n_profiles; i += 1) {
    profiles[i] = profilesParam[i].asInt();
  }

  int startVerticesSize = startVerticesParam.size();
  apiAssert(n_profiles == startVerticesSize, "profiles and start vertices should have equal length.");
  PK_VERTEX_t *start_vertices = new PK_VERTEX_t[n_profiles];
  for (int i = 0; i < n_profiles; i += 1) {
    start_vertices[i] = startVerticesParam[i].asInt();
  }

  int guideWiresParamSize = guideWiresParam.size();
  PK_BODY_t *guide_wires = nullptr;
  if (guideWiresParamSize > 0) {
    guide_wires = new PK_BODY_t[guideWiresParamSize];
    for (int i = 0; i < guideWiresParamSize; i += 1) {
      guide_wires[i] = guideWiresParam[i].asInt();
    }
  }

  PK_BODY_make_lofted_body_o_t options;
  PK_BODY_make_lofted_body_o_m(options);
  options.topology_form = PK_BODY_topology_minimal_c;
  options.n_guide_wires = guideWiresParamSize;
  options.guide_wires = guide_wires;

  PK_BODY_tracked_loft_r_t lofted_body;
  lofted_body.body = PK_ENTITY_null;
  lofted_body.tracking_info.n_track_records = 0;
  lofted_body.tracking_info.track_records = nullptr;

  PK_ERROR_code_t error = PK_BODY_make_lofted_body(n_profiles, profiles, start_vertices, &options, &lofted_body);

  delete[] profiles;
  profiles = nullptr;
  delete[] start_vertices;
  start_vertices = nullptr;

  assertModelingError;
  apiAssert(lofted_body.status.fault == PK_BODY_loft_ok_c, "loft error: " + to_string(lofted_body.status.fault));

  Json::Value returnValue;
  returnValue["body"] = lofted_body.body;

  PK_BODY_tracked_loft_r_f(&lofted_body);

  return returnValue;
}

Json::Value BODY_make_manifold_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_section(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_section_with_surfs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_spun_outline(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_make_swept_body_2(const Json::Value &params) {
  assertParam(profiles);
  assertParam(path);
  assertParam(pathVertices);

  Json::Value profilesParam = params["profiles"];
  Json::Value pathParam = params["path"];
  Json::Value pathVerticesParam = params["pathVertices"];

  int n_profiles = profilesParam.size();
  PK_BODY_t *profiles = new PK_BODY_t[n_profiles];
  for (int i = 0; i < n_profiles; i += 1) {
    profiles[i] = profilesParam[i].asInt();
  }

  PK_BODY_t path = pathParam.asInt();

  int pathVerticesSize = pathVerticesParam.size();
  apiAssert(n_profiles == pathVerticesSize, "profiles and path vertices should have equal length.");
  PK_VERTEX_t *path_vertices = new PK_VERTEX_t[n_profiles];
  for (int i = 0; i < n_profiles; i += 1) {
    path_vertices[i] = pathVerticesParam[i].asInt();
  }

  PK_BODY_make_swept_body_2_o_t options;
  PK_BODY_make_swept_body_2_o_m(options);

  PK_BODY_tracked_sweep_2_r_t swept_body;
  swept_body.body = PK_ENTITY_null;
  swept_body.tracking_info.n_track_records = 0;
  swept_body.tracking_info.track_records = nullptr;

  PK_ERROR_code_t error = PK_BODY_make_swept_body_2(n_profiles, profiles, path, path_vertices, &options, &swept_body);

  delete[] profiles;
  profiles = nullptr;
  delete[] path_vertices;
  path_vertices = nullptr;

  assertModelingError;
  apiAssert(swept_body.status.fault == PK_BODY_sweep_ok_c, "sweep error: " + to_string(swept_body.status.fault));

  Json::Value returnValue;
  returnValue["body"] = swept_body.body;

  PK_BODY_tracked_sweep_2_r_f(&swept_body);

  return returnValue;
}

Json::Value BODY_make_swept_tool(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_offset_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_offset_planar_wire(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_pick_topols(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_remove_from_parents(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_repair_shells(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_reverse_orientation(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_section_with_sheet_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_section_with_surf(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_set_curve_nmnl_state(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_set_type(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_sew_bodies(const Json::Value &params) {
  assertParam(bodies);
  assertParam(gap_width_bound);
  // TODO
  //assertParam(options);

  int n_bodies = params["bodies"].size();
  PK_BODY_t *bodies = new PK_BODY_t[n_bodies];
  for (int i = 0; i < n_bodies; i += 1) {
    bodies[i] = params["bodies"][i].asInt();
  }
  double gap_width_bound = params["gap_width_bound"].asDouble();

  //Json::Value options = params["options"];

  PK_BODY_sew_bodies_o_t options;
  PK_BODY_sew_bodies_o_m(options);

  int n_sewn_bodies = 0;
  PK_BODY_t *sewn_bodies = nullptr;
  int n_unsewn_bodies = 0;
  PK_BODY_t *unsewn_bodies = nullptr;
  int n_problem_groups = 0;
  PK_BODY_problem_group_t *problem_groups = nullptr;

  PK_ERROR_code_t error = PK_BODY_sew_bodies(n_bodies,
                                             bodies,
                                             gap_width_bound,
                                             &options,
                                             &n_sewn_bodies,
                                             &sewn_bodies,
                                             &n_unsewn_bodies,
                                             &unsewn_bodies,
                                             &n_problem_groups,
                                             &problem_groups);

  delete[] bodies;
  bodies = nullptr;

  assertModelingError;

  Json::Value sewnBodyTags(Json::arrayValue);
  for (int i = 0; i < n_sewn_bodies; i += 1) {
    sewnBodyTags.append(sewn_bodies[i]);
  }

  Json::Value unSewnBodyTags(Json::arrayValue);
  for (int i = 0; i < n_unsewn_bodies; i += 1) {
    unSewnBodyTags.append(unsewn_bodies[i]);
  }

  delete[] sewn_bodies;
  sewn_bodies = nullptr;
  delete[] unsewn_bodies;
  unsewn_bodies = nullptr;
  delete[] problem_groups;
  problem_groups = nullptr;

  Json::Value returnValue;
  returnValue["sewn_bodies"] = sewnBodyTags;
  returnValue["unsewn_bodies"] = unSewnBodyTags;
  return returnValue;
}

Json::Value BODY_share_geom(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_simplify_geom(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_spin(const Json::Value &params) {
  assertParam(body);
  assertParam(axis);
  assertParam(angle);

  PK_BODY_t body = params["body"].asInt();
  PK_AXIS1_sf_t axis;
  PK_AXIS1_sf_t_from_JSON(params["axis"], &axis);
  double angle = params["angle"].asDouble();

  PK_LOGICAL_t local_check = PK_LOGICAL_true;

  int n_laterals = 0;
  PK_TOPOL_t *laterals = NULL;
  PK_TOPOL_t *bases = NULL;
  PK_local_check_t result;

  PK_ERROR_code_t error = PK_BODY_spin(body, &axis, angle, local_check, &n_laterals, &laterals, &bases, &result);

  assertModelingError;

  delete[] laterals;
  laterals = nullptr;
  delete[] bases;
  bases = nullptr;

  return Json::nullValue;
}

Json::Value BODY_subtract_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_sweep(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_taper(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_thicken_3(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_transform_2(const Json::Value &params) {
  assertParam(body);
  assertParam(transf);
  PK_BODY_t body = params["body"].asInt();
  PK_TRANSF_t transf = params["transf"].asInt();
  double precision = 1e-6;
  PK_ERROR_code_t error = PK_SESSION_ask_precision(&precision);

  assertModelingError;

  PK_TOPOL_track_r_t tracking;
  PK_TOPOL_local_r_t results;

  PK_BODY_transform_o_t options;
  PK_BODY_transform_o_m(options);

  error = PK_BODY_transform_2(body, transf, precision, &options, &tracking, &results);

  assertModelingError;
  apiAssert(results.status == PK_local_status_ok_c, "transform error: " + to_string(results.status));

  PK_TOPOL_track_r_f(&tracking);
  PK_TOPOL_local_r_f(&results);

  return Json::nullValue;
}

Json::Value BODY_trim(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_trim_gap_analysis(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_trim_neutral_sheets_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BODY_unite_bodies(const Json::Value &params) {
  assertParam(target);
  assertParam(tools);

  PK_BODY_t target = params["target"].asInt();
  int n_tools = params["tools"].size();
  PK_BODY_t *tools = new PK_BODY_t[n_tools];
  for (int i = 0; i < n_tools; i += 1) {
    tools[i] = params["tools"][i].asInt();
  }

  int n_bodies = 0;
  PK_BODY_t *bodies = nullptr;

  PK_ERROR_code_t error = PK_BODY_unite_bodies(target, n_tools, tools, &n_bodies, &bodies);

  delete[] tools;
  tools = nullptr;

  assertModelingError;

  Json::Value bodyTags(Json::arrayValue);
  for (int i = 0; i < n_bodies; i += 1) {
    bodyTags.append(bodies[i]);
  }

  delete[] bodies;
  bodies = nullptr;

  Json::Value returnValue;
  returnValue["bodies"] = bodyTags;
  return returnValue;
}

Json::Value BSURF_add_u_knot(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_add_v_knot(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_ask_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_ask_piecewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_ask_splinewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_clamp_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_create_constrained(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_create_fitted(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_create_piecewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_create_splinewise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_find_g1_discontinuity(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_lower_degree(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_raise_degree(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_remove_knots(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value BSURF_reparameterise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CIRCLE_ask(const Json::Value &params) {
  assertParam(circle);
  PK_CIRCLE_t circle = params["circle"].asInt();

  PK_CIRCLE_sf_t circle_sf;
  PK_ERROR_code_t error = PK_CIRCLE_ask(circle, &circle_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["circle_sf"] = PK_CIRCLE_sf_t_to_JSON(&circle_sf);

  return returnValue;
}

Json::Value CIRCLE_create(const Json::Value &params) {
  assertParam(circle_sf);
  PK_CIRCLE_sf_t circle_sf;
  PK_CIRCLE_sf_t_from_JSON(params["circle_sf"], &circle_sf);

  PK_CIRCLE_t circle = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_CIRCLE_create(&circle_sf, &circle);

  assertModelingError;

  Json::Value returnValue;
  returnValue["circle"] = circle;
  return returnValue;
}

Json::Value CONE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CONE_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CONE_make_solid_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_edges_nmnl(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_fin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_interval(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_param(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_parm_different(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_ask_part(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_convert_parm_to_ki(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_convert_parm_to_pk(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_embed_in_surf_2(const Json::Value &params) {
}

Json::Value CURVE_eval(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_eval_curvature(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_eval_curvature_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_eval_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_eval_with_tan_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_eval_with_tangent(const Json::Value &params) {
  assertParam(curve);
  assertParam(t);
  assertParam(n_derivs);

  PK_CURVE_t curve = params["curve"].asInt();       //--- curve
  double t = params["t"].asDouble();        //--- curve parameter
  int n_derivs = params["n_derivs"].asInt(); //--- number of derivatives

  PK_VECTOR_t *p  = new PK_VECTOR_t[n_derivs + 1];
  PK_VECTOR_t tangent;

  PK_ERROR_code_t error = PK_CURVE_eval_with_tangent(curve, t, n_derivs, p, &tangent);

  assertModelingError;

  Json::Value returnValue;
  Json::Value pointAndDerivatives;
  for (int i = 0; i < n_derivs + 1; ++i) {
    Json::Value v = PK_VECTOR_t_to_JSON(&p[i]);
    pointAndDerivatives.append(v);
  }
  returnValue["pointAndDerivatives"] = pointAndDerivatives;
  returnValue["tangent"] = PK_VECTOR_t_to_JSON(&tangent);
  
  delete[] p;
  return returnValue;
}

Json::Value CURVE_find_degens(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_discontinuity(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_length(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_min_radius(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_non_aligned_box(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_self_int(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_surfs_common(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_vector_interval(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_find_vectors(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_fix_degens(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_fix_self_int(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_intersect_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_is_isoparam(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_approx(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_bcurve_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_curve_reversed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_helical_surf(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_spcurves_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_surf_isocline(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_make_wire_body_2(const Json::Value &params) {
  assertParam(curves);
  assertParam(bounds);
  Json::Value curves = params["curves"];
  Json::Value bounds = params["bounds"];
  int curvesSize = curves.size();
  int boundsSize = bounds.size();
  apiAssert(curvesSize == boundsSize, "curves and bounds should have equal length.");
  PK_CURVE_t *pkCurves = new PK_CURVE_t[curvesSize];
  PK_INTERVAL_t *pkBounds = new PK_INTERVAL_t[curvesSize];

  for (int i = 0; i < curvesSize; i += 1) {
    pkCurves[i] = curves[i].asInt();
    PK_INTERVAL_t_from_JSON(bounds[i], &pkBounds[i]);
  }

  PK_CURVE_make_wire_body_o_t options;
  PK_CURVE_make_wire_body_o_m(options);
  options.want_edges = PK_LOGICAL_true;
  options.want_indices = PK_LOGICAL_true;

  int n_new_edges = 0;
  PK_EDGE_t *new_edges = nullptr;
  int *edge_index = nullptr;

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error =
      PK_CURVE_make_wire_body_2(curvesSize, pkCurves, pkBounds, &options, &body, &n_new_edges, &new_edges, &edge_index);

  delete[] pkCurves;
  pkCurves = nullptr;
  delete[] pkBounds;
  pkBounds = nullptr;

  assertModelingError;

  Json::Value returnValue;

  returnValue["body"] = body;

  Json::Value newEdgeInfoArray(Json::arrayValue);
  for (int i = 0; i < n_new_edges; i += 1) {
    Json::Value newEdgeInfo(Json::objectValue);
    newEdgeInfo["edge"] = new_edges[i];
    newEdgeInfo["edge_index"] = edge_index[i];
    newEdgeInfoArray.append(newEdgeInfo);
  }
  returnValue["new_edges"] = (newEdgeInfoArray);

  delete[] new_edges;
  new_edges = nullptr;
  delete[] edge_index;
  edge_index = nullptr;

  return returnValue;
}

Json::Value CURVE_output_vectors(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_parameterise_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_project(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_spin_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CURVE_sweep(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CYL_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CYL_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value CYL_make_solid_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_body(const Json::Value &params) {
  assertParam(edge);
  PK_EDGE_t edge = params["edge"].asInt();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_EDGE_ask_body(edge, &body);

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value EDGE_ask_convexity(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_curve(const Json::Value &params) {
  assertParam(edge);
  PK_EDGE_t edge = params["edge"].asInt();

  PK_CURVE_t curve = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_EDGE_ask_curve(edge, &curve);

  assertModelingError;

  Json::Value returnValue;
  returnValue["curve"] = curve;
  return returnValue;
}

Json::Value EDGE_ask_curve_nmnl(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_faces(const Json::Value &params) {
  assertParam(edge);
  PK_EDGE_t edge = params["edge"].asInt();

  int n_faces = 0;
  PK_FACE_t *faces = nullptr;
  PK_ERROR_code_t error = PK_EDGE_ask_faces(edge, &n_faces, &faces);

  assertModelingError;

  Json::Value faceTags(Json::arrayValue);
  for (auto i = 0; i < n_faces; i += 1) {
    faceTags.append(faces[i]);
  }

  delete[] faces;
  faces = nullptr;

  Json::Value returnValue;
  returnValue["faces"] = faceTags;
  return returnValue;
}

Json::Value EDGE_ask_fins(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_first_fin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_geometry(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_geometry_nmnl(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_next_in_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_oriented_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_precision(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_shells(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_type(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_ask_vertices(const Json::Value &params) {
  assertParam(edge);
  PK_EDGE_t edge = params["edge"].asInt();

  PK_VERTEX_t vertices[2] = {PK_ENTITY_null, PK_ENTITY_null};
  PK_ERROR_code_t error = PK_EDGE_ask_vertices(edge, vertices);

  assertModelingError;

  Json::Value vertexTags(Json::arrayValue);
  vertexTags.append(vertices[0]);
  vertexTags.append(vertices[1]);

  Json::Value returnValue;
  returnValue["vertices"] = vertexTags;
  return returnValue;
}

Json::Value EDGE_attach_curve_nmnl(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_attach_curves_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_check(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_contains_vector(const Json::Value &params) {
  assertParam(edge);
  assertParam(vector);
  PK_EDGE_t edge = params["edge"].asInt();

  Json::Value vectorValue = params["vector"];
  //PK_bound_t boundType = options["boundType");
  PK_VECTOR1_t vector;
  PK_VECTOR_t_from_JSON(vectorValue, &vector);

  PK_TOPOL_t topol = PK_ENTITY_null;

  PK_ERROR_code_t error = PK_EDGE_contains_vector(edge, vector, &topol);

  assertModelingError;

  Json::Value returnValue;
  returnValue["topol"] = topol;
  return returnValue;
}

Json::Value EDGE_delete(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_delete_wireframe(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_detach_curve_nmnl(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_find_deviation_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_find_end_tangents(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_find_extreme(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_find_g1_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_find_interval(const Json::Value &params) {
  assertParam(edge);
  PK_EDGE_t edge = params["edge"].asInt();

  PK_INTERVAL_t t_int;
  PK_ERROR_code_t error = PK_EDGE_find_interval(edge, &t_int);

  assertModelingError;
  Json::Value interval = PK_INTERVAL_t_to_JSON(&t_int);
  Json::Value returnValue;
  returnValue["interval"] = interval;
  return returnValue;
}

Json::Value EDGE_imprint_point(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_is_planar(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_is_smooth(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_make_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_make_faces_from_wire(const Json::Value &params) {
  assertParam(edges);
  assertParam(senses);
  assertParam(shared_loop);

  Json::Value edgeValues = params["edges"];
  Json::Value sensesValues = params["senses"];
  Json::Value shared_loopValues = params["shared_loop"];
  //TODO: validate the arguments

  int n_edges = edgeValues.size(); //      --- number of edges
  PK_EDGE_t *edges = new PK_EDGE_t[n_edges]; //          --- initial wireframe edges
  PK_LOGICAL_t *senses = new PK_LOGICAL_t[n_edges]; //          --- senses of initial fins
  int *shared_loop = new int[n_edges]; //     --- mapping from loops to newFaces

  for (int i = 0; i < n_edges; i += 1) {
    edges[i] = edgeValues[i].asInt();
    senses[i] = sensesValues[i].asBool();
    int tmp = shared_loopValues[i].asInt();
    shared_loop[i] = shared_loopValues[i].asInt();
  }

  //--- returned arguments ---
  PK_FACE_t *new_faces = new PK_FACE_t[n_edges];

  PK_ERROR_code_t error = PK_EDGE_make_faces_from_wire(n_edges, edges, senses, shared_loop, new_faces);

  delete[] edges;
  edges = nullptr;
  delete[] senses;
  senses = nullptr;
  delete[] shared_loop;
  shared_loop = nullptr;

  assertModelingError;

  Json::Value newFaces(Json::arrayValue);
  for (int i = 0; i < n_edges; i += 1) {
    newFaces.append(new_faces[i]);
  }
  delete[] new_faces;
  new_faces = nullptr;

  Json::Value returnValue;
  returnValue["new_faces"] = newFaces;
  return returnValue;
}

Json::Value EDGE_make_wire_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_offset_on_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_optimise(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_propagate_orientation(const Json::Value &params) {
  Json::Value edgeParam = params["edge"];
  PK_EDGE_t edge = edgeParam.asInt();

  PK_ERROR_code_t error = PK_EDGE_propagate_orientation(edge);

  assertModelingError;

  return Json::nullValue;
}

Json::Value EDGE_remove_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_remove_to_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_repair(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_reset_precision_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_reverse_2(const Json::Value &params) {
  assertParam(edges);
  Json::Value edgesParam = params["edges"];
  int n_edges = edgesParam.size();
  PK_EDGE_t *edges = new PK_EDGE_t[n_edges];
  for (int i = 0; i < n_edges; i += 1) {
    edges[i] = edgesParam[i].asInt();
  }

  PK_EDGE_reverse_2_o_t options;
  PK_EDGE_reverse_2_o_m (options);

  PK_ERROR_code_t error = PK_EDGE_reverse_2(n_edges, edges, &options);

  delete[] edges;
  edges = nullptr;

  assertModelingError;

  return Json::nullValue;
}

Json::Value EDGE_set_blend_chamfer(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_set_blend_constant(const Json::Value &params) {
  assertParam(edges);
  assertParam(radius);
  Json::Value edgeArray = params["edges"];
  int n_edges = edgeArray.size();
  PK_EDGE_t *edges = new PK_EDGE_t[n_edges];
  for (int i = 0; i < n_edges; i += 1) {
    edges[i] = edgeArray[i].asInt();
  }

  double radius = params["radius"].asDouble();

  PK_EDGE_set_blend_constant_o_t sboptions;
  PK_EDGE_set_blend_constant_o_m(sboptions);
  int n_blend_edges = 0;
  PK_EDGE_t *blend_edges = nullptr;

  PK_ERROR_code_t error = PK_EDGE_set_blend_constant(n_edges, edges, radius, &sboptions, &n_blend_edges, &blend_edges);

  delete[] edges;
  edges = nullptr;

  assertModelingError;

  Json::Value blendEdgeArray(Json::arrayValue);
  for (int i = 0; i < n_blend_edges; i += 1) {
    blendEdgeArray.append(blend_edges[i]);
  }

  delete[] blend_edges;
  blend_edges = nullptr;

  Json::Value returnValue;
  returnValue["blend_edges"] = blendEdgeArray;
  return returnValue;
}

Json::Value EDGE_set_blend_variable(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_set_precision_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value EDGE_split_at_param(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ELLIPSE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ELLIPSE_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_attribs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_class(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_CLASS_t cls = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_ENTITY_ask_class(entity, &cls);

  assertModelingError;

  Json::Value returnValue;
  returnValue["cls"] = cls;
  return returnValue;
}

Json::Value ENTITY_ask_description(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_first_attrib(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_identifier(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  int identifier = 0;
  PK_ERROR_code_t error = PK_ENTITY_ask_identifier(entity, &identifier);

  assertModelingError;

  Json::Value returnValue;
  returnValue["identifier"] = identifier;
  return returnValue;
}

Json::Value ENTITY_ask_owning_groups(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_partition(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_ask_user_field(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_check_attribs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_copy_2(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_ENTITY_copy_o_t options; //     --- options structure
  //--- returned arguments ---
  PK_ENTITY_t entity_copy = PK_ENTITY_null; //--- copy of given entity
  PK_ENTITY_track_r_t tracking; //     --- tracking information
  PK_ENTITY_copy_o_m(options);
  PK_ERROR_code_t error = PK_ENTITY_copy_2(entity, &options, &entity_copy, &tracking);

  assertModelingError;
  PK_ENTITY_track_r_f(&tracking);

  Json::Value returnValue;
  returnValue["entity_copy"] = entity_copy;
  return returnValue;
}

Json::Value ENTITY_delete(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();
  PK_ENTITY_t *entities = new PK_ENTITY_t[1];
  entities[0] = entity;

  PK_ERROR_code_t error = PK_ENTITY_delete(1, entities);

  delete[] entities;
  entities = nullptr;

  assertModelingError;

  return Json::nullValue;
}

Json::Value ENTITY_delete_attribs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_is(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value ENTITY_is_curve(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_LOGICAL_t is_curve = PK_LOGICAL_false;
  PK_ERROR_code_t error = PK_ENTITY_is_curve(entity, &is_curve);

  assertModelingError;

  Json::Value returnValue;
  returnValue["is_curve"] = is_curve;
  return returnValue;
}

Json::Value ENTITY_is_geom(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_LOGICAL_t is_geom = PK_LOGICAL_false;
  PK_ERROR_code_t error = PK_ENTITY_is_geom(entity, &is_geom);

  assertModelingError;

  Json::Value returnValue;
  returnValue["is_geom"] = is_geom;
  return returnValue;
}

Json::Value ENTITY_is_part(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_LOGICAL_t is_part = PK_LOGICAL_false;
  PK_ERROR_code_t error = PK_ENTITY_is_part(entity, &is_part);

  assertModelingError;

  Json::Value returnValue;
  returnValue["is_part"] = is_part;
  return returnValue;
}

Json::Value ENTITY_is_surf(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_LOGICAL_t is_surf = PK_LOGICAL_false;
  PK_ERROR_code_t error = PK_ENTITY_is_part(entity, &is_surf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["is_surf"] = is_surf;
  return returnValue;
}

Json::Value ENTITY_is_topol(const Json::Value &params) {
  assertParam(entity);
  PK_ENTITY_t entity = params["entity"].asInt();

  PK_LOGICAL_t is_topol = PK_LOGICAL_false;
  PK_ERROR_code_t error = PK_ENTITY_is_topol(entity, &is_topol);

  assertModelingError;

  Json::Value returnValue;
  returnValue["is_topol"] = is_topol;
  return returnValue;
}

Json::Value FACE_ask_body(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_FACE_ask_body(face, &body);

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value FACE_ask_edges(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  int n_edges = 0;
  PK_VERTEX_t *edges = nullptr;
  PK_ERROR_code_t error = PK_FACE_ask_edges(face, &n_edges, &edges);

  assertModelingError;

  Json::Value edgeTags(Json::arrayValue);
  for (auto i = 0; i < n_edges; i += 1) {
    edgeTags.append(edges[i]);
  }

  delete[] edges;
  edges = nullptr;

  Json::Value returnValue;
  returnValue["edges"] = edgeTags;
  return returnValue;
}

Json::Value FACE_ask_faces_adjacent(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_ask_first_loop(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_ask_loops(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_ask_next_in_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_ask_oriented_surf(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  PK_LOGICAL_t orientation = PK_LOGICAL_true;
  PK_SURF_t srf = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_FACE_ask_oriented_surf(face, &srf, &orientation);

  assertModelingError;

  Json::Value returnValue;
  returnValue["srf"] = srf;
  returnValue["orientation"] = orientation;
  return returnValue;
}

Json::Value FACE_ask_shells(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_ask_surf(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  PK_SURF_t srf = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_FACE_ask_surf(face, &srf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["srf"] = srf;
  return returnValue;
}

Json::Value FACE_ask_vertices(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  int n_vertices = 0;
  PK_VERTEX_t *vertices = nullptr;
  PK_ERROR_code_t error = PK_FACE_ask_vertices(face, &n_vertices, &vertices);

  assertModelingError;

  Json::Value vertexTags;
  for (auto i = 0; i < n_vertices; i += 1) {
    vertexTags.append(vertices[i]);
  }

  delete[] vertices;
  vertices = nullptr;

  Json::Value returnValue;
  returnValue["vertices"] = vertexTags;
  return returnValue;
}

Json::Value FACE_attach_surf_fitting(const Json::Value &params) {
  assertParam(face);
  assertParam(local_check);
  PK_FACE_t face = params["face"].asInt();
  bool local_check = params["local_check"].asBool();

  PK_local_check_t local_check_result;
  PK_ERROR_code_t error = PK_FACE_attach_surf_fitting(face, local_check, &local_check_result);

  assertModelingError;

  return Json::nullValue;
}

Json::Value FACE_attach_surfs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_boolean_2(const Json::Value &params) {
  assertParam(targets);
  assertParam(tools);
  //assertParam(options);
  assertParam(func);

  int n_targets = params["targets"].size();
  PK_FACE_t *targets = new PK_FACE_t[n_targets];
  for (int i = 0; i < n_targets; i += 1) {
    targets[i] = params["targets"][i].asInt();
  }

  int n_tools = params["tools"].size();
  PK_FACE_t *tools = new PK_FACE_t[n_tools];
  for (int i = 0; i < n_tools; i += 1) {
    tools[i] = params["tools"][i].asInt();
  }

  //Json::Value options = params["options"];
  int func = params["func"].asInt();

  PK_FACE_boolean_o_t options;
  PK_FACE_boolean_o_m(options);
  options.function = func;
  PK_boolean_match_o_t boolmatch;
  PK_boolean_match_o_m(boolmatch);
  boolmatch.match_style = PK_boolean_match_style_auto_c;
  options.matched_region = &boolmatch;
  options.merge_imprinted = PK_LOGICAL_true;
  options.selective_merge = PK_LOGICAL_true;

  PK_TOPOL_track_r_t tracking;
  PK_boolean_r_t results;
  PK_ERROR_code_t error = PK_FACE_boolean_2(n_targets, targets, n_tools, tools, &options, &tracking, &results);

  delete[] targets;
  targets = nullptr;

  delete[] tools;
  tools = nullptr;

  assertModelingError;

  apiAssert(results.result != PK_boolean_result_failed_c, "Boolean error: " + to_string(results.result));

  Json::Value bodyTags(Json::arrayValue);
  for (int i = 0; i < results.n_bodies; i += 1) {
    bodyTags.append(results.bodies[i]);
  }

  PK_TOPOL_track_r_f(&tracking);
  PK_boolean_r_f(&results);

  Json::Value returnValue;
  returnValue["bodies"] = bodyTags;
  return returnValue;
}

Json::Value FACE_change(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_check(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_check_pair(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_classify_details(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_close_gaps(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_contains_vectors(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_cover(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_delete_2(const Json::Value &params) {
  assertParam(faces);

  Json::Value faceArray = params["faces"];
  int n_faces = faceArray.size();
  PK_FACE_t *faces = new PK_FACE_t[n_faces];
  for (int i = 0; i < faceArray.size(); i += 1) {
    faces[i] = faceArray[i].asInt();
  }

  PK_FACE_delete_o_t options;
  PK_FACE_delete_o_m(options);
  PK_TOPOL_track_r_t tracking;

  PK_ERROR_code_t error = PK_FACE_delete_2(n_faces, faces, &options, &tracking);

  delete[] faces;
  faces = nullptr;

  assertModelingError;

  PK_TOPOL_track_r_f(&tracking);

  return Json::nullValue;
}

Json::Value FACE_delete_blends(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_delete_facesets(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_delete_from_gen_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_delete_from_sheet(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_emboss(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_euler_make_loop(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_euler_make_ring_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_euler_make_ring_loop(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_euler_unslit(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_blend_unders(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_edges_common(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_extreme(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_interior_vec(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_outer_loop(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_find_uvbox(const Json::Value &params) {
  assertParam(face);
  PK_FACE_t face = params["face"].asInt();

  PK_UVBOX_t uvbox;
  PK_ERROR_code_t error = PK_FACE_find_uvbox(face, &uvbox);

  assertModelingError;

  Json::Value returnValue;
  returnValue["uvbox"] = PK_UVBOX_t_to_JSON(&uvbox);
  return returnValue;
}

Json::Value FACE_hollow_3(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_identify_blends(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_imprint_curves_2(const Json::Value &params) {
  assertParam(face);
  assertParam(curves);
  assertParam(intervals);
  Json::Value faceParam = params["face"];
  Json::Value curvesParam = params["curves"];
  Json::Value intervalsParam = params["intervals"];

  PK_FACE_t face = faceParam.asInt();
  int n_curves = curvesParam.size();
  apiAssert(n_curves == intervalsParam.size(), "curves and intervals should have equal length");

  PK_CURVE_t *curves = new PK_CURVE_t[n_curves];
  PK_INTERVAL_t *intervals = new PK_INTERVAL_t[n_curves];
  for (int i = 0; i < n_curves; i += 1) {
    curves[i] = curvesParam[i].asInt();
    PK_INTERVAL_t_from_JSON(intervalsParam[i], &intervals[i]);
  }

  PK_FACE_imprint_curves_o_t options;
  PK_FACE_imprint_curves_o_m(options);

  PK_ENTITY_track_r_t tracking;

  PK_ERROR_code_t error = PK_FACE_imprint_curves_2(face, n_curves, curves, intervals, &options, &tracking);

  delete[] curves;
  curves = nullptr;
  delete[] intervals;
  intervals = nullptr;

  assertModelingError;

  PK_ENTITY_track_r_f(&tracking);

  return Json::nullValue;
}

Json::Value FACE_imprint_cus_isoclin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_imprint_faces_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_imprint_point(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_instance_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_instance_tools(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_intersect_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_intersect_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_intersect_surf(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_is_coincident(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_is_periodic(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_is_uvbox(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_3_face_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_neutral_sheet_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_sect_with_sfs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_sheet_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_make_solid_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_offset_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_output_surf_trimmed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_pattern(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_remove_to_solid_bodies(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_repair(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_replace_surfs_3(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_replace_with_sheet(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_reverse(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_section_with_sheet_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_set_approx(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_simplify_geom(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_spin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_split_at_param(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_sweep(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_taper(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FACE_transform_2(const Json::Value &params) {
  assertParam(faces);
  assertParam(transfs);
  assertParam(tolerance);

  Json::Value faceArray = params["faces"];
  int n_faces = faceArray.size();
  PK_FACE_t *faces = new PK_FACE_t[n_faces];
  for (int i = 0; i < faceArray.size(); i += 1) {
    faces[i] = faceArray[i].asInt();
  }

  Json::Value transfArray = params["transfs"];
  int n_transfs = transfArray.size();
  PK_TRANSF_t *transfs = new PK_TRANSF_t[n_faces];
  for (int i = 0; i < transfArray.size(); i += 1) {
    transfs[i] = transfArray[i].asInt();
  }

  double tolerance = params["tolerance"].asDouble();

  PK_FACE_transform_o_t options;
  PK_FACE_transform_o_m(options);
  PK_TOPOL_track_r_t tracking;
  PK_TOPOL_local_r_t results;

  PK_ERROR_code_t error = PK_FACE_transform_2(n_faces, faces, transfs, tolerance, &options, &tracking, &results);

  delete[] faces;
  faces = nullptr;
  delete[] transfs;
  transfs = nullptr;

  assertModelingError;

  PK_TOPOL_track_r_f(&tracking);
  PK_TOPOL_local_r_f(&results);

  return Json::nullValue;
}

Json::Value FACE_unset_approx(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FCURVE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FCURVE_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FSURF_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value FSURF_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_ask_dependents(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_ask_geom_owners(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_check(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_copy(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_delete_single(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_is_coincident(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_array(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_array_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_local(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_local_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_range_vector_many(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_render_line(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value GEOM_transform_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value INSTANCE_ask(const Json::Value &params) {
  assertParam(instance);
  PK_INSTANCE_t instance = params["instance"].asInt();
  PK_INSTANCE_sf_t instance_sf;
  PK_ERROR_code_t error = PK_INSTANCE_ask(instance, &instance_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["instance_sf"] = PK_INSTANCE_sf_t_to_JSON(&instance_sf);
  return returnValue;
}

Json::Value INSTANCE_change_part(const Json::Value &params) {
  assertParam(instance);
  assertParam(part);
  PK_INSTANCE_t instance = params["instance"].asInt();
  PK_INSTANCE_t part = params["part"].asInt();

  PK_ERROR_code_t error = PK_INSTANCE_change_part(instance, part);

  assertModelingError;

  return Json::nullValue;
}

Json::Value INSTANCE_create(const Json::Value &params) {
  assertParam(instance_sf);
  PK_INSTANCE_sf_t instance_sf;
  PK_INSTANCE_sf_t_from_JSON(params["instance_sf"], &instance_sf);

  PK_INSTANCE_t instance = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_INSTANCE_create(&instance_sf, &instance);

  assertModelingError;

  Json::Value returnValue;
  returnValue["instance"] = instance;
  return returnValue;
}

Json::Value INSTANCE_replace_transf(const Json::Value &params) {
  assertParam(instance);
  assertParam(transf);
  PK_INSTANCE_t instance = params["instance"].asInt();
  PK_TRANSF_t transf = params["transf"].asInt();

  PK_ERROR_code_t error = PK_INSTANCE_replace_transf(instance, transf);

  assertModelingError;

  return Json::nullValue;
}

Json::Value INSTANCE_transform(const Json::Value &params) {
  assertParam(instance);
  assertParam(transf);
  PK_INSTANCE_t instance = params["instance"].asInt();
  PK_TRANSF_t transf = params["transf"].asInt();

  PK_ERROR_code_t error = PK_INSTANCE_transform(instance, transf);

  assertModelingError;

  return Json::nullValue;
}

Json::Value LINE_ask(const Json::Value &params) {
  assertParam(line);
  PK_LINE_t line = params["line"].asInt();

  PK_LINE_sf_t line_sf;
  PK_ERROR_code_t error = PK_LINE_ask(line, &line_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["line_sf"] = PK_LINE_sf_t_to_JSON(&line_sf);
  return returnValue;
}

Json::Value LINE_create(const Json::Value &params) {
  assertParam(line_sf);
  PK_LINE_sf_t line_sf;
  PK_LINE_sf_t_from_JSON(params["line_sf"], &line_sf);

  PK_LINE_t line = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_LINE_create(&line_sf, &line);

  assertModelingError;

  Json::Value returnValue;
  returnValue["line"] = line;
  return returnValue;
}

Json::Value LOOP_ask_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_first_fin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_next_in_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_type(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_ask_vertices(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_close_gaps(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_delete_from_sheet_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_create_edge(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_delete_isolated(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_delete_make_edge(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_make_edge(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_make_edge_face(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_make_edge_loop(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_euler_transfer(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value LOOP_is_isolated(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value OFFSET_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value OFFSET_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_add_geoms(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_all_attdefs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_all_attribs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_attribs_cb(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_construction_curves(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_construction_points(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_construction_surfs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_geoms(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_groups(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_ask_ref_instances(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_delete_attribs(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_find_entity_by_ident(const Json::Value &params) {
  assertParam(part);
  assertParam(class);
  assertParam(identifier);
  PK_PART_t part = params["part"].asInt();
  PK_CLASS_t cls = params["class"].asInt();
  int identifier = params["identifier"].asInt();

  PK_ENTITY_t entity = PK_ENTITY_null;

  PK_ERROR_code_t error = PK_PART_find_entity_by_ident(part, cls, identifier, &entity);

  assertModelingError;

  Json::Value returnValue;
  returnValue["entity"] = entity;
  return returnValue;
}

Json::Value PART_receive(const Json::Value &params) {
  assertParam(key);
  string key = params["key"].asString();

  PK_PART_receive_o_t options;
  PK_PART_receive_o_m(options);
  options.transmit_format = PK_transmit_format_text_c;

  int n_parts = 0;
  PK_PART_t *parts = nullptr;

  PK_ERROR_code_t error = PK_PART_receive(key.c_str(), &options, &n_parts, &parts);

  assertModelingError;

  Json::Value partTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    partTags.append(parts[i]);
  }

  delete[] parts;
  parts = nullptr;

  Json::Value returnValue;
  returnValue["parts"] = partTags;
  return returnValue;
}

Json::Value PART_receive_b(const Json::Value &params) {
  assertParam(data);
  string data = params["data"].asString();
  string decoded = base64_decode(data);

  PK_PART_receive_o_t options;
  PK_PART_receive_o_m(options);
  options.transmit_format = PK_transmit_format_text_c;

  int n_parts = 0;
  PK_PART_t *parts = nullptr;

  PK_MEMORY_block_t memblock;
  memblock.next = nullptr;
  memblock.n_bytes = decoded.size();
  memblock.bytes = decoded.data();

  PK_ERROR_code_t error = PK_PART_receive_b(memblock, &options, &n_parts, &parts);

  assertModelingError;

  Json::Value partTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    partTags.append(parts[i]);
  }

  delete[] parts;
  parts = nullptr;

  Json::Value returnValue;
  returnValue["parts"] = partTags;
  return returnValue;
}

Json::Value PART_receive_u(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_receive_version(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_receive_version_b(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_receive_version_u(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_rectify_identifiers(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_remove_geoms(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PART_transmit(const Json::Value &params) {
  assertParam(parts);
  assertParam(key);

  Json::Value partArray = params["parts"];
  int n_parts = partArray.size();
  PK_PART_t *parts = new PK_PART_t[n_parts];
  for (int i = 0; i < n_parts; i += 1) {
    parts[i] = partArray[i].asInt();
  }

  string key = params["key"].asString();

  PK_PART_transmit_o_t options;
  PK_PART_transmit_o_m(options);
  options.transmit_format = PK_transmit_format_text_c;

  PK_ERROR_code_t error = PK_PART_transmit(n_parts, parts, key.c_str(), &options);

  delete[] parts;
  parts = nullptr;

  assertModelingError;

  return Json::nullValue;
}

Json::Value PART_transmit_b(const Json::Value &params) {
  assertParam(parts);
  Json::Value partArray = params["parts"];
  int n_parts = partArray.size();
  PK_PART_t *parts = new PK_PART_t[n_parts];
  for (int i = 0; i < n_parts; i += 1) {
    parts[i] = partArray[i].asInt();
  }

  PK_MEMORY_block_t memblock;
  memblock.next = NULL;
  memblock.bytes = NULL;
  memblock.n_bytes = 0;

  PK_PART_transmit_o_t options;
  PK_PART_transmit_o_m(options);
  options.transmit_format = PK_transmit_format_text_c;

  PK_ERROR_code_t error = PK_PART_transmit_b(n_parts, parts, &options, &memblock);

  delete[] parts;
  parts = nullptr;

  assertModelingError;

  string base64_encoded_data = base64_encode(reinterpret_cast<const unsigned char *>(memblock.bytes), memblock.n_bytes);

  // Free the memory held by memblock
  PK_MEMORY_block_f(&memblock);

  Json::Value returnValue;
  returnValue["base64_encoded_data"] = base64_encoded_data;
  return returnValue;
}

Json::Value PART_transmit_u(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value PLANE_ask(const Json::Value &params) {
  assertParam(plane);
  PK_PLANE_t plane = params["plane"].asInt();

  PK_PLANE_sf_t plane_sf;
  PK_ERROR_code_t error = PK_PLANE_ask(plane, &plane_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["plane_sf"] = PK_PLANE_sf_t_to_JSON(&plane_sf);
  return returnValue;
}

Json::Value PLANE_create(const Json::Value &params) {
  assertParam(plane_sf);
  PK_PLANE_sf_t plane_sf;
  PK_PLANE_sf_t_from_JSON(params["plane_sf"], &plane_sf);

  PK_PLANE_t plane = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_PLANE_create(&plane_sf, &plane);

  assertModelingError;

  Json::Value returnValue;
  returnValue["plane"] = plane;
  return returnValue;
}

Json::Value POINT_ask(const Json::Value &params) {
  assertParam(point);
  PK_POINT_t point = params["point"].asInt();

  PK_POINT_sf_t point_sf;
  PK_ERROR_code_t error = PK_POINT_ask(point, &point_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["point_sf"] = PK_POINT_sf_t_to_JSON(&point_sf);
  return returnValue;
}

Json::Value POINT_ask_part(const Json::Value &params) {
  assertParam(point);
  PK_POINT_t point = params["point"].asInt();

  PK_PART_t part = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_POINT_ask_part(point, &part);

  assertModelingError;

  Json::Value returnValue;
  returnValue["part"] = part;
  return returnValue;
}

Json::Value POINT_ask_vertex(const Json::Value &params) {
  assertParam(point);
  PK_POINT_t point = params["point"].asInt();

  PK_VERTEX_t vertex = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_EDGE_ask_body(point, &vertex);

  assertModelingError;

  Json::Value returnValue;
  returnValue["vertex"] = vertex;
  return returnValue;
}

Json::Value POINT_create(const Json::Value &params) {
  assertParam(point_sf);
  PK_POINT_sf_t point_sf;
  PK_POINT_sf_t_from_JSON(params["point_sf"], &point_sf);

  PK_POINT_t point = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_POINT_create(&point_sf, &point);

  assertModelingError;

  Json::Value returnValue;
  returnValue["point"] = point;
  return returnValue;
}

Json::Value POINT_make_helical_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value POINT_make_minimum_body(const Json::Value &params) {
  assertParam(point);
  PK_POINT_t point = params["point"].asInt();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_POINT_make_minimum_body(point, &body);

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value SESSION_ask_parts(const Json::Value &params) {
  int n_parts = 0; //          --- number of parts (>= 0)
  PK_PART_t *parts = NULL; //             --- parts (optional)
  PK_ERROR_code_t error = PK_SESSION_ask_parts(&n_parts, &parts);

  assertModelingError;

  Json::Value partTags(Json::arrayValue);
  for (int i = 0; i < n_parts; i += 1) {
    partTags.append(parts[i]);
  }
  PK_MEMORY_free(parts);

  Json::Value returnValue;
  returnValue["parts"] = partTags;
  return returnValue;
}

Json::Value SHELL_ask_acorn_vertex(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_ask_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_ask_oriented_faces(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_ask_region(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_ask_type(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_ask_wireframe_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SHELL_find_sign(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SPCURVE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SPCURVE_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SPHERE_ask(const Json::Value &params) {
  assertParam(sphere);
  PK_SPHERE_t sphere = params["sphere"].asInt();

  PK_SPHERE_sf_t sphere_sf;
  PK_ERROR_code_t error = PK_SPHERE_ask(sphere, &sphere_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["sphere_sf"] = PK_SPHERE_sf_t_to_JSON(&sphere_sf);
  return returnValue;
}

Json::Value SPHERE_create(const Json::Value &params) {
  assertParam(sphere_sf);
  PK_SPHERE_sf_t sphere_sf;
  PK_SPHERE_sf_t_from_JSON(params["sphere_sf"], &sphere_sf);

  PK_SPHERE_t sphere = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_SPHERE_create(&sphere_sf, &sphere);

  assertModelingError;

  Json::Value returnValue;
  returnValue["sphere"] = sphere;
  return returnValue;
}

Json::Value SPHERE_make_solid_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SPUN_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SPUN_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_ask_faces(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_ask_params(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_ask_part(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_ask_uvbox(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_create_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval(const Json::Value &params) {
  assertParam(surf);
  assertParam(uv);
  assertParam(n_u_derivs);
  assertParam(n_v_derivs);
  assertParam(triangular);

  PK_SURF_t surf = params["surf"].asInt();       //--- surface
  PK_UV_t uv;         //--- u and v parameter pair
  PK_UV_t_from_JSON(params["uv"], &uv);
  int n_u_derivs = params["n_u_derivs"].asInt(); //--- number of u derivatives
  int n_v_derivs = params["n_v_derivs"].asInt(); //--- number of v derivatives
  PK_LOGICAL_t triangular = params["surf"].asBool(); //--- triangular derivative array required

  //TODO: we only support 0 derivs! Otherwise this API is difficult to use.
  apiAssert(0 == n_u_derivs, "TODO: we only support 0 derivs");
  apiAssert(0 == n_v_derivs, "TODO: we only support 0 derivs");
  PK_VECTOR_t p[1];
  PK_ERROR_code_t error = PK_SURF_eval(surf, uv, 0, 0, PK_LOGICAL_false, p);

  assertModelingError;

  //TODO: we only return the point, there is no derivs!
  Json::Value returnValue;
  returnValue["position"] = PK_VECTOR_t_to_JSON(p);
  return returnValue;
}

Json::Value SURF_eval_curvature(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval_curvature_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval_grid(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval_with_normal(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_eval_with_normal_handed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_extend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_curves_common(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_degens(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_discontinuity(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_min_radii(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_non_aligned_box(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_find_self_int(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_fix_degens(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_fix_self_int(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_intersect_curve(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_intersect_surf(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_make_bsurf_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_make_curve_isoparam(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_make_cus_isocline(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_make_sheet_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_make_sheet_trimmed(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_offset(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SURF_parameterise_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SWEPT_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value SWEPT_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_ask_entities_by_attdef(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_clash(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_delete_redundant_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_detach_geom(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_eval_mass_props(const Json::Value &params) {
  //TODO: FIXME. This implementation may not be right!!
  //TODO: the option argument
  assertParam(topols);
  assertParam(accuracy);

  Json::Value topolData = params["topols"];
  int n_topols = topolData.size(); //   --- number of topols ( >0 )
  PK_TOPOL_t *topols = new PK_TOPOL_t[n_topols]; //    --- topological entities array
  for (int i = 0; i < n_topols; i += 1) {
    topols[i] = topolData[i].asInt();
  }

  double accuracy = params["accuracy"].asDouble();//    --- 0.0 <= accuracy <= 1.0
  PK_TOPOL_eval_mass_props_o_t mass_opts;
  PK_TOPOL_eval_mass_props_o_m(mass_opts);
  mass_opts.mass = PK_mass_c_of_g_c;

  // --- returned arguments ---
  double amount[3], mass[3], c_of_g[3], m_of_i[3], periphery[3];
  PK_ERROR_code_t
      error = PK_TOPOL_eval_mass_props(n_topols, topols, 1, &mass_opts, amount, mass, c_of_g, m_of_i, periphery);

  assertModelingError;

  Json::Value returnValue;

  Json::Value amountValues(Json::arrayValue);
  for (int i = 0; i < 1; i += 1) {
    amountValues.append(amount[i]);
  }
  returnValue["amount"] = amountValues;

  Json::Value massValues(Json::arrayValue);
  for (int i = 0; i < 1; i += 1) {
    massValues.append(mass[i]);
  }
  returnValue["mass"] = massValues;

  Json::Value cogValues(Json::arrayValue);
  for (int i = 0; i < 3; i += 1) {
    cogValues.append(c_of_g[i]);
  }
  returnValue["c_of_g"] = cogValues;

  Json::Value moiValues(Json::arrayValue);
  for (int i = 0; i < 1; i += 1) {
    moiValues.append(m_of_i[i]);
  }
  returnValue["m_of_i"] = moiValues;

  Json::Value peripheryValues(Json::arrayValue);
  for (int i = 0; i < 1; i += 1) {
    peripheryValues.append(periphery[i]);
  }
  returnValue["periphery"] = peripheryValues;

  return returnValue;
}

Json::Value TOPOL_facet_2(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_find_box(const Json::Value &params) {
  assertParam(topol);
  PK_TOPOL_t topol = params["topol"].asInt();

  PK_BOX_t uvbox;
  PK_ERROR_code_t error = PK_TOPOL_find_box(topol, &uvbox);

  assertModelingError;

  Json::Value returnValue;
  returnValue["uvbox"] = PK_BOX_t_to_JSON(&uvbox);
  return returnValue;
}

Json::Value TOPOL_find_nabox(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_identify_redundant(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_make_general_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_make_new(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_array(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_array_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_geom(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_geom_array(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_local(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_local_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_range_vector(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_remove_body_component(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TOPOL_render_facet(const Json::Value &params) {
  assertParam(topol);
  PK_TOPOL_t topol = params["topol"].asInt();
  string resolution = params["resolution"].asString();

  double tolerance = 1 / 1000.0;
  if (resolution == "low") {
    tolerance = 10.0 / 1000.0;
  }

  PKSession::resetGraphicsOutputObj();

  int bodies[] = {topol};
  PK_TOPOL_render_facet_o_s foptions;
  PK_TOPOL_facet_mesh_o_m(foptions.control);
  PK_TOPOL_render_facet_go_o_m(foptions.go_option);

  foptions.control.is_surface_plane_tol = PK_LOGICAL_true;
  foptions.control.surface_plane_tol = tolerance;
  foptions.control.is_curve_chord_tol = PK_LOGICAL_true;
  foptions.control.curve_chord_tol = tolerance;
  foptions.go_option.go_normals = PK_facet_go_normals_yes_c;
  foptions.go_option.go_parameters = PK_facet_go_parameters_d0_c;
  foptions.go_option.go_strips = PK_facet_go_strips_yes_c;
  foptions.go_option.go_max_facets_per_strip = 60000;
  foptions.go_option.split_strips = PK_facet_split_strip_no_c;
  foptions.go_option.go_interleaved = PK_facet_go_interleaved_no_c;

  PK_ERROR_code_t error = PK_TOPOL_render_facet(1, bodies, NULL, PK_ENTITY_null, &foptions);

  assertModelingError;

  Json::Value returnValue;
  returnValue["graphics"] = *PKSession::getGraphicsOutputObj();
  return returnValue;
}

Json::Value TOPOL_render_line(const Json::Value &params) {
  assertParam(topol);
  assertParam(resolution);

  PK_TOPOL_t topol = params["topol"].asInt();
  string resolution = params["resolution"].asString();

  double tolerance = 1 / 1000.0;
  if (resolution == "low") {
    tolerance = 10.0 / 1000.0;
  }
  PKSession::resetGraphicsOutputObj();

  int bodies[] = {topol};
  PK_TOPOL_render_line_o_s loptions;
  PK_TOPOL_render_line_o_m(loptions);
  loptions.is_curve_chord_tol = PK_LOGICAL_true;
  loptions.curve_chord_tol = tolerance;

  PK_ERROR_code_t error = PK_TOPOL_render_line(1, bodies, NULL, PK_ENTITY_null, &loptions);

  assertModelingError;

  Json::Value returnValue;
  returnValue["graphics"] = *PKSession::getGraphicsOutputObj();
  return returnValue;
}

Json::Value TORUS_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TORUS_create(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TORUS_make_solid_body(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_ask(const Json::Value &params) {
  assertParam(transf);
  PK_PLANE_t transf = params["transf"].asInt();

  PK_TRANSF_sf_t transf_sf;
  PK_ERROR_code_t error = PK_TRANSF_ask(transf, &transf_sf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["transf_sf"] = PK_TRANSF_sf_t_to_JSON(&transf_sf);
  return returnValue;
}

Json::Value TRANSF_check(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_classify(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_create(const Json::Value &params) {
  assertParam(transf_sf);
  PK_TRANSF_sf_t transf_sf;
  PK_TRANSF_sf_t_from_JSON(params["transf_sf"], &transf_sf);

  PK_TRANSF_t transf = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_TRANSF_create(&transf_sf, &transf);

  assertModelingError;

  Json::Value returnValue;
  returnValue["transf"] = transf;
  return returnValue;
}

Json::Value TRANSF_create_equal_scale(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_create_reflection(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_create_rotation(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_create_translation(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_create_view(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_is_equal(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRANSF_transform(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value TRCURVE_ask(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_ask_body(const Json::Value &params) {
  assertParam(vertex);
  PK_VERTEX_t vertex = params["vertex"].asInt();

  PK_BODY_t body = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_VERTEX_ask_body(vertex, &body);

  assertModelingError;

  Json::Value returnValue;
  returnValue["body"] = body;
  return returnValue;
}

Json::Value VERTEX_ask_faces(const Json::Value &params) {
  assertParam(vertex);
  PK_VERTEX_t vertex = params["vertex"].asInt();

  int n_faces = 0;
  PK_VERTEX_t *faces = nullptr;
  PK_ERROR_code_t error = PK_VERTEX_ask_faces(vertex, &n_faces, &faces);

  assertModelingError;

  Json::Value faceTags(Json::arrayValue);
  for (auto i = 0; i < n_faces; i += 1) {
    faceTags.append(faces[i]);
  }

  delete[] faces;
  faces = nullptr;

  Json::Value returnValue;
  returnValue["faces"] = faceTags;
  return returnValue;
}

Json::Value VERTEX_ask_isolated_loops(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_ask_oriented_edges(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_ask_point(const Json::Value &params) {
  assertParam(vertex);
  PK_VERTEX_t vertex = params["vertex"].asInt();

  PK_POINT_t point = PK_ENTITY_null;
  PK_ERROR_code_t error = PK_VERTEX_ask_point(vertex, &point);

  assertModelingError;

  Json::Value returnValue;
  returnValue["point"] = point;
  return returnValue;
}
Json::Value VERTEX_ask_precision(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_ask_shells(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_ask_type(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_attach_points(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_delete_acorn(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_make_blend(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_remove_edge(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_spin(const Json::Value &params) {
  return Json::nullValue;
}

Json::Value VERTEX_sweep(const Json::Value &params) {
  return Json::nullValue;
}
