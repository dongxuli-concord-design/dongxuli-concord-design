#pragma once

#include "parasolid/parasolid_kernel.h"
#include "json.h"

/////////////////////////////////////////
///
/// \brief Encapsulates starting and stopping Parasolid session
///
/// Almost all parasolid operations have to be performed in the context
/// of a session. Therefore before doing any operations in the pktess
/// library, you should create an instance of Session object. You should
/// not perform any operations after this object has been deleted.
///
/////////////////////////////////////////

class PKSession {
 public:
  static PK_ERROR_code_t start();
  static PK_ERROR_code_t stop();
  static Json::Value *getGraphicsOutputObj();
  static void resetGraphicsOutputObj();
 private:
  PKSession() {};
  ~PKSession() {};
  PKSession(PKSession const &) {};              // Don't Implement
  void operator=(PKSession const &) {}; // Don't implement

  static PK_SESSION_frustrum_t *m_pkSessionFrustrum;
  static Json::Value *m_graphicsOutputObj;
};

