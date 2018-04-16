#include <node.h>

namespace FunctionArgumentsAndCallbackDemo {
  using v8::Function;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::Value;
  using v8::Null;
  using v8::Exception;
  using v8::String;

  void accumulate (const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    /* 参数不合理异常 */
    if (args.Length() < 1) {
      isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Arguments Number Error.")
      ));
      return;
    }

    /* 没有回调函数 */
    if (!args[args.Length() - 1]->IsFunction()) {
      isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "No Callback Error.")
      ));
      return;
    }

    /* 提取通过参数传递的回调函数 */
    Local<Function> callback = Local<Function>::Cast(args[args.Length() - 1]);

    /* 遍历参数进行求和 */
    double sum = 0.0;
    for (int i = 0; i < args.Length() - 1; ++i) {
      /* 如果参数不是数字，向js抛出异常 */
      if (!args[i]->IsNumber()) {
        isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Arguments Type Error.")
        ));
        return;
      } else {
        sum += args[i]->NumberValue();
      }
    }

    /* 将求和结果转成一个js Number, 通过回调函数进行返回 */
    Local<Number> num = Number::New(isolate, sum);
    Local<Value> argv[1] = { num };
    callback->Call(Null(isolate), 1, argv);
  }

  void init (Local<Object> exports) {
    NODE_SET_METHOD(exports, "accumulate", accumulate);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
