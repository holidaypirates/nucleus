/* Color.js -- Transforms raw style information into a color object
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from:
 *  - Chris Tarczon (@tarczonator)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

var Entity = require('./Entity');
var ColorConverter = require('color');

var Color = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  // Set color-specific entity properties
  this.type = "Color";
  this.fillable = ['color', 'section', 'description', 'deprecated'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  // Single-line annotation block means @color is the description.
  if (!raw.annotations.description) {
    raw.annotations.description = raw.annotations.color;
  }

  var colorValue = ColorConverter(raw.element.value.replace(/ *!default/, ''));

  return {
    name: raw.descriptor,
    descriptor: raw.descriptor,
    type: 'color',
    section: 'Nuclides > Colors > ' + this.getSection(),
    description: raw.annotations.description,
    deprecated: raw.annotations.deprecated,
    location: 'nuclides.html',
    hash: this.hash(),
    values: {
      hex: colorValue.hexString(),
      rgba: colorValue.rgbaString(),
      darker: colorValue.darken(0.1).hexString()
    }
  };

};

Color.prototype = Object.create(Entity.prototype);

module.exports = Color;
