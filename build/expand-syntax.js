var fs = require('fs')
var path = require('path')
var visit = require('unist-util-visit')

var syntax = fs.readFileSync(path.join(__dirname, 'syntax.html'))

module.exports = expandSyntax

function expandSyntax() {
  return transform

  function transform(tree) {
    visit(tree, 'html', onhtml)

    function onhtml(node) {
      if (node.value !== '<!--syntax-->') return
      node.value = '<pre><code>' + syntax + '</code></pre>'
    }
  }
}
