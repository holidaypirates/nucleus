/* code-preview.js -- Applies PrismJS highlighting to code containers
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
var Prism = require('prismjs');

/** Attachments */
require('prismjs/components/prism-scss');

/** Directive */
$('[data-d-code-preview]').each(function (i, element ) {
  Prism.highlightElement(element);
});
