module.exports = prefix

var note =
  '<!-- NOTE: `spec.txt` is the source, don’t edit `readme.md` manually. -->'

function prefix() {
  return transform

  function transform(tree) {
    tree.children.unshift({type: 'html', value: note})
  }
}
