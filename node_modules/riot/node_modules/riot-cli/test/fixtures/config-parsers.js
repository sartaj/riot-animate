export default {
  from: 'test/tags/component.tag',
  to: 'test/generated/config-file/parsers.js',
  template: 'foo',
  type: 'baz',
  style: 'bar',
  parsers: {
    html: {
      foo: function (html, opts, url) {
        return `
          <tag>
            <p>HI</p>
            <script>
              var foo = "foo"
            </script>
            <style scoped>
            </style>
          </tag>
        `
      }
    },
    css: {
      bar: function(tag, css, opts, url) {
        return ':scope { color: red }'
      }
    },
    js: {
      baz: function (js, opts, url) {
        return 'var baz ="baz"'
      }
    }
  }
}