/* Transform.js -- Resolves annotation blocks into entity objects
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *  - Ryan Potter (www.ryanpotter.co.nz)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

var Verbose = require('./Verbose');
var Nuclide = require('./entities/Nuclide');
var Color = require('./entities/Color');
var Mixin = require('./entities/Mixin');
var Atom = require('./entities/Atom');
var Icon = require('./entities/Icon');
var Molecule = require('./entities/Molecule');
var Structure = require('./entities/Structure');

var Dot = require('dot-object');

var Transform = {};

/**
 * Calls the transformation for every style and sorts it into
 * groups expected by the view.
 *
 * @param  {object} styles
 *         Raw styles information from the crawler.
 * @return {object}
 *         Transformed view data.
 */
Transform.forView = function(styles) {
  var viewData = {};
  var dot = new Dot(' > ');

  for (var s in styles) {
    Verbose.spin('Analyzing styles');
    var style = styles[s];
    var entity = this.createEntity(style);

    // If entity is empty, we cold not specify a type or
    // validation failed during entity instantiation.
    if (!entity || (Object.keys(entity).length === 0)) {
      continue;
    }

    // Pick the section or create it, if not defined yet.
    // TODO: _e is a bad idea!!
    // TODO: Extract!
    var section = dot.pick(entity.section, viewData) || {
      '_e': []
    };
    section._e.push(entity);
    dot.copy('data', entity.section, {
      data: section
    }, viewData);
  }

  return viewData;
};

/**
 * Returns the type of the style.
 *
 * @param  {object} style
 * @return {string}
 */
Transform.getStyleType = function(style) {
  // Loop through the available type annotations and check if the style
  // has one of these. If there's more than one, show a warning.
  var typeAnnotations = [
    'color', 'mixin', 'nuclide',
    'atom', 'icon', 'molecule', 'structure'
  ];

  var foundType = null;
  for (var t in typeAnnotations) {
    if (this.hasAnnotation(typeAnnotations[t], style)) {

      // Do we have multiple style type annotations?
      if (foundType !== null) {
        Verbose.warn('multiple_types', [style]);
      }

      foundType = typeAnnotations[t];
    }
  }

  // Whow warning, if no type has been found.
  if (foundType === null) {
    Verbose.warn('no_type_annotation', [style]);
  }

  return foundType;
};

/**
 * Returns whether a style has a given annotation.
 *
 * @param  {string}  key
 * @param  {object}  style
 * @return {Boolean}
 *         Returns true if the annotation exists.
 */
Transform.hasAnnotation = function(key, style) {
  return Object.keys(style.annotations).indexOf(key) !== -1;
};

/**
 * Creates an Entity-Object out of raw style data.
 *
 * @param  {[type]} style [description]
 * @return {[type]}       [description]
 */
Transform.createEntity = function(style) {
  switch (this.getStyleType(style)) {
    case 'color':
      return new Color(style);
    case 'mixin':
      return new Mixin(style);
    case 'atom':
      return new Atom(style);
    case 'icon':
      return new Icon(style);
    case 'molecule':
      return new Molecule(style);
    case 'structure':
      return new Structure(style);
    case 'nuclide':
      return new Nuclide(style);
    default:
      // TODO: Is this possible? Maybe resolve the
      // anti-pattern then.
      console.log("Skipping unknown entity type.");
  }
  return false;
};

module.exports = Transform;
