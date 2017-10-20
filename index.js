#!/usr/bin/env node

/* index.js -- Bootstraps the application and starts the pipeline
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from:
 *  - Marco Vito Moscaritolo (@mavimo)
 *  - Philipp Mandler (phl.mn)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

var Config = require('./src/Config');
var Verbose = require('./src/Verbose');
var Crawler = require('./src/Crawler');
var Resolver = require('./src/Resolver');
var Transform = require('./src/Transform');
var Substitute = require('./src/Substitute');
var SearchIndex = require('./src/SearchIndex');

var jade = require('pug');
var fs = require('fs');

/*
|--------------------------------------------------------------------------
| BOOTSTRAP
|--------------------------------------------------------------------------
|
| We need to collect configuration and environment information before
| starting the pipeline.
|
*/

// If requested, run the init script and stop the execution here
if(Config.shouldRunInit()) {
  require('./init');
  process.exit(0);
}

var config = Config.parse();
Verbose.setLevel(config.verbose);
Verbose.start();
Verbose.status(
  `Nucleus ${require('./package.json').version} has found ${config.files.length} file` +
  ( config.files.length == 1 ? '' : 's') + '.'
);
Verbose.log('');

/*
|--------------------------------------------------------------------------
| CRAWL
|--------------------------------------------------------------------------
|
| Start the parser that crawls the stylesheets for DocBlock annotations.
|
*/

var styles = [];
for(var f in config.files) {
  var file = config.files[f];
  Verbose.spin('Crawling ' + file);
  var style = Crawler.processFile(file);
  styles = styles.concat(style);
}

/*
|--------------------------------------------------------------------------
| RESOLVE
|--------------------------------------------------------------------------
|
| Before we can pass the style information to the views, we first have to
| resolve some mixin generated values, like colors defined my modifiers
| such as lighten or darken.
|
*/

if(config.scssEntry) {
  styles = Resolver.resolveAll(styles, config.scssEntry);
}

/*
|--------------------------------------------------------------------------
| TRANSFORM
|--------------------------------------------------------------------------
|
| Prepare the styleguide data for view generation.
|
*/

Verbose.spin('Analyzing styles');
styles = Substitute.injectConfig(config).process(styles);
var styleguides = Transform.forView(styles);

Verbose.spin('Creating search index');
var searchIndex = SearchIndex.create(styleguides);

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
|
| Generate the view files.
|
*/

Verbose.spin('Generating files');

// Create the target folder
require('mkdirp').sync(config.target);

// Build the template files
var templateFiles = ['atoms', 'molecules', 'index', 'nuclides', 'structures'];
for(var t in templateFiles) {
  Verbose.spin('Generating files');
  var html = jade.renderFile(config.template.replace(/\/$/, '')+'/'+templateFiles[t]+'.pug', {
    styles : styleguides,
    index: searchIndex,
    meta: {
      css: config.css,
      title: config.title,
      namespace: config.namespace,
      counterCSS: config.counterCSS,
      scripts: config.scripts,
      demo: !!config.demo
    }
  });
  require('fs').writeFileSync('./'+config.target+'/'+templateFiles[t]+'.html', html);
}

// Copy assets
if(config.target !== 'build') {
require('mkdirp').sync(config.target + '/styles');
require('mkdirp').sync(config.target + '/fonts');
require('mkdirp').sync(config.target + '/scripts');

fs
  .writeFileSync(config.target + '/styles/app.css',
    fs.readFileSync(__dirname + '/build/styles/app.css'));
fs
  .writeFileSync(config.target + '/scripts/app.js',
    fs.readFileSync(__dirname + '/build/scripts/app.js'));
fs
  .writeFileSync(config.target + '/favicon.ico',
    fs.readFileSync(__dirname + '/build/favicon.ico'));
fs
  .writeFileSync(config.target + '/fonts/SG-icons.eot',
    fs.readFileSync(__dirname + '/build/fonts/SG-icons.eot'));
fs
  .writeFileSync(config.target + '/fonts/SG-icons.ttf',
    fs.readFileSync(__dirname + '/build/fonts/SG-icons.ttf'));
fs
  .writeFileSync(config.target + '/fonts/SG-icons.woff',
    fs.readFileSync(__dirname + '/build/fonts/SG-icons.woff'));

}

/*
|--------------------------------------------------------------------------
| THANKS FOR YOUR ATTENTION
|--------------------------------------------------------------------------
*/

Verbose.finished();
