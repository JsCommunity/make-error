'use strict'

/* eslint-env jest */

// ===================================================================

var makeError = require('./')
var BaseError = makeError.BaseError

// ===================================================================

function getCommonLastItems (arr1, arr2, butFirsts) {
  var n = Math.min(arr1.length, arr2.length) - (butFirsts || 0)

  return [
    arr1.slice(-n),
    arr2.slice(-n)
  ]
}

function compareStacks (actual, expected) {
  actual = splitLines(actual)
  expected = splitLines(expected)

  // We want to compare only the beginning (bottom) of the stack and
  // we don't want to compare the first (from head) two items.
  var tmp = getCommonLastItems(actual, expected, 2)
  actual = tmp[0]
  expected = tmp[1]

  expect(actual).toEqual(expected)
}

var NL_RE = /\r?\n/
function splitLines (str) {
  return String(str).split(NL_RE)
}

// ===================================================================

describe('makeError()', function () {
  it('throws on invalid arguments', function () {
    expect(function () {
      makeError(42)
    }).toThrow(TypeError)
    expect(function () {
      makeError('MyError', 42)
    }).toThrow(TypeError)
  })

  it('creates a new error class', function () {
    var constructorCalled

    function MyError (message) {
      expect(MyError.super).toBe(BaseError)
      expect(MyError.super_).toBe(BaseError)

      MyError.super.call(this, message)
      constructorCalled = true
    }
    makeError(MyError)

    var e = new MyError('my error message'); var stack = new Error().stack

    expect(constructorCalled).toBe(true)

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyError)

    expect(e.name).toBe('MyError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })

  it('derives an existing error class', function () {
    function MyBaseError (message) {
      MyBaseError.super.call(this, message)
    }
    makeError(MyBaseError)

    function MyDerivedError (message) {
      expect(MyDerivedError.super).toBe(MyBaseError)
      expect(MyDerivedError.super_).toBe(MyBaseError)

      MyBaseError.super.call(this, message)
    }
    makeError(MyDerivedError, MyBaseError)

    var e = new MyDerivedError('my error message'); var stack = new Error().stack

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyBaseError)
    expect(e).toBeInstanceOf(MyDerivedError)

    expect(e.name).toBe('MyDerivedError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })

  it('creates a new error class from a name', function () {
    var MyError = makeError('MyError')

    var e = new MyError('my error message'); var stack = new Error().stack

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyError)

    expect(e.name).toBe('MyError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })
})

describe('BaseError', function () {
  it('can be inherited directly', function () {
    var constructorCalled

    function MyError (message) {
      BaseError.call(this, message)
      constructorCalled = true
    }

    // Manually inherits from BaseError.
    MyError.prototype = Object.create(BaseError.prototype, {
      constructor: {
        value: MyError
      }
    })

    var e = new MyError('my error message'); var stack = new Error().stack

    expect(constructorCalled).toBe(true)

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyError)

    expect(e.name).toBe('MyError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })

  it('supports ES3 inheritance', function () {
    function MyError (message) {
      BaseError.call(this, message)
    }

    function Tmp () {
      this.constructor = MyError
    }
    Tmp.prototype = BaseError.prototype
    MyError.prototype = new Tmp()

    var e = new MyError('my error message'); var stack = new Error().stack

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyError)

    expect(e.name).toBe('MyError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })

  ;(typeof Reflect !== 'undefined' ? it : it.skip)('can be reused as base error', function () {
    class MyBaseError extends BaseError {}
    var MyError = makeError('MyError', MyBaseError)

    var e = new MyError('my error message'); var stack = new Error().stack

    expect(e).toBeInstanceOf(Error)
    expect(e).toBeInstanceOf(BaseError)
    expect(e).toBeInstanceOf(MyError)

    expect(e.name).toBe('MyError')
    expect(e.message).toBe('my error message')
    expect(typeof e.stack).toBe('string')
    compareStacks(e.stack, stack)
  })

  it('sub error should have its own name', function () {
    var TestError = makeError('TestError')
    var SubTestError = makeError('SubTestError', TestError)
    // console.log(TestError.super_)
    var again = new SubTestError('more bad')
    expect(again.name).toBe('SubTestError')
    // class Foo { }
    // function Boo () { }
    // const x = Reflect.construct(Foo, [], Boo)
    // console.log(x)
  })
})
