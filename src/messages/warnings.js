/* warnings.js -- Collection of warning message generators
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
var chalk = require('chalk');

module.exports = {
  // Whenever there are annotations that are not allowed for certain
  // entity types.
  'invalid_annotaton_for_type': (key, type, validKeys, raw) => ({
    title: 'Annotation ' + chalk.underline('@' + key) +
      ' not allowed for type ' + type + ' of ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
    text: 'Valid annotations are @' + validKeys.join(', @') + '. This element will not appear in the final StyleGuide until you fix this error.'
  }),

  // Whenever the @section annotation starts or ends with the separation char '>'
  'section_delimiter': raw => ({
    title: 'The section must not start or end with \'>\' for ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
    text: "Sections can be nested like 'Section1 > Section2 > ...', thus the '>' character is not allowed at the beginning or the end of the annotation value. " +
      "I will trim this for you, but please fix the error."
  }),

  // Whenever a section is not a string
  'section_not_string': raw => ({
    title: 'The section annotation must be a string for ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
    text: "Maybe you forgot to set a section? By the way, sections can be nested like 'Section1 > Section2 > ...'." +
      "This element will not appear in the final StyleGuide until you fix this error."
  }),

  // An entity should not have multiple types annotated.
  'multiple_types': style => ({
    'title': 'Multiple style type annotations for ' + style.descriptor,
    'text': 'The style in file ' + chalk.underline(style.file) + ' has more than one type annotation. ' +
      'It should only have one of: @nuclide, @color, @mixin, @atom, @icon, @molecule, @structure.'
  }),

  // Whenever a DocBlock is missing a type annotation.
  'no_type_annotation': style => ({
    'title': 'No type for DocBlock in ' + chalk.underline(style.file) + ' on line ' + style.element.source.start.line,
    'text': 'You need to specify at least the type of the element. Possible types are @nuclide (with @color and @mixin as special types), ' +
      '@atom (with @icon as special type), @molecule and @structure.'
  }),

  // Whenever an undefined interpolation method is used.
  'invalid_substitution': interpolation => ({
    'title': 'Unknown substitution command ' + interpolation,
    'text': ''
  }),

  // Whenever we try to substitute with unknown selector markup.
  'unknown_selector': selector => ({
    'title': 'Can\'t find selector ' + selector + ' for markup substitution',
    'text': 'You try to substitute with @{include:' + selector + '}, but ' + selector + ' cannot be found. ' +
      'Make sure ' + selector + ' really exists and it is annotated (which makes it \'visible\' for Nucleus.'
  }),
};
