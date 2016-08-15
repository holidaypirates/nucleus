/* infos.js -- Collection of info message generators
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* global process */

'use strict';

var chalk = require('chalk');

module.exports = {
  'init_target': function() {
    return {
      'title': 'Where shall I put the generated styleguide?',
      'text': 'Recommended is a subdirectory relative to the current working directory ' +
        '(' + process.cwd() + '). The default is ' + chalk.underline('styleguide') + '.'
    };
  },
  'init_namespace': function() {
    return {
      'title': 'Should I wrap the markup in a namespace?',
      'text': 'If you\'ve got all your styles inside a namespace class, state '+chalk.underline('yes')+'. ' +
      'If you\'re not sure, go with '+ chalk.underline('no')+'. The default is ' + chalk.underline('no') + '.'
    };
  },
  'init_files': function() {
    return {
      'title': 'Which files shall I look for?',
      'text': 'Pass in a glob of SCSS files that should be processed. You may give multiple globs, separated by comma. ' +
        '(Btw, current dir is ' + process.cwd() + '). The default is ' + chalk.underline('*.scss, **/*.scss') +
        ' - all SCSS files in this directory and all subdirectories.'
    };
  },
  'init_css': function() {
    return {
      'title': 'What\'s the name of your transpiled css file?',
      'text': 'In order to have a preview of your components, I need to include the \'transpiled\' CSS. ' +
        'Could be a relative path, but better is an absolute URL. The default is ' + chalk.underline('none') +
        ', but please specify.'
    };
  }
};
