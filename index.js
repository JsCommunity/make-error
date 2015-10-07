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
  captureStackTrace = Error.captureStackTrace
} else {
  captureStackTrace = function captureStackTrace (error) {
    var container = new Error()

    defineProperty(error, 'stack', {
      configurable: true,
      get: function getStack () {
        var stack = container.stack

        // Replace property with value for faster future accesses.
        defineProperty(this, 'stack', {
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

  // The name property has to be defined directly on the object for V8
  // to use it in stack traces.
  defineProperty(this, 'name', {
    configurable: true,
    value: this.constructor.name,
    writable: true
  })

  captureStackTrace(this, this.constructor)
}

BaseError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: BaseError
  }
})

// -------------------------------------------------------------------

function makeError (constructor, super_) {
  if (!super_ || super_ === Error) {
    super_ = BaseError
  }

  if (isString(constructor)) {
    /* eslint no-eval: 0 */
    eval('constructor = function ' + constructor + '() { super_.apply(this, arguments) }')
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

  return constructor
}
exports = module.exports = makeError
exports.BaseError = BaseError
