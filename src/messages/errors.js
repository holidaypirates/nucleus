/* errors.js -- Collection of error message generators
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from:
 *  - Marco Vito Moscaritolo (@mavimo)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* global process */

'use strict';

var chalk = require('chalk');

module.exports = {
  // Whenever there are annotations that are not allowed for certain
  // entity types.
  'invalid_annotaton_for_type': function(key, type, validKeys, raw) {
    return {
      title: 'Annotation ' + chalk.underline('@' + key) +
        ' not allowed for type ' + type + ' of ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
      text: 'Valid annotations are @' + validKeys.join(', @') + '. This element will not appear in the final StyleGuide until you fix this error.'
    };
  },

  // Whenever a section is not a string
  'section_not_string': function(raw) {
    return {
      title: 'The section annotation must be a string for ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
      text: "Maybe you forgot to set a section? By the way, sections can be nested like 'Section1 > Section2 > ...'." +
        "This element will not appear in the final StyleGuide until you fix this error."
    };
  },

  // Whenever there's an entity without any annotations
  'entity_no_annotations': function(raw) {
    return {
      title: 'There are no annotations for ' + chalk.underline(raw.descriptor) + ' in ' + raw.file,
      text: "Wow, that's strange. This element should not be in the pipeline, and will therefore be ignored. " +
        "You could double-check why this got here in the first place."
    };
  },

  'multiple_config_files': function() {
    return {
      'title': 'Don\'t pass multiple configuration files.',
      'text': 'Probably you tried to use the --config parameter along with the shorthand version -c. ' +
        'Only one at a time is valid. Otherwise, I would not know which file to load, and I\'m not good at decision-making.'
    };
  },
  'no_input_files': function() {
    return {
      'title': 'Could not find any input files.',
      'text': 'Double-check the ' + chalk.underline('files') + ' property in the configuration. This should either be a ' +
        'single glob pattern, or an array of patterns. Looks like there are no files matching this pattern. ' +
        'Btw, the current working dir is ' + process.cwd()
    };
  },
  'no_target': function() {
    return {
      'title': 'No target specified.',
      'text': 'Double-check the ' + chalk.underline('target') + ' property in the configuration. This should be a writeable path. ' +
        'Btw, the current working dir is ' + process.cwd()
    };
  },
  'next_node_failed': function() {
    return {
      'title': 'Annotation block without rule.',
      'text': 'There was an annotation block, which is not followed by a CSS rule, variable or mixin. Check the file above. ' +
        'At least, you could add an empty rule.'
    };
  },
  'no_valid_template': function() {
    return {
      'title': 'Template folder is not valid.',
      'text': 'Double-check the ' + chalk.underline('template') + ' property in the configuration. ' +
        'This should be a valid folder with template files to generate a valid styleguide.' +
        'Default template is used. ' +
        'Btw, the current working dir is ' + process.cwd()
    };
  },

};
