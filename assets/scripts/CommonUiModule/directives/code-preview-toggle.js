/* code-preview-toggle.js -- Handles opening and closing of the markup preview
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

/** Directive */
$('[data-d-code-preview-toggle]').each(function (i, element ) {
  $(element).on('click', function () {
    $(element)
      .closest('.SG-component')
      .find('.SG-component__markup, .SG-code__title')
      .stop()
      .clearQueue()
      .slideToggle(250);
  });
});
