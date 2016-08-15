/* Verbose.js -- Output layer
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
var wrap = require('wordwrap')(80);
var prettyjson = require('prettyjson');

var Verbose = {
  LEVELS: {
    SILENT: 0,
    ERROR: 1,
    DEFAULT: 2,
    DEBUG: 3
  },
  level: 2,
  spinner: require('ora')({
    spinner: {
      "interval": 100,
      "frames": [
        " 🕐 ", " 🕑 ", " 🕒 ", " 🕓 ", " 🕔 ", " 🕕 ", " 🕖 ", " 🕗 ", " 🕘 ", " 🕙 ", " 🕚 "
      ]
    },
  }),
  ERRORS: require('./messages/errors'),
  WARNINGS : require('./messages/warnings'),
  INFOS : require('./messages/infos'),
};

Verbose.log = function (text) {
  if(this.level < this.LEVELS.DEFAULT) return;
  console.log(text);
};

Verbose.exit = function (status) {
  process.exit(status);
};

Verbose.status = function ( text ) {
  if(this.level < this.LEVELS.DEFAULT) return;
  this.log(chalk.blue(this.wordwrap(text)));
};

Verbose.debug = function ( data ) {
  if(this.level >= this.LEVELS.DEBUG) {
    this.log('\n');

    // Pretty-print JSONs
    if(typeof data === 'object') {
      data = prettyjson.render(data, {
        keysColor: 'cyan'
      });
    }
    this.log(data);
  }
};

Verbose.warn = function (warning, data) {
  // Check verbosity level
  if(this.level < this.LEVELS.DEFAULT) return;

  var w = this.WARNINGS[warning];
  if(!w) w = function () { return {
    'title' : warning, 'text' : undefined
  };};
  w = w.apply(null, data);

  this.log("\n\n " + chalk.yellow.bold("Take care!") + " " + chalk.bold(w.title));

  if(w.text) {
    this.log(chalk.dim(this.wordwrap(w.text)) + '\n');
  }
};

Verbose.info = function (info, data) {
  if(this.level >= this.LEVELS.DEFAULT) {

    var i = this.INFOS[info];
    if(!i) i = function () { return {
      'title' : info, 'text' : undefined
    };};
    i = i(data);

    this.log("\n " + chalk.cyan.bold("Info:") + " " + chalk.bold(i.title) + "\n");

    if(i.text) {
      this.log(chalk.dim(this.wordwrap(i.text)) + '\n');
    }
  }
};

Verbose.critical = function (error, data) {
  Verbose.error(error, data, true);
};

Verbose.error = function ( error, data, critical ) {

  var e = this.ERRORS[error];
  if(!e) e = function () { return {
    'title' : error, 'text' : undefined
  };};
  e = e.apply(null, data);

  if(this.level >= this.LEVELS.ERROR) {
    this.log("\n " + chalk.red.bold("Whoops!") + " " + chalk.bold(e.title) + "\n");

    if(e.text) {
      this.log(chalk.dim(this.wordwrap(e.text)) + '\n');
    }
  }

  if(critical) this.exit(1);
};

Verbose.spin = function ( text ) {
  if(this.level < this.LEVELS.DEFAULT) return;
  this.spinner.text = text;
  this.spinner.start();
};

/**
 * Starts the execution timer and prints an empty line.
 */
Verbose.start = function () {
  this.log('');
  this.startTime = process.hrtime();
};

/**
 * Outputs the final message with a duration notice.
 *
 * @param  {hrtime} startTime
 *         The hrtime object that was started at the beginning of the script.
 */
Verbose.finished = function () {
  if(this.level >= this.LEVELS.DEFAULT) {
    var seconds = process.hrtime(this.startTime)[0];
    this.log('\n ' + chalk.green('Finished!') + ' ' +
      chalk.dim('Took me ' +  seconds + ' second' + (seconds !== 1 ? 's' : '') + '.\n'));
  }
  this.exit(0);
};

/**
 * Sets the max level of the allowed verbose output.
 *
 * @param {int} verboseLevel
 *        An element of Verbose.LEVELS
 */
Verbose.setLevel = function (verboseLevel) {
  this.level = verboseLevel;
};

/**
 * Gracefully wraps the text at a fixed column.
 *
 * @param  {string} text
 *         Block of text to wrap.
 * @return {string}
 *         Gracefully word-wrapped text.
 */
Verbose.wordwrap = function ( text ) {
  return ' ' + wrap(text).split('\n').join('\n ').trim();
};




module.exports = Verbose;
