/* Resolver.js -- Resolves calculated values, e.g. from color mixins
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

/** Dependencies */
const Verbose = require('./Verbose');
const _ = require('lodash');
const sass = require('node-sass');

/** Instantiation */
const Resolver = {};

Resolver.resolveAll = function (styles) {
  const colorsDummyCss = [];

  // Generate dummy css code that we can pipe through
  // preprocessors to generate computed values from
  _.forEach(styles, (style) => {
    // If it's not a color, continue
    if(!style.annotations.color) {
      return;
    }

    colorsDummyCss.push(this.generateDummyCode(style));
  });

  // Pass the dummy code to SASS and get computed values
  const processedCss = sass.renderSync({
    data: colorsDummyCss.join(' '),
    outputStyle: 'compressed'
  }).css.toString();

  // Bring the resulting CSS into a JSON structure
  const colorsJson = this.cssToJson(processedCss);

  // Iterate again over all the colors and attach
  // computed values to it.
  _.forEach(styles, (style) => {
    // If it's not a color, continue
    if(!style.annotations.color) {
      return;
    }

    const color = style.element.prop;
    const original = style.element.value;

    if(colorsJson[color]) {
      style.computed = true;
      style.originalValue = original;
      style.element.value = colorsJson[color];
    }
  });

  return styles;
};

Resolver.generateDummyCode = function (style) {
  // Strip the dollar sign from the variable name
  const property = style.element.prop.replace(/^\$/, '');
  const value = style.element.value;

  // First, add the color as a variable
  const code = `$${property}: ${value};`;

  // Then, add a dummy class that we can read the
  // processed value from
  return code + `dummy.${property} {color: $${property};}`;
};

Resolver.cssToJson = function (css) {
  css = css
    // Start of class definition is beginning of key string
    .replace(/dummy\./g, '"$')
    // End of class definition is end of value string
    .replace(/}/g, '",')
    // Connect them
    .replace(/{color:/g, '": "')
    // And strip the last comma
    .replace(/,\s*$/, '')
    ;

  return JSON.parse(`{ ${css} }`);
};

module.exports = Resolver;
