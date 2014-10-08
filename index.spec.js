'use strict';

//====================================================================

var makeError = require('./');
var BaseError = makeError.BaseError;

//--------------------------------------------------------------------

var expect = require('chai').expect;

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

  var e = new MyError('my error message');

  expect(e).to.be.an.instanceof(Error);
  expect(e).to.be.an.instanceof(BaseError);
  expect(e).to.be.an.instanceof(MyError);

  expect(constructorCalled).to.be.true;

  expect(e.name).to.equal('MyError');
  expect(e.message).to.equal('my error message');
  expect(e.stack).is.a.string;
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

  var e = new MyDerivedError('my error message');

  expect(e).to.be.an.instanceof(Error);
  expect(e).to.be.an.instanceof(BaseError);
  expect(e).to.be.an.instanceof(MyBaseError);
  expect(e).to.be.an.instanceof(MyDerivedError);

  expect(e.name).to.equal('MyDerivedError');
  expect(e.message).to.equal('my error message');
  expect(e.stack).is.a.string;
});
