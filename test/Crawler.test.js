/* global describe */
/* global it */

'use strict';

var assert = require('assert');
var Helpers = require('./helpers');
var Verbose = require('../src/Verbose.js');
var Crawler = require('../src/Crawler');

describe('Crawler', function() {

  /********************************************************/

  describe('#isAnnotationLine', function () {
    it('should recognize a default annotation line', function () {
      assert.equal(Crawler.isAnnotationLine("@test"), true);
    });

    it('should not recognize an invalid annotation line', function () {
      assert.equal(Crawler.isAnnotationLine("test"), false);
    });

    it('should not recognize a content line as annotation', function () {
      assert.equal(Crawler.isAnnotationLine(" test"), false);
    });
  });

  /********************************************************/

  describe('#nextNode', function () {
    it('should return the next element from a set and remove it', function () {
      var set = [1,2];
      assert.equal(Crawler.nextNode(set), 1);
      assert.equal(set.length, 1);
    });
    it('should throw an error on empty sets', function () {
      var set = [];

      Helpers.hook(Verbose, 'log');
      Helpers.hook(Verbose, 'exit');

      Crawler.nextNode(set);

      assert.equal(Helpers.logCalled, 2);
      assert.equal(Helpers.exitCalled, 1);
    });
  });

  /********************************************************/

  describe('#isDocBlock', function () {
    it('should return false if not input was passed', function () {
      assert.equal(Crawler.isDocBlock(), false);
    });

    it('should not detect single starred comments as DocBlock', function () {
      assert.equal(Crawler.isDocBlock("@test"), false);
    });

    it('should not detect single starred comments with value as DocBlock', function () {
      assert.equal(Crawler.isDocBlock("@test value"), false);
    });

    it('should detect single line comments as DocBlock', function () {
      assert.equal(Crawler.isDocBlock("* @test"), true);
    });

    it('should detect single line comments with value as DocBlock', function () {
      assert.equal(Crawler.isDocBlock("* @test value"), true);
    });

    it('should detect multiline DocBlocks', function () {
      assert.equal(Crawler.isDocBlock("*\n * @test"), true);
    });

    it('should detect multiline DocBlocks with Windows EOLs', function () {
      assert.equal(Crawler.isDocBlock("*\r\n * @test"), true);
    });
  });

  /********************************************************/

  describe('#getAnnotation', function () {
    it('should parse an annotation without value', function () {
      assert.deepEqual(
        Crawler.getAnnotation("@test"),
        {key: 'test', value: true}
      );
    });

    it('should parse an annotation with value', function () {
      assert.deepEqual(
        Crawler.getAnnotation("@test abc"),
        {key: 'test', value: 'abc'}
      );
    });

    it('should parse an annotation with HTML value', function () {
      assert.deepEqual(
        Crawler.getAnnotation("@test <div></div>"),
        {key: 'test', value: '<div></div>'}
      );
    });

    it('should return multiline content', function () {
      assert.deepEqual(
        Crawler.getAnnotation(" <div> </div> "),
        {value: '<div> </div> ', type: 'content'}
      );
    });

    it('should return multiline content indented with tabs', function () {
      assert.deepEqual(
        Crawler.getAnnotation("\t<div> </div> "),
        {value: '<div> </div> ', type: 'content'}
      );
    });

    it('should return false is no annotation line', function () {
      assert.deepEqual(
        Crawler.getAnnotation("Whatever i am"),
        false
      );
    });
  });

  /********************************************************/

  describe('#removeCommentChars', function () {
    it('should remove single line DocBlock star', function () {
      assert.equal(Crawler.removeCommentChars('* @test'), '@test');
    });
    it('should remove single line trailing spaces', function () {
      assert.equal(Crawler.removeCommentChars('* @test '), '@test');
    });
    it('should remove single line DocBlock star', function () {
      assert.equal(Crawler.removeCommentChars('* @test'), '@test');
    });
    it('should remove multi line DocBlock stars', function () {
      assert.equal(Crawler.removeCommentChars('*\n * @test'), '@test');
    });
    it('should remove multi line DocBlock stars for multiple annotations', function () {
      assert.equal(Crawler.removeCommentChars('*\n * @test\n * @test2'), '@test\n@test2');
    });
    it('should remove multi line DocBlock stars for multiple annotations in indented blocks', function () {
      assert.equal(Crawler.removeCommentChars(
        '   *\n'+
        '    * @test\n'+
        '    * @test2'
      ), '\n@test\n@test2');
    });
    it('should remove multi line DocBlock stars for multiple annotations and values', function () {
      assert.equal(Crawler.removeCommentChars('*\n * @test 111\n * @test2 222'), '@test 111\n@test2 222');
    });
    it('should remove multi line DocBlock stars for multiple annotations and some values', function () {
      assert.equal(Crawler.removeCommentChars('*\n * @test 111\n * @test2 '), '@test 111\n@test2');
    });
    it('should remove multi line DocBlock stars for multiple annotations and description', function () {
      assert.equal(
        Crawler.removeCommentChars(
          '*\n'+
          ' * Desc  \n'+
          ' * \n'+
          ' * @test 111\n'+
          ' * @test2 222'),
        'Desc\n\n@test 111\n@test2 222'
      );
    });
  });

/********************************************************/

  describe('#getDescription', function () {
    it('Should return a description if one is present', function () {
      var lines = 'Description line 1\nand two.\n@test'.split('\n');
      assert.equal(Crawler.getDescription(lines), 'Description line 1 and two.');
    });

    it('Should remove description lines from the input array', function () {
      var lines = 'Description line 1\nand two.\n@test'.split('\n');
      Crawler.getDescription(lines);
      assert.equal(JSON.stringify(lines), '["@test"]');
    });

    it('Should return false if no description is present', function () {
      var lines = '@test1\n@test'.split('\n');
      assert.equal(Crawler.getDescription(lines), false);
    });
  });

  /********************************************************/

  describe('#addAnnotationByType', function () {
    it('should add a new annotation', function () {
      var annotation = {key: 'test', value: true};
      var annotations = {};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations)),
        JSON.stringify({'test' : true})
      );
    });

    it('should add a new annotation with value', function () {
      var annotation = {key: 'test', value: 'okay'};
      var annotations = {};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations)),
        JSON.stringify({'test' : 'okay'})
      );
    });

    it('should add a to an existing annotation', function () {
      var annotation = {key: 'test', value: 'okay'};
      var annotations = {'test' : 'first'};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations)),
        JSON.stringify({'test' : ['first', 'okay']})
      );
    });

    it('should add a single-line value to an existing set of annotation values', function () {
      var annotation = {key: 'test', value: 'okay'};
      var annotations = {'test' : ['first', 'second']};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations, 'test')),
        JSON.stringify({'test' : ['first', 'second', 'okay']})
      );
    });

    it('should add new multiline content to precessor', function () {
      var annotation = {type: 'content', value: 'okay'};
      var annotations = {};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations, 'test')),
        JSON.stringify({'test' : 'okay'})
      );
    });

    it('should add multiline content to existing precessor', function () {
      var annotation = {type: 'content', value: 'okay'};
      var annotations = {'test' : true};
      assert.deepEqual(
        Crawler.addAnnotationByType(annotation, annotations, 'test'),
        {'test' : 'okay'}
      );

      assert.deepEqual(
        Crawler.addAnnotationByType(annotation, annotations, 'test'),
        {'test' : 'okay\nokay'}
      );
    });

    it('should add a multi-line value to an existing set of annotation values', function () {
      var annotation = {type: 'content', value: 'okay'};
      var annotations = {'test' : ['first', 'second']};
      assert.equal(
        JSON.stringify(Crawler.addAnnotationByType(annotation, annotations, 'test')),
        JSON.stringify({'test' : ['first', 'second\nokay']})
      );
    });

    it('should throw an error if no last annotation was given', function () {
      var annotation = {type: 'content', value: 'okay'};
      var annotations = {'test' : true};

      Helpers.hook(Verbose, 'log');
      Helpers.hook(Verbose, 'exit');

      Crawler.addAnnotationByType(annotation, annotations, null);

      assert.equal(Helpers.logCalled, 1);
      assert.equal(Helpers.exitCalled, 0);
    });
  });

  /********************************************************/

  describe('#processFile', function () {
    it('works?', function () {
      Crawler.processFile('./test/component.scss');
    });
  });

});
