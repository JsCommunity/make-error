// ISC @ Julien Fontanet
//
// https://gist.github.com/julien-f/26daf1aa567e68bfa7fe

'use strict';

//====================================================================

var captureStackTrace;
if (Error.captureStackTrace) {
  captureStackTrace = function captureStackTrace(error, fn) {
    Error.captureStackTrace(error, fn);
  };
} else {
  captureStackTrace = function captureStackTrace(error, fn) {
    var container = new Error();

    Object.defineProperty(error, 'stack', {
      configurable: true,
      enumerable: false,
      writable: false,
      get: function getStack() {
        var stack = container.stack;

        // Free memory.
        container = null;

        // Replace property with value for faster future accesses.
        delete error.stack;
        error.stack = container.stack;

        return stack;
      },
    });
  };
}

//--------------------------------------------------------------------

function BaseError(message) {
  this.message = message;

  captureStackTrace(this, this.constructor);
}

BaseError.prototype = Object.create(Error.prototype, {
  name: {
    configurable: false,
    enumerable: false,
    value: 'BaseError',
    writable: false,
  },
});

//--------------------------------------------------------------------

function makeError(constructor, super_) {
  if (!super_ || super_ === Error) {
    super_ = BaseError;
  }

  constructor.super = super_;

  // Register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  constructor.super_ = constructor.super;

  constructor.prototype = Object.create(super_.prototype, {
    constructor: {
      configurable: false,
      enumerable: false,
      value: constructor,
      writable: false,
    },
    name: {
      configurable: false,
      enumerable: false,
      value: constructor.name,
      writable: false,
    },
  });

  return constructor;
}
exports = module.exports = makeError;
exports.BaseError = BaseError;
