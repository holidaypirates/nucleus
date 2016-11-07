/* Config.js -- Reads and validates parameters from config file or CLI
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from:
 *  - Marco Vito Moscaritolo (@mavimo)
 *  - Ryan Potter (www.ryanpotter.co.nz)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* global process */
/* global __dirname */

'use strict';

var fs = require('fs');
var merge = require('merge');
var argv = require('yargs')
            .alias('c', 'config')
            .alias('v', 'verbose')
            .alias('r', 'norandom')
            .argv;

var Verbose = require('./Verbose');

var Config = {};

/**
 * Gathers the configuration.
 *
 * First checks the default settings, then a config file, and last
 * the CLI arguments.
 *
 * @return {object}
 *         The configuration JSON with all known information.
 */
Config.parse = function () {
  var defaultConfig = require('../default.nucleus.json');
  defaultConfig.template = __dirname + '/../assets/views';

  var config = defaultConfig;

  // Are we allowed to talk at all?
  if(argv.silent) {
    Verbose.setLevel(Verbose.LEVELS.SILENT);
  }

  // Has a config file been specified?
  var configFile = 'config.nucleus.json';
  if(argv.config) {
     configFile = argv.config;

    // We only accept one option!
    if(typeof configFile === 'object') {
      Verbose.error("multiple_config_files");
    }
  }

  var userConfig;
  try {
    userConfig = require(process.cwd() + '/' + configFile);
  } catch(e) {
    userConfig = {};
  }
  config = merge(true, defaultConfig, userConfig);

  // CLI arguments have more priority than user config file
  config = merge(config, this.getFromArguments());

  // If only one CSS file string is set to be included, wrap it in an
  // array to qualify looping
  if(typeof config.css === 'string') {
    config.css = [config.css];
  }

  // If only one glob pattern is configured, wrap it in an array
  // to qualify the loop.
  if(typeof config.files === 'string') {
    config.files = [config.files];
  }

  // Collect all files that match the glob patterns
  var files = [];
  for(var g in config.files) {
    files = files.concat(this.getFilesFromGlob(config.files[g]));
  }

  // No files, no styleguide !
  if(files.length === 0) {
    Verbose.error('no_input_files');
  }

  // No target, no styleguide !
  if(config.target === null) {
    Verbose.error('no_target');
  }

  // No valid template folder, no styleguide !
  try {
    fs.accessSync(config.template, fs.F_OK);
  } catch (e) {
    config.template = __dirname + '/../assets/views';
    Verbose.error('no_valid_template');
  }

  config.files = files;
  return config;
};

/**
 * Returns a set of files from a Glob string.
 *
 * @param  {string} glob
 *         Glob pattern
 * @return {array}
 *         Array of file names
 */
Config.getFilesFromGlob = function ( glob ) {
  return require('glob').sync(glob);
};

Config.getFromArguments = function () {
  var cliConfig = {};
  if(argv._.length !== 0) {
    cliConfig.files = argv._;
  }

  if(argv.verbose)              cliConfig.verbose = argv.verbose;
  if(argv.target)               cliConfig.target = argv.target;
  if(argv.title)                cliConfig.title = argv.title;
  if(argv.css)                  cliConfig.css = argv.css;
  if(argv.template)             cliConfig.template = argv.template;
  if(argv.placeholderservice)   cliConfig.placeholderService = argv.placeholderservice;
  if(argv.norandom)             cliConfig.staticLipsum = !!argv.norandom;

  return cliConfig;
};

Config.shouldRunInit = function () {
  if(argv._ && argv._.length) {
    return argv._[0] == 'init';
  }
  return false;
};

module.exports = Config;
