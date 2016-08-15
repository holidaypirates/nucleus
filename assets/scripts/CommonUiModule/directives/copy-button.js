/* copy-button.js -- Provides functionality for markup copy
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
var SweetAlert = require('sweetalert');
var Clipboard = require('clipboard');

/** Directive */
$('[data-d-copy]').each(function (i, element ) {
  var copy = new Clipboard(element);
  copy.on('success', function () {
    SweetAlert({
      title: "Copied!",
      type: "success",
      confirmButtonText: "Cool",
      timer: 1500,
      allowOutsideClick: true
    });
  });

});
