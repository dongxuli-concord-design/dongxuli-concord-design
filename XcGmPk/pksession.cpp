#include <iostream>
#include <cassert>

#include "parasolid/frustrum_tokens.h"
#include "parasolid/frustrum_ifails.h"
#include "parasolid/parasolid_kernel.h"

#include "pksession.h"
#include "frustrum.h"
#include "go.h"

PK_SESSION_frustrum_t *PKSession::m_pkSessionFrustrum = nullptr;
Json::Value *PKSession::m_graphicsOutputObj = new Json::Value;

PK_ERROR_code_t errorHandler(PK_ERROR_sf_t * error_sf) {

  std::cerr << error_sf->function << " failed. Error code: " << error_sf->code_token << " Error code token:  " << error_sf->code_token << std::endl;
  return error_sf->code;
}

PK_ERROR_code_t PKSession::start() {
  PK_ERROR_code_t error = PK_ERROR_no_errors;
  PK_ERROR_frustrum_t errorFru;
  errorFru.handler_fn = errorHandler;
  error = PK_ERROR_register_callbacks(errorFru);
  assert(error == PK_ERROR_no_errors);

  PKSession::m_pkSessionFrustrum = new PK_SESSION_frustrum_t;
  PK_SESSION_frustrum_o_m(*m_pkSessionFrustrum);

  m_pkSessionFrustrum->fstart = FSTART;
  m_pkSessionFrustrum->fabort = FABORT;
  m_pkSessionFrustrum->fstop = FSTOP;
  m_pkSessionFrustrum->fmallo = FMALLO;
  m_pkSessionFrustrum->fmfree = FMFREE;
  m_pkSessionFrustrum->ffoprd = FFOPRD;
  m_pkSessionFrustrum->ffopwr = FFOPWR;
  m_pkSessionFrustrum->ffclos = FFCLOS;
  m_pkSessionFrustrum->ffread = FFREAD;
  m_pkSessionFrustrum->ffwrit = FFWRIT;

  m_pkSessionFrustrum->gosgmt = GoInterface::ProcessSegment;
  m_pkSessionFrustrum->goopsg = GoInterface::OpenSegment;
  m_pkSessionFrustrum->goclsg = GoInterface::CloseSegment;

  error = PK_SESSION_register_frustrum(m_pkSessionFrustrum);
  assert(error == PK_ERROR_no_errors);
  PK_SESSION_start_o_t options;
  PK_SESSION_start_o_m(options);
  error = PK_SESSION_start(&options);

  return error;
}

PK_ERROR_code_t PKSession::stop() {
  PK_ERROR_code_t error = PK_SESSION_stop();
  delete PKSession::m_pkSessionFrustrum;
  PKSession::m_pkSessionFrustrum = nullptr;

  return error;
}

Json::Value *PKSession::getGraphicsOutputObj() {
  return PKSession::m_graphicsOutputObj;
}

void PKSession::resetGraphicsOutputObj() {
  delete PKSession::m_graphicsOutputObj;
  PKSession::m_graphicsOutputObj = new Json::Value(Json::objectValue);
  (*PKSession::m_graphicsOutputObj)["faces"] = Json::Value(Json::arrayValue);
  (*PKSession::m_graphicsOutputObj)["edges"] = Json::Value(Json::arrayValue);
  (*PKSession::m_graphicsOutputObj)["vertices"] = Json::Value(Json::arrayValue);
}
