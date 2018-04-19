#include <uv.h>
#include <node.h>
#include <vector>

namespace AsyncDemo {
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
  using v8::Undefined;
  using v8::Persistent;
  using v8::HandleScope;

  /* 存放数据供子线程使用的结构体 */
  struct Data {
    /* 回调函数 */
    Persistent<Function> callback;
    /* 求和参数 */
    std::vector<double> args;
    /* 求和结果 */
    double result;
  };

  /* 子线程执行的代码 */
  void calculate (uv_work_t* req) {
    Data* data = static_cast<Data*>(req->data);
    /* 遍历参数进行求和 */
    data->result = 0.0;
    for (int i = 0; i < data->args.size(); ++i) {
      data->result += data->args[i];
    }
  }

  /* 子线程结束后执行的代码 */
  void calculateComplete (uv_work_t* req) {
    Data* data = static_cast<Data*>(req->data);
    Isolate* isolate = Isolate::GetCurrent();
    /* 必须创建一个HandleScope，否则后面无法创建句柄 */
    HandleScope handleScope(isolate);
    /* 将求和结果转换为一个JS Number */
    Local<Value> argv[1] = { Number::New(isolate, data->result) };
    /* 通过回调函数返回求和结果 */
    Local<Function> cb = Local<Function>::New(isolate, data->callback);
    cb->Call(Null(isolate), 1, argv);
    /* 回调完成后清除资源 */
    data->callback.Reset();
    delete data;
    delete req;
  }

  void accumulateAsync (const FunctionCallbackInfo<Value>& args) {
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
    /* 创建Data结构体存储数据 */
    Data* data = new Data();
    /* 存储回调函数 */
    data->callback.Reset(isolate, callback);
    /* 提取参数并存储到data */
    for (int i = 0; i < args.Length() - 1; ++i) {
      /* 如果参数不是数字，向js抛出异常 */
      if (!args[i]->IsNumber()) {
        isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Arguments Type Error.")
        ));
        return;
      } else {
        data->args.push_back(args[i]->NumberValue());
      }
    }

    /* 启动工作线程进行求和计算 */
    uv_work_t *req = new uv_work_t();
    req->data = data;
    uv_queue_work(
      uv_default_loop(),
      req,
      (uv_work_cb)calculate,
      (uv_after_work_cb)calculateComplete
    );

    /* 本函数直接返回，无需等待线程计算完成 */
    args.GetReturnValue().Set(Undefined(isolate));
  }

  void init (Local<Object> exports) {
    NODE_SET_METHOD(exports, "accumulateAsync", accumulateAsync);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
