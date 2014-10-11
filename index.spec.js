'use strict';

//====================================================================

var makeError = require('./');
var BaseError = makeError.BaseError;

//--------------------------------------------------------------------

var expect = require('chai').expect;

//====================================================================

function getCommonLastItems(arr1, arr2, butFirsts) {
  var n = Math.min(arr1.length, arr2.length) - (butFirsts || 0);

  return [
    arr1.slice(-n),
    arr2.slice(-n),
  ];
}

function compareStacks(actual, expected) {
  actual = splitLines(actual);
  expected = splitLines(expected);

  // We want to compare only the beginning (bottom) of the stack and
  // we don't want to compare the first (from head) two items.
  var tmp = getCommonLastItems(actual, expected, 2);
  actual = tmp[0];
  expected = tmp[1];

  expect(actual).to.deep.equal(expected);
}

var NL_RE = /\r?\n/;
function splitLines(str) {
  return String(str).split(NL_RE);
}

//====================================================================

it('creates a new error class', function () {
  var constructorCalled;

  function MyError(message) {
    expect(MyError.super).to.equal(BaseError);
    expect(MyError.super_).to.equal(BaseError);

    MyError.super.call(this, message);
    constructorCalled = true;
  }
  makeError(MyError);

  var e = new MyError('my error message'); var stack = new Error().stack;

  expect(e).to.be.an.instanceof(Error);
  expect(e).to.be.an.instanceof(BaseError);
  expect(e).to.be.an.instanceof(MyError);

  expect(constructorCalled).to.be.true;

  expect(e.name).to.equal('MyError');
  expect(e.message).to.equal('my error message');
  expect(e.stack).is.a.string;
  compareStacks(e.stack, stack);
});

it('derives an existing error class', function () {
  function MyBaseError(message) {
    MyBaseError.super.call(this, message);
  }
  makeError(MyBaseError);

  function MyDerivedError(message) {
    expect(MyDerivedError.super).to.equal(MyBaseError);
    expect(MyDerivedError.super_).to.equal(MyBaseError);

    MyBaseError.super.call(this, message);
  }
  makeError(MyDerivedError, MyBaseError);

  var e = new MyDerivedError('my error message'); var stack = new Error().stack;

  expect(e).to.be.an.instanceof(Error);
  expect(e).to.be.an.instanceof(BaseError);
  expect(e).to.be.an.instanceof(MyBaseError);
  expect(e).to.be.an.instanceof(MyDerivedError);

  expect(e.name).to.equal('MyDerivedError');
  expect(e.message).to.equal('my error message');
  expect(e.stack).is.a.string;
  compareStacks(e.stack, stack);
});
