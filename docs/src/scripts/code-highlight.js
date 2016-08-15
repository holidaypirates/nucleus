'use strict';

var Prism = require('prismjs');
require('prismjs/components/prism-scss');

Prism.languages.nucleus = {
  'docblock': {
    pattern: /(^|[^\\])(\/\*\*[\w\W]*?\*\/|\/\/\/.*?(\r?\n|$))/g,
    lookbehind: true,
    inside: {
      'annotation': {
        pattern: /^(\s+\*\s)\@[^\s]+/igm,
        lookbehind: true
      },
    },
  },
};

$('[data-d-code-preview]').each(function(i, element) {
  Prism.highlightElement(element);
});
