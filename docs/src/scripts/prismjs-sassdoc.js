(function () {
  var _annotation = '@\\w+';

  // Match an annotation
  var annotation = {
    pattern: RegExp('^' + _annotation, 'gi'),
    alias: 'atrule'
  };

  var _type = '{[^}]+}';

  // Match a type (always following an annotation)
  var type = {
    pattern: RegExp('^(' + _annotation + ')\\s+' + _type, 'gi'),
    lookbehind: true,
    alias: 'string'
  };

  var _param = '[\\$%]?[\\w\\._-]+';

  // Match a param (always following an annotation and optionally a type)
  var param = {
    pattern: RegExp('^(' + _annotation + '(\\s+' + _type + ')?)\\s+' + _param, 'gi'),
    lookbehind: true,
    alias: 'variable'
  };

  // Match a delimited URL
  var url = /<[^>]+>/g;

  Prism.languages.insertBefore('scss', 'comment', {
    'docblock': {
      pattern: /(^|[^\\])(\/\*\*[\w\W]*?\*\/|\/\/\/.*?(\r?\n|$))/g,
      lookbehind: true,
      alias: 'comment',
      inside: {

        // Annotation with param
        'annotation-param': {
          pattern: /@(access|example|alias|since)( .*|\n)/g,
          inside: {
            'param': param,
            'annotation': annotation,
            'url': url
          }
        },

        // Annotation with type and param
        'annotation-type-param-default': {
          pattern: /@(param|arg(ument)?|prop|requires|see)( .*|\r?\n|$)/g,
          inside: {
            'default': {
              pattern: RegExp('^(' + _annotation + '(\\s+' + _type + ')?\\s+' + _param + ')\\s+\\[[^\\)]+\\]', 'gi'),
              lookbehind: true,
              alias: 'string'
            },
            'param': param,
            'type': type,
            'annotation': annotation,
            'url': url
          }
        },

        // Annotation with only type
        'annotation-type': {
          pattern: /@(returns?)( .*|\r?\n|$)/g,
          inside: {
            'type': type,
            'annotation': annotation,
            'url': url
          }
        },

        // Annation with an URL
        'annotation-url': {
          pattern: /@(link|source)( .*|\r?\n|$)/g,
          inside: {
            'annotation': annotation,
            'url': /[^ ]+/
          }
        },

        // Type annotation
        'annotation-type-custom': {
          pattern: /@(type)( .*|\r?\n|$)/g,
          inside: {
            'annotation': annotation,
            'type': {
              pattern: /.*/,
              alias: 'string'
            }
          }
        },

        // Group annotation
        'annotation-group-custom': {
          pattern: /@(group)( .*|\r?\n|$)/g,
          inside: {
            'annotation': annotation,
            'group': {
              pattern: /.*/,
              alias: 'variable'
            }
          }
        },

        // Other annotations
        'annotation-single': {
          pattern: /@(content|deprecated|ignore|output|author|todo|throws?|exception)( .*|\r?\n|$)/g,
          inside: {
            'annotation': annotation,
            'url': url
          }
        },
      }
    }
  });
}());
