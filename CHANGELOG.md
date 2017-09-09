```
  ____ _                            _
 / ___| |__   __ _ _ __   __ _  ___| | ___   __ _
| |   | '_ \ / _` | '_ \ / _` |/ _ \ |/ _ \ / _` |
| |___| | | | (_| | | | | (_| |  __/ | (_) | (_| |
 \____|_| |_|\__,_|_| |_|\__, |\___|_|\___/ \__, |
                         |___/              |___/

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.1.1                                                   04.05.2017 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Bugfixes
--------

* Remove !default from color variables before parsing (thanks Chris Tarczon).

* Documentation fixes from pieplu, cheers!

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.1.0                                                   24.01.2017 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Features
--------

* Added support for LESS - you are even able to pass both SASS/SCSS and LESS
  files to Nucleus at the same time.

* Added version console output

Bugfixes
--------

* Show warning if substitution attempt with unknown selector and return empty
  string instead of 'undefined'.

* Lots of documentation typo fixes and small style fixes for both Nucleus
  and the docs.
* Added support for @script annotations (shout-out to jcfariadias,
  pieplu and Joao Dias).

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.9                                                   16.12.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Features
--------

* Added support for @modifier flag (thanks again, Ryan Potter).

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.8                                                   16.11.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Announcement
------------

* We are actively developing 1.1.0 with support for LESS and Mixin-Defined
  colors, as well as ES 6 syntax and better error handling. Stay tuned!

Features
--------

* Added Config for alternative placeholder services (thanks Ryan Potter).

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.7                                                   30.08.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Features
--------

* Support multiple CSS includes when configured as array of paths.

Bugfixes
--------

* Fix 'false' being print as description if no description is present in the
  DocBlock of the element.

* Fix statically generated placeholder texts printing "undefined" after a
  certain amount of words.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.6                                                   23.08.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Bugfixes
--------

* Fix mixin parsing failing on mixin definitions without parameter list

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.5                                                   23.08.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Bugfixes
--------

* Fix crawler failing on files with Windows line endings

* Fix lipsum quantity not being applied

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.4                                                   17.08.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Thanks for all the positiv feedback and ideas how we could improve this project.
This version includes various small fixes, but mainly:

Bugfixes
--------

* Fix header reflection being positioned absolutely instead of relatively (#1)

* Fix init script not working

* Documentation fixes and typos

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ VERSION 1.0.0                                                   15.08.2016 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎉 Here we are. 🚀

We hope you will love it as much as we do and it will change the way you develop styles.

If you also like to hack with us, check out the job offers on http://www.holidaypirates.com/pages/jobs .

```
