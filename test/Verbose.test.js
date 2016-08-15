/* global describe */
/* global it */

'use strict';

var assert = require('assert');
var Helpers = require('./helpers');
var Verbose = require('../src/Verbose.js');

describe('Verbose', function() {

  describe('#setLevel', function () {

    it('should not print something on silent mode', function () {
      Helpers.hook(Verbose, 'log');
      Verbose.setLevel(Verbose.LEVELS.SILENT);
      Verbose.error("test", []);
      assert.equal(Helpers.logCalled, 0);
    });

  });

});
