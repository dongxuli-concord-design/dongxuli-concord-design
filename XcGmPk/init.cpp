#include <iostream>
#include <string>
#include <cassert>
#include <exception>
#include <typeinfo>
#include <stdexcept>

#include <node.h>

#include "parasolid/parasolid_kernel.h"
#include "api.h"
#include "pksession.h"

using namespace v8;
using namespace std;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void call(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  if (args.Length() != 1) {
    cerr << "Invalid API" << endl;
    return args.GetReturnValue()
        .Set(String::NewFromUtf8(isolate, "Invalid API", NewStringType::kNormal).ToLocalChecked());
  }

  v8::String::Utf8Value str(isolate, args[0]);
  std::string apiStr(*str);
  Json::Value returnValue;
  try {
    Json::Value pkReturnValue = callAPI(apiStr);
    returnValue["error"] = Json::nullValue;
    returnValue["pkReturnValue"] = pkReturnValue;
  } catch (string error) {
    returnValue["error"] = error;
    returnValue["pkReturnValue"] = Json::nullValue;
    cerr<<"Exception: "<<error<<endl;
  } catch (const std::exception &e) {
    returnValue["error"] = e.what();
    returnValue["pkReturnValue"] = Json::nullValue;
    cerr<<"Exception: "<< e.what()<<endl;
  } catch (...) {
    returnValue["error"] = "Unknown exception";
    returnValue["pkReturnValue"] = Json::nullValue;
    std::cerr << "Unknown exception"<<endl;
  }

  string returnValueString = returnValue.toStyledString();

  return args.GetReturnValue()
      .Set(String::NewFromUtf8(isolate, returnValueString.c_str(), NewStringType::kNormal).ToLocalChecked());
}

void init(Local<Object> exports) {
  PK_ERROR_code_t error = PKSession::start();
  assert(error == PK_ERROR_no_errors);

  NODE_SET_METHOD(exports, "call", call);
}

NODE_MODULE(XcGmPk, init)
