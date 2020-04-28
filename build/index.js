var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var parse = require('remark-parse')
var markdown = require('remark-stringify')
var remarkSettings = require('remark-preset-wooorm').settings
var slug = require('remark-slug')
var prefix = require('./prefix')
var numberHeadings = require('./number-headings')
var linkSelf = require('./link-self')
var expandCharacters = require('./expand-characters')
var expandReferences = require('./expand-references')
var expandSyntax = require('./expand-syntax')
var slugReferences = require('./slug-references')

var file = vfile.readSync('spec.txt')
var settings = {...remarkSettings, commonmark: true}

var specToMarkdown = unified()
  .use(parse, settings)
  .use(prefix)
  .use(numberHeadings)
  .use(slug)
  .use(linkSelf)
  .use(expandReferences)
  .use(expandCharacters)
  .use(expandSyntax)
  .use(slugReferences)
  .use(markdown, settings)

specToMarkdown.process(file, function (err, file) {
  if (err) {
    console.error(report(err))
  } else {
    console.log(report(file))
    file.stored = true
    file.path = 'readme.md'
    vfile.writeSync(file)
  }
})
