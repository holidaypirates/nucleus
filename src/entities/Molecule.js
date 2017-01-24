/* Molecule.js -- Transforms raw style information into a molecule object
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

var Entity = require('./Entity');

var Molecule = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  // Set molecule-specific entity properties
  this.type = "Molecule";
  this.fillable = ['molecule', 'section', 'description', 'modifiers', 'markup', 'deprecated','script'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  return {
    name: this.getName(),
    type: 'molecule',
    descriptor: raw.descriptor,
    section: 'Molecules > ' + this.getSection(),
    description: raw.annotations.description,
    modifiers: this.getModifiers(),
    markup: raw.annotations.markup,
    script: raw.annotations.script || false,
    deprecated: raw.annotations.deprecated,
    hash: this.hash(),
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

module.exports = Molecule;
