/* global describe */
/* global it */

'use strict';

var assert = require('assert');
var Atom = require('../src/entities/Atom.js');
var Helpers = require('./helpers');
var Verbose = require('../src/Verbose.js');

describe('Atom', function() {

  it('should return nothing if the raw input is not valid', function() {
    Helpers.hook(Verbose, 'log');

    var a = new Atom({});
    assert.deepEqual(a, {});

    assert.ok(Helpers.logCalled >= 1);
  });

  /********************************************************/

  it('should parse the basic information', function() {
    var a = new Atom({
      element: {
        selector: ".test"
      },
      annotations: {
        description: 'A test description',
        atom: 'Test-Component',
        markup: '...'
      }
    });

    assert.deepEqual(a, {
        name: 'Test-Component',
        type: 'atom',
        hash: '7cf4b2beae2f0536b3ebb3030ccef2ed3d89c0fe',
        descriptor: '.test',
        location: 'atoms.html',
        section: 'Atoms > Other',
        description: 'A test description',
        modifiers: null,
        markup: '...',
        deprecated: false
    });
  });

  /********************************************************/

  it('should mark the atom as deprecated', function() {
    var a = new Atom({
      element: {
        selector: ".test"
      },
      annotations: {
        description: 'A test description',
        atom: 'Test-Component',
        markup: '...',
        deprecated: true
      }
    });

    assert.deepEqual(a, {
        name: 'Test-Component',
        type: 'atom',
        hash: 'f7f408f0cf9b50d98473832406bb5ea2b750db2a',
        descriptor: '.test',
        location: 'atoms.html',
        section: 'Atoms > Other',
        description: 'A test description',
        modifiers: null,
        markup: '...',
        deprecated: true
    });
  });

});
