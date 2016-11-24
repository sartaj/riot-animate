export default {
  from: 'test/tags/parsers/',
  to: 'test/generated/config-file/parsers-pug.js',
  ext: 'pug',
  template: 'myPug',
  parsers: {
    html: {
      myPug: function (html, opts, url) {
        return require('pug').render(html, {
          pretty: true,
          filename: url,
          doctype: 'html'
        })
      }
    }
  }
}