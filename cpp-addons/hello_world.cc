#include <node.h>

namespace HelloWorldDemo {
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Value;

  void hello (const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    /* 通过 FunctionCallbackInfo<Value>& args 可以设置返回值 */
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "hello world."));
  }

  void init (Local<Object> exports) {
    /* 设置模块的导出方法 hello */
    /* 等价于 js 模块中的 module.exports.hello = hello */
    NODE_SET_METHOD(exports, "hello", hello);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
