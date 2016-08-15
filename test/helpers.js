'use strict';

var Helpers = {
  'logCalled': 0,
  'exitCalled': 0
};

Helpers.log = function( content ) {
  Helpers.logCalled++;
  // console.log(content);
};
Helpers.exit = function() {
  Helpers.exitCalled++;
};

Helpers.hook = function(verboseObject, method) {
  Helpers[(method + 'Called')] = 0;
  verboseObject[method] = Helpers[method];
};

module.exports = Helpers;
