/* search-box.js -- Init and configure selectize
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
var searchItem = require('../templates/search-box-item.html');
var colorPreview = require('../templates/color-preview.html');

/** Attachments */
require('selectize');

/** Helpers */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/** Directive */
var SearchBoxDirective = {};

SearchBoxDirective.init = function(input) {
  $(input).selectize({
    options: window.index,
    searchField: ['name', 'descriptor', 'section'],
    valueField: 'location',
    labelField: 'name',
    openOnFocus: false,
    highlight: false,
    maxOptions: 20,
    closeAfterSelect: true,
    onChange: function (value) {
      window.location.href = value;
      this.clear(true /* silent */);
      $('.SG-search').hide();
    },
    render: {
      option: function(item, escape) {
        return searchItem({
          name: escape(item.name),
          preview: SearchBoxDirective.getPreview(item),
          descriptor: escape(item.descriptor),
          section: escape(item.section),
          type: escape(capitalizeFirstLetter(item.type))
        });
      }
    },
  });
};

SearchBoxDirective.getPreview = function (item) {
  if(item.type === 'color') {
    return colorPreview({
      color: item.style.values.hex,
      darker: item.style.values.darker
    });
  }

  if(item.type === 'icon') {
    return '<div class="SG-ico-preview">' + item.style.markup + '</div>';
  }

  return '<p class="SG-p">' + item.description + '</p>';
};


$('[data-d-search-box]').each(function (index, element) {
  SearchBoxDirective.init(element);
});
