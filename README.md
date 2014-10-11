# make-error

[![Build Status](https://img.shields.io/travis/julien-f/js-make-error/master.svg)](http://travis-ci.org/julien-f/js-make-error)
[![Dependency Status](https://david-dm.org/julien-f/js-make-error/status.svg?theme=shields.io)](https://david-dm.org/julien-f/js-make-error)
[![devDependency Status](https://david-dm.org/julien-f/js-make-error/dev-status.svg?theme=shields.io)](https://david-dm.org/julien-f/js-make-error#info=devDependencies)

> Makes a function behaves as a method.


## Install

Download [manually](https://github.com/julien-f/js-make-error/releases) or with package-manager.

#### [npm](https://npmjs.org/package/make-error)

```
npm install --save make-error
```

## Usage

```javascript
var makeError = require('make-error');

function CustomError() {
  CustomError.super.call(this, 'custom error message');
}
makeError(CustomError);

function SpecializedCustomError() {
  SpecializedCustomError.super.call(this);
}
makeError(SpecializedCustomError, CustomError);
```

## Contributions

Contributions are *very* welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/julien-f/js-make-error/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](http://julien.isonoe.net)
