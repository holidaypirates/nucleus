/* Nuclide.js -- Transforms raw style information into a nuclide object
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

var Nuclide = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  this.type = "Nuclide";
  this.fillable = ['nuclide', 'section', 'description', 'deprecated'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  // Single-line annotation block means @nuclide is the description.
  if (!raw.annotations.description) {
    raw.annotations.description = raw.annotations.nuclide;
  }

  return {
    name: raw.descriptor,
    value: raw.element.value,
    type: 'nuclide',
    descriptor: raw.descriptor,
    section: 'Nuclides > ' + this.getSection(),
    description: raw.annotations.description,
    deprecated: raw.annotations.deprecated,
    location: 'nuclides.html',
    hash: this.hash(),
  };

};

Nuclide.prototype = Object.create(Entity.prototype);

module.exports = Nuclide;
