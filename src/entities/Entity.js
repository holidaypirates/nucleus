/* Entity.js -- Foundation for entity transformers
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

var Verbose = require('../Verbose');
var hash = require('json-hash');

var Entity = function(raw) {
  this.raw = raw;
  this.type = 'Generic';
  this.fillable = [];

  this.raw.descriptor = this.getDescriptor();

  this.setDefaultValues();
};

/**
 * Checks the incoming raw style data for common mistakes.
 *
 * @return {bool}
 *         Returns true if the style is solid enough for further processing.
 */
Entity.prototype.validate = function() {
  // Check if we at least have annotations.
  if (!this.raw.annotations) {
    Verbose.error('entity_no_annotations', [this.raw]);
    return false;
  }

  // Check if all the annotations are allowed for this type
  for (var key in this.raw.annotations) {
    if (this.fillable.indexOf(key) === -1) {
      Verbose.warn('invalid_annotaton_for_type', [key, this.type, this.fillable, this.raw]);
      return false;
    }
  }

  // Check for edge-cases that would break the processing
  // Set section if not defined
  if (this.raw.annotations.section === undefined) {
    this.raw.annotations.section = "Other";
  }

  // Section should be nothing else than a string
  if (typeof this.raw.annotations.section !== 'string') {
    Verbose.error('section_not_string', [this.raw]);
    return false;
  }

  // Section should not start or end with a '>' separator
  if ((this.raw.annotations.section[0] === '>') ||
    (this.raw.annotations.section.slice(-1)[0] === '>')) {
    Verbose.warn('section_delimiter', [this.raw]);
  }

  // Set some default values
  this.setDefaultValues();

  return true;
};

/**
 * Sets some default values for allowed annotations.
 *
 * @return null
 */
Entity.prototype.setDefaultValues = function() {
  if(this.fillable.indexOf('description') !== -1) {
    this.raw.annotations.description = this.raw.annotations.description || '';
  }
  if(this.fillable.indexOf('deprecated') !== -1) {
    this.raw.annotations.deprecated = this.raw.annotations.deprecated || false;
  }
};

/**
 * Cleans and trims the section value from leading / trailing spaces an '>'.
 *
 * @return {string}
 */
Entity.prototype.getSection = function() {
  return this.raw.annotations.section
    .trim()
    .replace(/(^\>[ ]*|[ ]*\>$)/g, '');
};

/**
 * Returns the name of the element the entity refers to. This could be a
 * selector, a property or a mixin.
 *
 * @return {string}
 */
Entity.prototype.getDescriptor = function() {
  return this.raw.element ?
    this.raw.element.prop ||
    this.raw.element.selector ||
    this.raw.element.params || 'unknown' : 'unknown';
};

/**
 * Returns an array based on new lines for formatting.
 *
 * @returns {*}
 */
Entity.prototype.getModifiers = function () {
  // Check for a modifier annotation.
  if (typeof this.raw.annotations.modifiers !== 'undefined' && this.raw.annotations.modifiers !== null) {
    const modifiers        = this.raw.annotations.modifiers;
    const modifiersArray   = modifiers.split('\n');
    let formattedModifiers = []; // the container array for final output.
    /**
     * Loop through the modifier annotation, and
     * return the class names and descriptions as
     * an array for formatting.
     */
    modifiersArray.map((value) => {
      let modifier;
      /**
       * Check if the modifier has any white space
       * (has a description). Return the appropriate object
       * for formatting.
       */
      if (value.indexOf(' ') >= 0) {
        modifier = {
          class: value.substr(0, value.indexOf(' ')),
          description: value.substr(value.indexOf(' ') + 1),
        };
      } else {
        modifier = {
          class: value,
          description: null,
        };
      }
      // Add to the output array.
      formattedModifiers.push(modifier);
    });
    return formattedModifiers;
  }
  return null;
};

Entity.prototype.hash = function() {
  return hash.digest(this.raw.annotations);
};

module.exports = Entity;
