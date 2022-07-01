#include <string>
#include <iostream>

#include "json.h"
#include "util.h"

using namespace std;

void apiAssert(bool assertion, string message) {
  if (!assertion) {
    throw message;
  }
}

void apiAssertParamMember(const Json::Value &params, string member) {
  apiAssert(params.isMember(member),"Param expected: " + member);
}
