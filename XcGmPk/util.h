#pragma once

#ifndef XCGMPK_UTIL_H
#define XCGMPK_UTIL_H

#include <string>
using namespace std;

void apiAssert(bool assertion, string message);

void apiAssertParamMember(const Json::Value &params, string member);

#define assertParam(param) apiAssertParamMember(params, #param)

#define assertModelingError   apiAssert(error == PK_ERROR_no_errors, "Modeling error: " + to_string(error))

#endif //XCGMPK_UTIL_H
