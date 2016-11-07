/* Molecule.js -- Transforms raw style information into a molecule object
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
'use strict';

var Entity = require('./Entity');

var Molecule = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  // Set molecule-specific entity properties
  this.type = "Molecule";
  this.fillable = ['molecule', 'section', 'description', 'markup', 'deprecated', 'flag'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  return {
    name: this.getName(),
    type: 'molecule',
    descriptor: raw.descriptor,
    section: 'Molecules > ' + this.getSection(),
    description: raw.annotations.description,
    markup: raw.annotations.markup,
    deprecated: raw.annotations.deprecated,
    hash: this.hash(),
    flags: this.getFlags(),
    location: 'molecules.html'
  };

};

Molecule.prototype = Object.create(Entity.prototype);

Molecule.prototype.getName = function() {
  if(this.raw.annotations.molecule === true) {
    this.raw.annotations.molecule = "Unnamed";
  }
  return this.raw.annotations.molecule;
};

// TODO: Remove code duplication
Molecule.prototype.getFlags = function() {
  var raw_flags = this.raw.annotations.flag || [];
  var flags = {};
  if(raw_flags.indexOf('full-width') !== -1) {
    flags.fullWidth = true;
  }
  if(raw_flags.indexOf('inline') !== -1) {
    flags.inline = true;
  }
  return flags;
};

module.exports = Molecule;
