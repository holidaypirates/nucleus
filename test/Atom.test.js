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
        markup: '...',
        script: '....'
      }
    });

    assert.deepEqual(a, {
        name: 'Test-Component',
        type: 'atom',
        hash: '47edcec9fa48df43335b12fc0e3e1cc9a4709bf1',
        descriptor: '.test',
        location: 'atoms.html',
        section: 'Atoms > Other',
        description: 'A test description',
        modifiers: null,
        markup: '...',
        script: '....',
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
        script: '...',
        deprecated: true
      }
    });

    assert.deepEqual(a, {
        name: 'Test-Component',
        type: 'atom',
        hash: '1af43675b26c728f36bb88af3dcabdc7c0dc9a35',
        descriptor: '.test',
        location: 'atoms.html',
        section: 'Atoms > Other',
        description: 'A test description',
        modifiers: null,
        markup: '...',
        script: '...',
        deprecated: true
    });
  });

});
