/* init.js -- Configuration wizard
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

var Verbose = require('./src/Verbose');
var fs = require('fs');
var prompt = require('prompt-sync')({ sigint: true });
var chalk = require('chalk');

/*
|--------------------------------------------------------------------------
| ASCII LOGO
|--------------------------------------------------------------------------
|
| Because it's geeky
|
*/

Verbose.log(chalk.magenta('                                                                ,╤╣▒▒▒▒▒▒╣╤     '));
Verbose.log(chalk.magenta('                                                              ╓▒▒▒Å╙`  `╙Å▒▒▒╕  '));
Verbose.log(chalk.magenta('                                                             φ▒▒╨    ╓╤-   ╙▒▒Q '));
Verbose.log(chalk.magenta('                                                            ]▒▒∩     É▒▒▒╦  ╙▒▒ε'));
Verbose.log(chalk.magenta('                                                            ]▒▒        ╙▒▒   ▒▒C'));
Verbose.log(chalk.magenta('                                                             ▒▒Q            ║▒▒⌐'));
Verbose.log(chalk.magenta('                                                             "▒▒▒-        ╓╣▒▒` '));
Verbose.log(chalk.magenta('                ╓╣▒▒▒▒▒╣╕                                   ,╩▒▒▒▒▒▒Q╗╗╗╣▒▒▒╨   '));
Verbose.log(chalk.magenta('               ╔▒▒Å   ╙▒▒Q                                ,╣▒▒Å   "╙ÉÉÉÑ╙^      '));
Verbose.log(chalk.magenta('               ╫▒▒     ╫▒▒                              ╓▒▒▒╨                   '));
Verbose.log(chalk.magenta('               \'▒▒▒╦╖╤▒▒▒Q                            ╓▒▒▒╜                    '));
Verbose.log(chalk.magenta('                 `Ñ▒▒▒ÑÉ▒▒▒╕                        ╗▒▒▒`                       '));
Verbose.log(chalk.magenta('                         ╙▒▒▒╤      ,╥╤╦╤╤-      ,╣▒▒Å                          '));
Verbose.log(chalk.magenta('                           "▒▒▒╦╓╣▒▒▒▒▒▀▀▒▒▒▒▒Q╓╣▒▒Å                            '));
Verbose.log(chalk.magenta('                             ⌠▒▒▒▒╙          É▒▒▒▒                              '));
Verbose.log(chalk.magenta('                             ▒▒▒      «▒▒▒▒╦   ╙▒▒Q                             '));
Verbose.log(chalk.magenta('                            ▒▒▒          "Å▒▒Q  `▒▒╦                            '));
Verbose.log(chalk.magenta('                           ]▒▒⌐            └▒▒╕  ╟▒▒                            '));
Verbose.log(chalk.magenta('                           ]▒▒⌐             ╙É`  ║▒▒                            '));
Verbose.log(chalk.magenta('                            ▒▒╣                  ▒▒Å                            '));
Verbose.log(chalk.magenta('                          ╓╪▒▒▒╣               ╓▒▒▒                             '));
Verbose.log(chalk.magenta('                      -╪▒▒▒▒Ñ`Å▒▒Q,          ╓▒▒▒▒                              '));
Verbose.log(chalk.magenta('                  ╓╪▒▒▒▒╨       É▒▒▒▒╣╗╗╗╗╣▒▒▒ÅÑ▒▒▒╤                            '));
Verbose.log(chalk.magenta('  ,╤╣▒▒▒▒Q╕   ╓╪▒▒▒▒╨              `╙╨╨ÑÑ▒▒▒     "▒▒▒╦                          '));
Verbose.log(chalk.magenta(' ╫▒▒Å```╙▒▒▒▒▒▒Å╨                        ╙▒▒ε      `Å▒▒Q                        '));
Verbose.log(chalk.magenta('╣▒▒       ⌠▒▒░                            ▒▒▒         É▒▒╣-                     '));
Verbose.log(chalk.magenta('▒▒▒        ▒▒░                            ]▒▒╕          ╙▒▒▒╕                   '));
Verbose.log(chalk.magenta('╘▒▒╣-    ╓▒▒▒                            ╓▒▒▒▒▒▒Q         ╙▒▒▒╤                 '));
Verbose.log(chalk.magenta('  É▒▒▒▒▒▒▒▒╜                            ╣▒▒`   ╚▒▒╕         "▒▒▒╦               '));
Verbose.log(chalk.magenta('                                        ▒▒Q     ▒▒╡           `Å▒▒Q             '));
Verbose.log(chalk.magenta('                                        ╙▒▒▒╦╥╗▒▒▒               É▒▒╣-          '));
Verbose.log(chalk.magenta('                                          ╙É▒▒Å╨                   ╙▒▒▒╦╣▒▒╣╦   '));
Verbose.log(chalk.magenta('                                                                     ╟▒▒Å╨╙É▒▒▒ '));
Verbose.log(chalk.magenta('                                                                     ▒▒░     ▒▒C'));
Verbose.log(chalk.magenta('                                                                     ▒▒▒,  ,╣▒▒⌐'));
Verbose.log(chalk.magenta('                                                                      ╙▒▒▒▒▒▒Ñ  '));


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function isTruthy ( answer ) {
  return (answer == 'y') || (answer == 'yes');
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
|
| Help creating a configuration file.
|
*/

var prefix = ' - ';

var config = require('./default.nucleus');

Verbose.info('init_files');
config.files = prompt(prefix + chalk.bold.cyan('Files to crawl: '), '')
  .split(',')
  .map(function (item){
    return item.trim();
  });

Verbose.info('init_target');
config.target = prompt(prefix + chalk.bold.cyan('Where should the styleguide be? '), 'styleguide');

Verbose.info('init_css');
config.css = prompt(prefix + chalk.bold.cyan('What\'s the URL of the CSS? '), '');

Verbose.info('init_namespace');
var usingNamespace = prompt(prefix + chalk.bold.cyan('Do you use a CSS namespace (y/n)? '), false);
if(isTruthy(usingNamespace)) {
  config.namespace = prompt(prefix + chalk.bold.cyan('What\'s your namespace selector? '), '');
}

Verbose.log('\n\nHere\'s your config:\n');
console.log(config);
Verbose.log('\n');

var cfgIsOk = prompt(prefix + chalk.bold.cyan('Is that okay (y/n) ? '), 'y');
if(!isTruthy(cfgIsOk)) {
  process.exit(0);
}

fs.writeFileSync('config.nucleus.json', JSON.stringify(config));
Verbose.log('   Wrote config to config.nucleus.json\n\n');

var testRun = prompt(prefix + chalk.bold.cyan('Do you want to do a run now? (y/n) ? '), 'y');
if(isTruthy(testRun)) {
  require('./index');
}


