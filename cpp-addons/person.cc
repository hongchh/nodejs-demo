#include <node.h>

namespace ReturnObjectAndFuntionDemo {
  using v8::Function;
  using v8::FunctionTemplate;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::Local;

  void getPerson (const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    /* 创建对象 */
    Local<Object> obj = Object::New(isolate);
    /* 设置对象属性，Set(key, value) */
    obj->Set(
      String::NewFromUtf8(isolate, "firstname"),
      String::NewFromUtf8(isolate, "Java")
    );
    obj->Set(
      String::NewFromUtf8(isolate, "lastname"),
      String::NewFromUtf8(isolate, "Script")
    );
    /* 将对象返回给JavaScript */
    args.GetReturnValue().Set(obj);
  }

  void sayHiTo (const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    /* 提取通过参数传递的JS对象 */
    Local<Object> person = Local<Object>::Cast(args[0]);
    /* 提取对象属性值并拼接字符串 */
    Local<String> fullname = String::Concat(
      person->Get(String::NewFromUtf8(isolate, "firstname"))->ToString(),
      person->Get(String::NewFromUtf8(isolate, "lastname"))->ToString()
    );
    /* 将结果返回给JavaScript */
    args.GetReturnValue().Set(String::Concat(
      String::NewFromUtf8(isolate, "Hi, "),
      fullname
    ));
  }

  void getFunction (const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    /* 利用函数模板构造一个JavaScript函数 */
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, sayHiTo);
    Local<Function> fn = tpl->GetFunction();
    fn->SetName(String::NewFromUtf8(isolate, "sayHiTo"));
    /* 将函数返回给JavaScript */
    args.GetReturnValue().Set(fn);
  }

  void init (Local<Object> exports) {
    NODE_SET_METHOD(exports, "getPerson", getPerson);
    NODE_SET_METHOD(exports, "getFunction", getFunction);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
