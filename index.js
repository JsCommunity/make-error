// ISC @ Julien Fontanet

'use strict'

// ===================================================================

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
        delete error.stack
        error.stack = container.stack

        // Free memory.
        container = null

        return stack
      }
    })
  }
}

// -------------------------------------------------------------------

function BaseError (message) {
  this.message = message

  captureStackTrace(this, this.constructor)
}

BaseError.prototype = Object.create(Error.prototype, {
  name: {
    value: 'BaseError'
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
  } else {
    name = constructor.name
  }

  constructor.super = super_

  // Register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  constructor.super_ = constructor.super

  constructor.prototype = Object.create(super_.prototype, {
    constructor: {
      value: constructor
    },
    name: {
      value: name
    }
  })

  return constructor
}
exports = module.exports = makeError
exports.BaseError = BaseError
