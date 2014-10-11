# make-error

[![Build Status](https://img.shields.io/travis/julien-f/js-make-error/master.svg)](http://travis-ci.org/julien-f/js-make-error)
[![Dependency Status](https://david-dm.org/julien-f/js-make-error/status.svg?theme=shields.io)](https://david-dm.org/julien-f/js-make-error)
[![devDependency Status](https://david-dm.org/julien-f/js-make-error/dev-status.svg?theme=shields.io)](https://david-dm.org/julien-f/js-make-error#info=devDependencies)

> Make your own error types!


## Features

- Compatible Node & browsers
- `instanceof` support
- `error.name` & `error.stack` support

## Installation

### Node

Installation of the [npm package](https://npmjs.org/package/make-error):

```
> npm install --save make-error
```

Then require the package:

```javascript
var makeError = require('make-error');
```

### Browser

Clone the git repository and compile the browser version of the
library:

```
> git clone https://github.com/julien-f/js-make-error.git
> npm install
> npm run browserify
```

Then import the script `make-error.js` which has been compiled in the
`dist/` directory:

```html
<script src="make-error.js"></script>
```

## Usage

```javascript
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
