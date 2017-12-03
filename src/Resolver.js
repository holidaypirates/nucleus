/* Resolver.js -- Resolves calculated values, e.g. from color mixins
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from:
 *  - Philipp Mandler (phl.mn)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

/** Dependencies */
const Verbose = require('./Verbose');
const _ = require('lodash');
const sassExtract = require('sass-extract');

/** Instantiation */
const Resolver = {};

Resolver.resolveAll = function (styles, scssEntry) {
  // Extract all values from given scss entry
  const extracted = sassExtract.renderSync({
    file: scssEntry
  });

  // Iterate again over all the colors and attach
  // extracted values to it.
  _.forEach(styles, (style) => {
    // If it's not a color, continue
    if(!style.annotations.color) {
      return;
    }

    const color = style.element.prop;
    const original = style.element.value;

    // Lookup color in extracted values.
    const variable = extracted.vars.global[color];

    // Set color to extracted value if found.
    if(variable && variable.type == 'SassColor') {
      style.originalValue = original;
      style.element.value = {
        r: variable.value.r,
        g: variable.value.g,
        b: variable.value.b,
        a: variable.value.a
       };
    }
  });

  return styles;
};

module.exports = Resolver;
