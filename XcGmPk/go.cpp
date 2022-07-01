#include <iostream>
#include <map>
#include <string>
#include <stdexcept>
#include <cassert>

#include "parasolid/frustrum_tokens.h"
#include "parasolid/frustrum_ifails.h"
#include "parasolid/parasolid_kernel.h"

#include "go.h"
#include "pksession.h"

using namespace std;

static map<int, string> sgtErrMap = {
    {ERNOGO, "Unspecified error"},
    {ERRUBB, "Rubber entity (no geometry attached)"},
    {ERSANG, "Surface angular tolerance too small"},
    {ERSDIS, "Surface distance tolerance too small"},
    {ERCANG, "Curve angular tolerance too small"},
    {ERCDIS, "Curve distance tolerance too small"},
    {ERCLEN, "Chord chord length tolerance too small"},
    {ERFWID, "Facet width tolerance too small"},
    {ERIFMF, "Incremental Facetting: missing face"},
    {ERIFRE, "Incremental Facetting: refinement required"},
    {ERIFER, "Incremental Facetting: unspecified error"},
};

static map<int, string> sgtTypenameMap = {
    {SGTPBY, "Body (hierarchical segment)"},
    {SGTPED, "Edge"},
    {SGTPSI, "Silhouette line"},
    {SGTPPH, "Planar hatch-line"},
    {SGTPRH, "Radial hatch-line"},
    {SGTPRU, "Rib line (unfixed blend)"},
    {SGTPBB, "Blend-boundary line"},
    {SGTPPL, "Parametric hatch line"},
    {SGTPFT, "Facet"},
    {SGTPFA, "Face (hierarchical segment)"},
    {SGTPER, "Error segment"},
    {SGTPGC, "Curve geometry segment"},
    {SGTPGS, "Surface geometry segment"},
    {SGTPGB, "Surface boundary geometry segment"},
    {SGTPMF, "Mangled facet"},
    {SGTPVT, "Visibility transitions"},
    {SGTPTS, "Facet strip"},
    {SGTPVP, "Parametrised Visibility segment"},
    {SGTPIC, "Interference Curve"},
    {SGTPCL, "Clip Line"}
};

int processLine(
    int segtyp,
    int ntags,
    const int *tags,
    int ngeoms,
    const double *geoms,
    int nlntp,
    const int *lntp
) {
  if (ntags != 1) {
    cout << "Expect 1 tags, found " << ntags << endl;
  }

  Json::Value *activeGraphicsOutputObj = PKSession::getGraphicsOutputObj();
  Json::Value curveObj(Json::objectValue);
  curveObj["tag"] = Json::Value(tags[0]);

  switch (lntp[1]) {
    case L3TPSL : {
      // Straight line
      curveObj["type"] = Json::Value("L3TPSL");

      Json::Value dataObj(Json::objectValue);
      Json::Value startPoint(Json::arrayValue);
      startPoint.append(geoms[0]);
      startPoint.append(geoms[1]);
      startPoint.append(geoms[2]);
      dataObj["startPoint"] = startPoint;
      Json::Value endPoint(Json::arrayValue);
      endPoint.append(geoms[3]);
      endPoint.append(geoms[4]);
      endPoint.append(geoms[5]);
      dataObj["endPoint"] = endPoint;
      Json::Value direction(Json::arrayValue);
      direction.append(geoms[6]);
      direction.append(geoms[7]);
      direction.append(geoms[8]);
      dataObj["direction"] = direction;

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPCC : {
      // Complete circle
      curveObj["type"] = Json::Value("L3TPCC");

      Json::Value dataObj(Json::objectValue);
      Json::Value centerPoint(Json::arrayValue);
      centerPoint.append(geoms[0]);
      centerPoint.append(geoms[1]);
      centerPoint.append(geoms[2]);
      dataObj["centerPoint"] = centerPoint;
      Json::Value axisDirection(Json::arrayValue);
      axisDirection.append(geoms[3]);
      axisDirection.append(geoms[4]);
      axisDirection.append(geoms[5]);
      dataObj["axisDir"] = axisDirection;
      dataObj["radius"] = Json::Value(geoms[6]);

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPCI : {
      // Partial circle
      curveObj["type"] = Json::Value("L3TPCI");

      Json::Value dataObj(Json::objectValue);
      Json::Value centerPoint(Json::arrayValue);
      centerPoint.append(geoms[0]);
      centerPoint.append(geoms[1]);
      centerPoint.append(geoms[2]);
      dataObj["centerPoint"] = centerPoint;
      Json::Value axisDirection(Json::arrayValue);
      axisDirection.append(geoms[3]);
      axisDirection.append(geoms[4]);
      axisDirection.append(geoms[5]);
      dataObj["axisDir"] = axisDirection;
      dataObj["radius"] = Json::Value(geoms[6]);
      Json::Value startPoint(Json::arrayValue);
      startPoint.append(geoms[7]);
      startPoint.append(geoms[8]);
      startPoint.append(geoms[9]);
      dataObj["startPoint"] = startPoint;
      Json::Value endPoint(Json::arrayValue);
      endPoint.append(geoms[10]);
      endPoint.append(geoms[11]);
      endPoint.append(geoms[12]);
      dataObj["endPoint"] = endPoint;

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPCE : {
      // Complete ellipse
      curveObj["type"] = Json::Value("L3TPCE");

      Json::Value dataObj(Json::objectValue);
      Json::Value centerPoint(Json::arrayValue);
      centerPoint.append(geoms[0]);
      centerPoint.append(geoms[1]);
      centerPoint.append(geoms[2]);
      dataObj["centerPoint"] = centerPoint;
      Json::Value majorAxisDir(Json::arrayValue);
      majorAxisDir.append(geoms[3]);
      majorAxisDir.append(geoms[4]);
      majorAxisDir.append(geoms[5]);
      dataObj["majorAxisDir"] = majorAxisDir;
      Json::Value minorAxisDir(Json::arrayValue);
      minorAxisDir.append(geoms[6]);
      minorAxisDir.append(geoms[7]);
      minorAxisDir.append(geoms[8]);
      dataObj["minorAxisDir"] = minorAxisDir;
      dataObj["majorRadius"] = geoms[9];
      dataObj["minorRadius"] = geoms[10];

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPEL : {
      // Partial ellipse
      curveObj["type"] = Json::Value("L3TPEL");

      Json::Value dataObj(Json::objectValue);
      Json::Value centerPoint(Json::arrayValue);
      centerPoint.append(geoms[0]);
      centerPoint.append(geoms[1]);
      centerPoint.append(geoms[2]);
      dataObj["centerPoint"] = centerPoint;
      Json::Value majorAxisDir(Json::arrayValue);
      majorAxisDir.append(geoms[3]);
      majorAxisDir.append(geoms[4]);
      majorAxisDir.append(geoms[5]);
      dataObj["majorAxisDir"] = majorAxisDir;
      Json::Value minorAxisDir(Json::arrayValue);
      minorAxisDir.append(geoms[6]);
      minorAxisDir.append(geoms[7]);
      minorAxisDir.append(geoms[8]);
      dataObj["minorAxisDir"] = minorAxisDir;
      dataObj["majorRadius"] = Json::Value(geoms[9]);
      dataObj["minorRadius"] = Json::Value(geoms[10]);
      Json::Value startPoint(Json::arrayValue);
      startPoint.append(geoms[11]);
      startPoint.append(geoms[12]);
      startPoint.append(geoms[13]);
      dataObj["startPoint"] = startPoint;
      Json::Value endPoint(Json::arrayValue);
      endPoint.append(geoms[14]);
      endPoint.append(geoms[15]);
      endPoint.append(geoms[16]);
      dataObj["endPoint"] = endPoint;

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPPY : {
      // Poly-line
      curveObj["type"] = Json::Value("L3TPPY");
      Json::Value dataObj(Json::objectValue);
      Json::Value points(Json::arrayValue);
      for (int i = 0; i < ngeoms; i += 1) {
        Json::Value point(Json::arrayValue);
        point.append(geoms[3 * i]);
        point.append(geoms[3 * i + 1]);
        point.append(geoms[3 * i + 2]);
        points.append(point);
      }

      curveObj["data"] = points;
    }
      break;
    case L3TPPC : {
      // Non-rational B-curve (Bezier)
      curveObj["type"] = "L3TPPC";
      Json::Value dataObj(Json::objectValue);
      Json::Value points(Json::arrayValue);
      for (int i = 0; i < ngeoms; i += 1) {
        Json::Value point(Json::arrayValue);
        point.append(geoms[3 * i]);
        point.append(geoms[3 * i + 1]);
        point.append(geoms[3 * i + 2]);
        points.append(point);
      }
      curveObj["data"] = points;
    }

      break;
    case L3TPRC : {
      // Rational B-curve (Bezier)
      curveObj["type"] = Json::Value("L3TPRC");
      Json::Value dataObj(Json::objectValue);
      Json::Value vertices(Json::arrayValue);
      for (int i = 0; i < ngeoms; i += 1) {
        Json::Value vertex(Json::objectValue);
        Json::Value point(Json::arrayValue);
        point.append(geoms[4 * i]);
        point.append(geoms[4 * i + 1]);
        point.append(geoms[4 * i + 2]);
        vertex["point"] = point;
        vertex["weight"] = Json::Value(geoms[4 * i + 3]);
        vertices.append(vertex);
      }
      curveObj["data"] = vertices;
    }
      break;
    case L3TPNC : {
      // Non-rational B-curve (NURBs form)
      int verticesNum = lntp[8];
      int knotsNum = lntp[9];
      curveObj["type"] = Json::Value("L3TPNC");

      Json::Value dataObj(Json::objectValue);

      Json::Value vertices(Json::arrayValue);
      for (int i = 0; i < verticesNum; i += 1) {
        Json::Value point(Json::arrayValue);
        point.append(geoms[3 * i]);
        point.append(geoms[3 * i + 1]);
        point.append(geoms[3 * i + 2]);
        vertices.append(point);
      }
      dataObj["vertices"] = vertices;

      Json::Value knots(Json::arrayValue);
      for (int i = 3 * verticesNum; i < 3 * verticesNum + knotsNum; i += 1) {
        knots.append(geoms[i]);
      }
      dataObj["knots"] = knots;

      curveObj["data"] = dataObj;
    }
      break;
    case L3TPRN : {
      // Rational B-curve (NURBs form)
      int verticesNum = lntp[8];
      int knotsNum = lntp[9];
      curveObj["type"] = Json::Value("L3TPNC");

      Json::Value dataObj(Json::objectValue);

      Json::Value vertices(Json::arrayValue);
      for (int i = 0; i < verticesNum; i += 1) {
        Json::Value vertex(Json::objectValue);

        Json::Value point(Json::arrayValue);
        point.append(geoms[3 * i]);
        point.append(geoms[3 * i + 1]);
        point.append(geoms[3 * i + 2]);
        vertex["point"] = point;
        vertex.append("weight");
        vertex.append(geoms[3 * i + 3]);

        vertices.append(vertex);
      }
      dataObj["vertices"] = vertices;

      Json::Value knots(Json::arrayValue);
      for (int i = 4 * verticesNum; i < 4 * verticesNum + knotsNum; i += 1) {
        knots.append(geoms[i]);
      }
      dataObj["knots"] = knots;

      curveObj["data"] = dataObj;
    }
      break;
    default:cerr << "Not supported curve type." << endl;
      assert(0);
      break;
  }

  (*activeGraphicsOutputObj)["edges"].append(curveObj);

  return CONTIN;
}

void addTriangle(const int &tag, const int &ngeoms, const double *geoms) {
  Json::Value *activeGraphicsOutputObj = PKSession::getGraphicsOutputObj();
  Json::Value facetObj(Json::objectValue);
  facetObj["tag"] = Json::Value(tag);
  facetObj["type"] = Json::Value("L3TPFI");

  Json::Value facets(Json::arrayValue);

  int verticesNum = ngeoms / 3;
  const double *points = geoms;
  const double *normals = geoms + verticesNum * 3;
  const double *parameters = geoms + verticesNum * 3 + verticesNum * 3;

  for (int i = 0; i < verticesNum; i += 1) {
    Json::Value vertexObj(Json::objectValue);

    Json::Value pointObj(Json::arrayValue);
    Json::Value normalObj(Json::arrayValue);
    Json::Value parameterObj(Json::arrayValue);
    pointObj.append(points[i * 3]);
    pointObj.append(points[i * 3 + 1]);
    pointObj.append(points[i * 3 + 2]);
    normalObj.append(normals[i * 3]);
    normalObj.append(normals[i * 3 + 1]);
    normalObj.append(normals[i * 3 + 2]);
    parameterObj.append(parameters[i * 3]);
    parameterObj.append(parameters[i * 3 + 1]);
    parameterObj.append(parameters[i * 3 + 2]);

    vertexObj["point"] = pointObj;
    vertexObj["normal"] = normalObj;
    vertexObj["parameter"] = parameterObj;

    facets.append(vertexObj);
  }
  facetObj["facets"] = facets;

  (*activeGraphicsOutputObj)["faces"].append(facetObj);
}

void addTriangleStrip(const int &tag, const int &ngeoms, const double *geoms) {
  Json::Value *activeGraphicsOutputObj = PKSession::getGraphicsOutputObj();
  Json::Value facetObj(Json::objectValue);
  facetObj["tag"] = Json::Value(tag);
  // L3TPFI; and facet strip vertices plus normal plus parameters - L3TPTI
  facetObj["type"] = Json::Value("L3TPTI");

  Json::Value facets(Json::arrayValue);

  int verticesNum = ngeoms / 3;
  const double *points = geoms;
  const double *normals = geoms + verticesNum * 3;

  // TODO: Why there are three components in the parameters? U V T? What's T?
  const double *parameters = geoms + verticesNum * 3 + verticesNum * 3;

  for (int i = 0; i < verticesNum; i += 1) {
    Json::Value vertexObj(Json::objectValue);

    Json::Value pointObj(Json::arrayValue);
    Json::Value normalObj(Json::arrayValue);
    Json::Value parameterObj(Json::arrayValue);
    pointObj.append(points[i * 3]);
    pointObj.append(points[i * 3 + 1]);
    pointObj.append(points[i * 3 + 2]);
    normalObj.append(normals[i * 3]);
    normalObj.append(normals[i * 3 + 1]);
    normalObj.append(normals[i * 3 + 2]);
    parameterObj.append(parameters[i * 3]);
    parameterObj.append(parameters[i * 3 + 1]);
    parameterObj.append(parameters[i * 3 + 2]);

    vertexObj["point"] = pointObj;
    vertexObj["normal"] = normalObj;
    vertexObj["parameter"] = parameterObj;

    facets.append(vertexObj);
  }
  facetObj["facets"] = facets;

  (*activeGraphicsOutputObj)["faces"].append(facetObj);
}

//
// GO Interface
//

void GoInterface::resetBuffers() {
}

void GoInterface::ProcessSegment(
    const int *segtyp,
    const int *ntags,
    const int *tags,
    const int *ngeoms,
    const double *geoms,
    const int *nlntp,
    const int *lntp,
    int *ifail
) {
//  cerr<<"process segment:"<<sgtTypenameMap[*segtyp];
//  cerr<<". Tag number: "<<(*ntags)<<" Tags: ";
//  for(int i=0; i<(*ntags); i += 1) {
//    cerr<<" "<<tags[i];
//  }
//  cerr<<endl;

  *ifail = CONTIN;

  switch (*segtyp) {
    case SGTPER :   // Error segment
      cerr << "Error segment " << sgtErrMap[lntp[1]] << endl;
      *ifail = CONTIN;
      break;

    case SGTPVT :   // Visibility segment (used for hierarchical output)
    case SGTPVP :   // Parametrised Visibility segment
      cerr << "Visibility segment not supported" << endl;
      *ifail = CONTIN;
      break;

    case SGTPED :   // Edge
    case SGTPSI :   // Silhouette line
    case SGTPPH :   // Planar hatch-line
    case SGTPRH :   // Radial hatch-line
    case SGTPRU :   // Rib line (unfixed blend)
    case SGTPBB :   // Blend-boundary line
    case SGTPPL :   // Parametric hatch line
    case SGTPGC :   // Geometry ... curve.
    case SGTPGS :   // Geometry ... surface.
    case SGTPGB :   // Geometry ... surface boundary.
      *ifail = processLine(*segtyp, *ntags, tags, *ngeoms, geoms, *nlntp,
                           lntp);
      break;
    case SGTPFT :   // Facet
      if (lntp[1] == L3TPFI) {
        // Facet vertices plus normals plus parameters
        addTriangle(tags[0], *ngeoms, geoms);
      } else {
        cerr << "GOSGMT: We expect  Facet strip vertices plus surface normals." << endl;
        *ifail = ABORT;
      }
      *ifail = CONTIN;
      break;
    case SGTPTS :   // Facet strip
      if (lntp[1] == L3TPTI) {
        addTriangleStrip(tags[0], *ngeoms, geoms);
      } else {
        cerr << "GOSGMT: We expect  Facet strip vertices plus surface normals." << endl;
        *ifail = ABORT;
      }
      *ifail = CONTIN;
      break;
    case SGTPIC :   // interference curve
    case SGTPCL :   // clip curve
      cerr << "Unsupported Segment Type " << *segtyp << endl;
      *ifail = CONTIN;
      break;

    default:cerr << "Unsupported Segment Type" << *segtyp << endl;
      *ifail = CONTIN;
      break;
  }
}

void GoInterface::OpenSegment(
    const int *segtyp,
    const int *ntags,
    const int *tags,
    const int *ngeoms,
    const double *geoms,
    const int *nlntp,
    const int *lntp,
    int *ifail
) {
  //cerr<<"Open segment:"<<sgtTypenameMap[*segtyp]<<"  Tag number: "<<(*ntags)<<" Tag:"<<tags[0]<<"\n";

  int i = 0;
  *ifail = CONTIN; // By default we won't complain to Parasolid

  switch (*segtyp) {
    case SGTPBY:  // Body: find it's type.
      //PK_BODY_ask_type( tags[ 0 ], &m_currentBodyType);
      i = 0;
      break;

    case SGTPFA:  // It's a face, i.e. we are getting facets for an entire
      // face of a body. Why not set it's colour
      i = 0;
      break;
    case SGTPGC: // Orphan Geometry - do nothing at this moment
      i = 0;
      break;
    case SGTPGS:i = 0;
      break;
    case SGTPGB:i = 0;
      break;
    default:
      // In our present implementation we aren't using hierarchical segments and so we
      // shouldn't get any other sort of segment. We might as well ASSERT _and_ return
      // an error to Parasolid
      assert(false);
      *ifail = ABORT;
      break;
  }
}

void GoInterface::CloseSegment(
    const int *segtyp,
    const int *ntags,
    const int *tags,
    const int *ngeoms,
    const double *geoms,
    const int *nlntp,
    const int *lntp,
    int *ifail
) {
  //cerr<<"Close segment:"<<sgtTypenameMap[*segtyp]<<"  Tag number: "<<(*ntags)<<" Tag:"<<tags[0]<<"\n";

  *ifail = CONTIN;
}
