/* search-box-trigger.js -- Hides and shows the search box on click / key press
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
var keymaster = require('keymaster');

/** Directive */
var SearchBoxTriggerDirective = {};

SearchBoxTriggerDirective.init = function(element) {

  this.isVisible = false;

  keymaster.filter = function () { return true; };

  // Show the search box
  $(element).on('click', $.proxy(this.showSearch, this));

  keymaster('shift+alt+f', $.proxy(this.toggleSearch, this));

  // Hide on click
  $('.SG-search__overlay').on('click', $.proxy(this.hideSearch, this));

  // Hide on escape
  var _this = this;
  $(document).on("keydown", this, function(e) {
    var keycode = ((typeof e.keyCode != 'undefined' && e.keyCode) ? e.keyCode : e.which);
    if (keycode === 27) {
      _this.hideSearch();
    }
  });
};

SearchBoxTriggerDirective.hideSearch = function () {
  this.isVisible = false;
  $('.SG-search').hide();
};

SearchBoxTriggerDirective.showSearch = function () {
  this.isVisible = true;
  $('.SG-search').show();
  $('.selectize-input input').focus();
  event.stopPropagation();
  return false;
};

SearchBoxTriggerDirective.toggleSearch = function () {
  if(!this.isVisible) {
    return this.showSearch();
  }
  return this.hideSearch();
};

$('[data-d-search-box-trigger]').each(function (index, element){
  SearchBoxTriggerDirective.init(element);
});
