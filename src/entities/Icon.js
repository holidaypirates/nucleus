/* Icon.js -- Transforms raw style information into an icon object
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

var Icon = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  // Set icon-specific entity properties
  this.type = "Icon";
  this.fillable = ['icon', 'section', 'markup', 'description', 'deprecated'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  return {
    name: raw.annotations.icon,
    descriptor: raw.annotations.icon,
    type: 'icon',
    section: 'Atoms > Icons',
    markup: raw.annotations.markup,
    deprecated: raw.annotations.deprecated,
    hash: this.hash(),
    location: 'atoms.html'
  };

};

Icon.prototype = Object.create(Entity.prototype);

module.exports = Icon;
