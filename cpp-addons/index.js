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

// object-wrap demo
// const ObjectWrap = require('./build/Release/object_wrap')
// let counter = new ObjectWrap.Counter(5)
// console.log('[ObjectWrapDemo] ' + counter.plusOne())
// console.log('[ObjectWrapDemo] ' + counter.plusOne())
// console.log('[ObjectWrapDemo] ' + counter.plusOne())
