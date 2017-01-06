/* Crawler.js -- Scans the PostCSS tree for relevant annotation blocks
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *  - Ryan Potter (www.ryanpotter.co.nz)
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

var Verbose = require('./Verbose');
var postcss = require('postcss');
var syntax = require('postcss-scss');

var Crawler = {};

/**
 * Reads the files content and returns the parsed styleguide information.
 *
 * @param  {string} file
 *         Filename
 * @return {object}
 *         Styleguide information
 */
Crawler.processFile = function ( file ) {
  var fileContent = require('fs').readFileSync(file);

  // Normalize file content to Unix EOLs
  fileContent = fileContent
    .toString()
    .replace(/(?:\r\n|\r|\n)/g, '\n');

  var root = postcss().process(fileContent, {
    syntax: syntax
  }).root;
  return this.processNodes(root.nodes, file);
};

/**
 * Iterates through all nodes and collects annotations and element information.
 * @param  {object} nodes
 *         A postcss nodes collection.
 * @return {object}
 *         Styleguide information
 */
Crawler.processNodes = function ( nodes, file ) {
  var guides = [];

  // Process one node after another
  while(nodes.length !== 0) {
    var node = this.nextNode(nodes);

    // If it's a comment, we take a closer look
    if(this.isDocBlock(node.text)) {
      var annotations = this.parseDocBlock(node.text);
      var element = this.nextNode(nodes);
      guides.push({
        annotations: annotations,
        element: element,
        file: file
      });
    }
  }

  return guides;
};

Crawler.parseDocBlock = function ( docBlock ) {
  var annotations = {};
  var lines = this.removeCommentChars(docBlock).split('\n');

  // Extract and remove the description
  annotations.description = this.getDescription(lines);

  // Iterate through all the lines and parse the annotations
  var annotation;
  var line = lines.shift();
  var lastAnnotationKey = null;

  while(line !== undefined) {
    annotation = this.getAnnotation(line);
    if(annotation){
      annotations = this.addAnnotationByType(annotation, annotations, lastAnnotationKey);

      if(annotation.type !== 'content') {
        lastAnnotationKey = annotation.key;
      }
    }

    line = lines.shift();
  }

  return annotations;
};

/**
 * Returns the first node from a set of nodes, or throws an exception if
 * the set is empty.
 *
 * @param  {array} nodes
 *         The set of nodes
 * @return {mixed}
 *         The first element of the set.
 */
Crawler.nextNode = function ( nodes ) {
  if(nodes.length === 0)
    Verbose.critical("next_node_failed");
  return nodes.shift();
};

/**
 * Checks if a comment text is a DocBlock.
 *
 * @param  {string}  comment
 *         The content of the comment block
 * @return {Boolean}
 *         Returns true if the comment seems like a DocBlock.
 */
Crawler.isDocBlock = function ( comment ) {
  if(!comment) return false;
  return comment.match(/(^|[ ])\*\s\@/gm) !== null;
};

/**
 * Removes all leading and trailing characters that are not part of
 * the annotations.
 *
 * @param  {string} docBlock
 *         The content of the comment block
 * @return {string}
 *         The cleaned content of the comment block
 */
Crawler.removeCommentChars = function ( docBlock ) {
  return docBlock
    .replace(/^(\s+|\*)([ ]|\n|(\*[ ]?))/gm, '') // Leading chars
    .replace(/[ ]+$/gm, ''); // Trailing spaces
};

/**
 * Returns weather the current line is a annotation line or not.
 *
 * @param  {string}  line
 * @return {Boolean}
 */
Crawler.isAnnotationLine = function (line) {
  return line.match(/^\@[\w]+/) !== null;
};

/**
 * If a description is present on the DocBlock, return it and remove the
 * lines from the input lines array.
 *
 * @param  {array} docBlockLines
 *         An array of all the lines of the DocBlock
 * @return {string|boolean}
 *         Returns the description, if there was any, otherwise false.
 */
Crawler.getDescription = function (docBlockLines) {
  var descriptionLines = [];
  var line = docBlockLines.shift();
  while(line) {
    if(this.isAnnotationLine(line)) break;
    descriptionLines.push(line);
    line = docBlockLines.shift();
  }

  // Put the last line back (sorry)
  docBlockLines.unshift(line);

  if(descriptionLines.length === 0) return false;
  return descriptionLines.join(' ').trim();
};

/**
 * Returns the annotation from a line, if any.
 *
 * @param  {string} line
 *         The DocBlock-Line to parse.
 * @return {object}
 *         A key-value pair of the annotation.
 */
Crawler.getAnnotation = function (line) {

  // if it starts with a leading space, it's a multi-line
  // annotation's content.
  if(line.match(/^[\s]/))
    return {
      value: line.replace(/^[\s]/, ''),
      type: 'content'
    };

  // Could not be an annotation at all
  if(!this.isAnnotationLine(line))
    return false;

  // Otherwise, it's probably a key-value pair
  line.match(/^\@([\w]+)[\s]?([^\n]*)/gm);
  var key = RegExp.$1;
  var val = RegExp.$2;

  return {
    key: key,
    value: val ? val : true
  };
};

/**
 * Adds an annotation to a set of annotations, depending on which type it
 * is and if the property has already been set.
 *
 * @param {[type]} annotation  [description]
 * @param {[type]} annotations [description]
 * @param {[type]} lastAnnotationKey  [description]
 */
Crawler.addAnnotationByType = function (annotation, annotations, lastAnnotationKey) {
  // If it's a multiline annotation, add it to the existing text
  if(annotation.type === 'content') {
    // There should be an annotation that this content belongs to
    if(lastAnnotationKey === null) {
      Verbose.error('Multi-line content found, but no annotation key preceeded.', null, false);
      return annotations;
    }

    var lastAnnotationValue = annotations[lastAnnotationKey];

    // Make sure we have content that we can extend
    if((lastAnnotationValue === true) || !lastAnnotationValue) {
      lastAnnotationValue = '';
    }

    // If the last annotation key is an array, add it to the last element
    if(typeof lastAnnotationValue === 'object') {
      var lastValueIndex = lastAnnotationValue.length - 1;
      lastAnnotationValue[lastValueIndex] =
        [lastAnnotationValue[lastValueIndex], annotation.value].join('\n').trim();
      return annotations;
    }

    annotations[lastAnnotationKey] =
      [lastAnnotationValue, annotation.value].join('\n').trim();

    return annotations;
  }

  var key = annotation.key;
  if(typeof annotations[key] === 'object') annotations[key].push(annotation.value);
  if(typeof annotations[key] === 'string') annotations[key] = [annotations[key], annotation.value];
  if(annotations[key] === undefined) annotations[key] = annotation.value;

  return annotations;
};

module.exports = Crawler;
