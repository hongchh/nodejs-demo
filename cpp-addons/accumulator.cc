#include <node.h>
#include <node_object_wrap.h>

namespace CppObjectWrapDemo {
  using v8::Context;
  using v8::Function;
  using v8::FunctionCallbackInfo;
  using v8::FunctionTemplate;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::Persistent;
  using v8::String;
  using v8::Value;
  using v8::Exception;

  /* 将C++类封装给JS使用，需要继承node::ObjectWrap */
  class Accumulator : public node::ObjectWrap {
    public:
      /* 初始化该类的JS构造函数，并返回JS构造函数 */
      static Local<Function> init (Isolate* isolate) {
        /* 利用函数模板，将一个C++函数包装成JS函数 */
        Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, AccumulatorJS);
        tpl->SetClassName(String::NewFromUtf8(isolate, "Accumulator"));
        tpl->InstanceTemplate()->SetInternalFieldCount(1);
        /* 类方法定义在构造函数的prototype上 */
        NODE_SET_PROTOTYPE_METHOD(tpl, "add", add);
        NODE_SET_PROTOTYPE_METHOD(tpl, "getAddTimes", getAddTimes);
        /* 获取Accumulator类的JS构造函数 */
        Local<Function> fn = tpl->GetFunction();
        /* JS构造函数句柄存储于constructor上，后续还会使用到 */
        constructor.Reset(isolate, fn);
        return fn;
      }

      /* 获取该类实例的工厂函数 */
      static void getInstance (const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        Local<Value> argv[1] = { args[0] };
        /* 获取当前上下文 */
        Local<Context> context = isolate->GetCurrentContext();
        /* 生成JS构造函数 */
        Local<Function> _constructor = Local<Function>::New(isolate, constructor);
        /* 创建实例 */
        Local<Object> obj = _constructor->NewInstance(context, 1, argv).ToLocalChecked();
        /* 返回实例 */
        args.GetReturnValue().Set(obj);
      }
    private:
      /* 成员变量 */
      static Persistent<Function> constructor;
      double value;
      int addTimes;

      /* 该类的C++构造函数，设置成员变量初始值 */
      explicit Accumulator (double initValue = 0) {
        this->value = initValue;
        this->addTimes = 0;
      }

      /* 该类的JS构造函数，创建该类的对象，并包装成JS对象然后进行返回 */
      static void AccumulatorJS (const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        if (args.IsConstructCall()) {/* 通过 new Accumulator() 创建对象 */
          /* 提取参数数值 */
          double val = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
          /* 创建该类的实例对象 */
          Accumulator* obj = new Accumulator(val);
          /* 包装该对象 */
          obj->Wrap(args.This());
          /* 返回该对象 */
          args.GetReturnValue().Set(args.This());
        } else {/* 通过直接调用函数 Accumulator() 创建对象，抛出异常 */
          isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Should use the new operator to create an instance.")
          ));
        }
      }

      /* 该类的成员方法，增加value的值 */
      static void add (const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        /* 将被包装的JS对象还原为C++对象 */
        Accumulator* obj = node::ObjectWrap::Unwrap<Accumulator>(args.Holder());
        /* 访问C++对象上的成员变量进行操作 */
        obj->value += args[0]->NumberValue();
        obj->addTimes += 1;
        args.GetReturnValue().Set(Number::New(isolate, obj->value));
      }

      /* 该类的成员方法，获取累加次数 */
      static void getAddTimes (const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        /* 将被包装的JS对象还原为C++对象 */
        Accumulator* obj = node::ObjectWrap::Unwrap<Accumulator>(args.Holder());
        args.GetReturnValue().Set(Number::New(isolate, obj->addTimes));
      }
  };

  Persistent<Function> Accumulator::constructor;

  void getAccumulatorInstance(const FunctionCallbackInfo<Value>& args) {
    Accumulator::getInstance(args);
  }

  void init (Local<Object> exports) {
    Isolate* isolate = exports->GetIsolate();
    /* 初始化Accumulator类的JS构造函数 */
    Local<Function> _Accumulator = Accumulator::init(isolate);
    /* 将Accumulator类的JS构造函数暴露给JS使用 */
    /* 这里不能使用NODE_SET_METHOD，因为NODE_SET_METHOD是暴露一个C++函数给JS使用 */
    /* NODE_SET_METHOD(exports, "Accumulator", _Accumulator); */
    /* 此处是暴露一个JS函数，它在C++里面表示为一个Function对象，不是一个C++函数 */
    /* 要通过设置属性的方法将其挂到exports上 */
    exports->Set(String::NewFromUtf8(isolate, "Accumulator"), _Accumulator);
    /* 将获取实例的工厂方法暴露给JS */
    NODE_SET_METHOD(exports, "getAccumulatorInstance", getAccumulatorInstance);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
