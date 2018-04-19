// hello-world demo
const HelloWorld = require('./build/Release/hello_world')
console.log('[HelloWorldDemo] ' + HelloWorld.hello())

// function-arguments-and-callbacks demo
const Accumulate = require('./build/Release/accumulate')
Accumulate.accumulate(1, 3, 4, 7, (sum) => {
  console.log('[FunctionArgumentsAndCallbacksDemo] 1 + 3 + 4 + 7 = ' + sum)
})

// exception demo
try {
  Accumulate.accumulate()
} catch (err) {
  console.log('[ExceptionDemo] ' + err)
}

try {
  Accumulate.accumulate(1, 2, 3)
} catch (err) {
  console.log('[ExceptionDemo] ' + err)
}

try {
  Accumulate.accumulate(1, 2, 'a', (sum) => {
    console.log(sum)
  })
} catch (err) {
  console.log('[ExceptionDemo] ' + err)
}

// return-object demo
const Person = require('./build/Release/person')
let someone = Person.getPerson()
console.log('[ReturnObjectDemo] ' + someone.firstname + someone.lastname)

// return-function demo
let sayHiTo = Person.getFunction()
console.log('[ReturnFunctionDemo] ' + sayHiTo(someone))

// cpp-object-wrap demo
const AccumulatorModule = require('./build/Release/Accumulator')
let acc = new AccumulatorModule.Accumulator(2)
console.log('[ObjectWrapDemo] 2 + 12 = ' + acc.add(12))
console.log('[ObjectWrapDemo] 2 + 12 + 5 = ' + acc.add(5))
console.log('[ObjectWrapDemo] add times: ' + acc.getAddTimes())

// cpp-object-wrap-factory demo
let acc2 = AccumulatorModule.getAccumulatorInstance(3)
console.log('[ObjectWrapFactoryDemo] 3 + 16 = ' + acc2.add(16))
console.log('[ObjectWrapFactoryDemo] 3 + 16 + 7 = ' + acc2.add(7))
console.log('[ObjectWrapFactoryDemo] 3 + 16 + 7 + 4 = ' + acc2.add(4))
console.log('[ObjectWrapFactoryDemo] add times: ' + acc2.getAddTimes())

// async-demo
const AccumulateAsync = require('./build/Release/accumulate_async')
AccumulateAsync.accumulateAsync(1, 3, 4, 7, (sum) => {
  console.log('[AsyncDemo] 1 + 3 + 4 + 7 = ' + sum)
})
console.log('[AsyncDemo] Hi~')
