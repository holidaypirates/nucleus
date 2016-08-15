/* global describe */
/* global it */

'use strict';

var assert = require('assert');

var Helpers = require('./helpers');
var Verbose = require('../src/Verbose.js');
var Transform = require('../src/Transform.js');

describe('Transform', function() {

  /********************************************************/

  describe('#hasAnnotation', function () {

    it('should return true if the style has the annotation', function () {
      assert.equal(Transform.hasAnnotation('color', {annotations: {color: true}}), true);
    });
    it('should return false if the style does not have the annotation', function () {
      assert.equal(Transform.hasAnnotation('test', {annotations: {color: true}}), false);
    });
  });

  /********************************************************/

  describe('#getStyleType', function () {

    it('should return the type of the style', function () {
     assert.equal(Transform.getStyleType({annotations: {'color' : true}}), 'color');
     assert.equal(Transform.getStyleType({annotations: {'mixin' : true}}), 'mixin');
     assert.equal(Transform.getStyleType({annotations: {'structure' : true}}), 'structure');
     assert.equal(Transform.getStyleType({annotations: {'atom' : true}}), 'atom');
     assert.equal(Transform.getStyleType({annotations: {'nuclide' : true}}), 'nuclide');
     assert.equal(Transform.getStyleType({annotations: {'molecule' : true}}), 'molecule');
    });

    it('should return null if the style has an invalid or no type', function () {
      Helpers.hook(Verbose, 'log');

      var styleType = Transform.getStyleType({
        annotations: {'whatever' : true},
        file: 'Test',
        element: {source: {start: {line:1}}}
      });

      assert.equal(styleType, null);
      assert.ok(Helpers.logCalled >= 1);
    });

    it('should throw an error if the style has multiple types', function () {
      Helpers.hook(Verbose, 'log');

      var styleType = Transform.getStyleType({annotations: {'color' : true, 'nuclide' : true}});

      assert.equal(styleType, 'nuclide');
      assert.equal(Helpers.logCalled, 2); // Multi-line text
    });

  });

});
