# Contributing

Don't forget to add yourself to the list of [contributers](https://github.com/holidaypirates/nucleus/blob/master/CONTRIBUTORS.md).

## Bug reports

New bug report issues should at least contain the following information:

* Affected Nucleus version

* Node version

* NPM version

Also, please provide answers to the following questions:

* Is the bug reliably reproduceable?

* If so, which steps lead to the faulty behaviour?

We attempt to answer every new topic quickly and with interest. Should there be no feedback in return from the creator of the ticket, we keep the right to close the issue after two weeks.

## Feature suggestions

Nucleus is a fairly new project and feature requests are very welcome. Please don't just throw in a random feature suggestion, but try to reason a bit why others would also benefit from this.

## Guidelines

* After editing a file, add your name and _one_ reference (website, twitter, ...) to the file's header. Example:

```
/* ...
 *
 * With contributions from:
 *  - Doctor Manhattan (@drmanhatten)
 *  - Rick (www.rolled.com)
 *
 * ...
 */
```

* The description in the file header should be as short as possible and must not end with a period.

* No log code should be left in webpack-bundled JavaScript.

* All tests must be passed in order to have the changes merged.

## Building Nucleus and the doc pages

To compile the assets for Nucleus, run:

```
npm run build
```

To generate the documentation pages, run:

```
npm run build_docs
```

To run the tests and generate a coverage report, run:

```
npm test
```
