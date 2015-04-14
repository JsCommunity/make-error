// ISC @ Julien Fontanet

'use strict'

// ===================================================================

var defineProperty = Object.defineProperty

// -------------------------------------------------------------------

var isString = (function (toS) {
  var ref = toS.call('')
  return function isString (val) {
    return toS.call(val) === ref
  }
})(Object.prototype.toString)

// -------------------------------------------------------------------

var captureStackTrace
if (Error.captureStackTrace) {
  captureStackTrace = function captureStackTrace (error, fn) {
    Error.captureStackTrace(error, fn)
  }
} else {
  captureStackTrace = function captureStackTrace (error) {
    var container = new Error()

    Object.defineProperty(error, 'stack', {
      configurable: true,
      get: function getStack () {
        var stack = container.stack

        // Replace property with value for faster future accesses.
        Object.defineProperty(this, 'stack', {
          value: stack
        })

        return stack
      }
    })
  }
}

// -------------------------------------------------------------------

function BaseError (message) {
  if (message) {
    defineProperty(this, 'message', {
      configurable: true,
      value: message,
      writable: true
    })
  }

  captureStackTrace(this, this.constructor)
}

BaseError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: BaseError
  },
  name: {
    get: function getName () {
      return this.constructor.name
    }
  }
})

// -------------------------------------------------------------------

function makeError (constructor, super_) {
  if (!super_ || super_ === Error) {
    super_ = BaseError
  }

  var name
  if (isString(constructor)) {
    name = constructor
    constructor = function () {
      super_.apply(this, arguments)
    }
  }

  constructor.super = super_

  // Register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  constructor.super_ = constructor.super

  constructor.prototype = Object.create(super_.prototype, {
    constructor: {
      value: constructor
    }
  })

  if (name) {
    defineProperty(constructor.prototype, 'name', {
      value: name
    })
  }

  return constructor
}
exports = module.exports = makeError
exports.BaseError = BaseError
