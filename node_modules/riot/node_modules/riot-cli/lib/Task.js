'use strict'

const
  helpers = require('./helpers'),
  path = require('path'),
  sh = require('shelljs'),
  compiler = global.compiler || require('riot-compiler'),
  constants = require('./const'),
  NO_FILE_FOUND = constants.NO_FILE_FOUND,
  PREPROCESSOR_NOT_REGISTERED = constants.PREPROCESSOR_NOT_REGISTERED

/**
 * Base class that will extended to handle all the cli tasks
 */
class Task {
  constructor(opt) {
    // Run only once

    /* istanbul ignore next */
    if (this.called) return
    this.called = true

    // make sure the parsers object is always valid
    opt.parsers = helpers.extend(
      compiler.parsers,
      opt.parsers || {}
    )

    // validate the compiler options
    this.error = opt.compiler ? this.validate(opt.compiler, opt.parsers) : null

    // create a regex to figure out whether our user
    // wants to compile a single tag or some tags in a folder
    this.extRegex = new RegExp(`\\.${opt.ext || 'tag' }$`)

    // If no target dir, default to source dir

    if (!opt.to)
      opt.to = this.extRegex.test(opt.from) ? path.dirname(opt.from) : opt.from

    // Resolve to absolute paths

    opt.from = path.resolve(opt.from)
    opt.to = path.resolve(opt.to)

    // Check if the path exsists
    if (!sh.test('-e', opt.from)) this.error = NO_FILE_FOUND

    // throw the error only in the cli
    if (this.error) {
      /* istanbul ignore next */
      if (opt.isCli)
        helpers.err(this.error)
      else return this.error
    }

    // Determine the input/output types

    // [directory, directory]
    // [file, directory]
    // [directory, file]
    // [file, file]
    opt.flow = (this.extRegex.test(opt.from) ? 'f' : 'd') +
               (/\.(js|html|css)$/.test(opt.to) ? 'f' : 'd')

    // make sure to set always the compiler options
    if (!opt.compiler) opt.compiler = {}

    // each run method could return different stuff
    return this.run(opt)

  }

  /**
   * Check whether a parser has been correctly registered and It can be loaded
   * @param  { String }  type - parser scope html|javascript|css
   * @param  { String }  id - parser id, the require() call
   * @param  { Object }  parsers - custom parser options
   * @returns { String|Null }  get the error message when the parser can not be loaded
   */
  findParser(type, id, parsers) {
    var error
    // is it a default a default compiler parser?
    // if not check if it has bee manually registered
    if (!compiler.parsers[type][id] && !parsers[type][id])
      error = PREPROCESSOR_NOT_REGISTERED(type, id)
    else
      try {
        compiler.parsers._req(id, true)
      } catch (e) {
        error = e.toString()
      }

    return typeof error == 'string' ? error : null
  }

  /**
   * Validate the compiler options checking whether the local dependencies
   * are installed
   * @param { Object } opt - compiler options
   * @param { Object } parsers - custom parser options
   * @returns {String|Null} - false if there are no errors
   */
  validate(opt, parsers) {
    var template = opt.template,
      type = opt.type,
      style = opt.style,
      error = null

    if (template)
      error = this.findParser('html', template, parsers)
    if (type && !error)
      error = this.findParser('js', type, parsers)
    if (style && !error)
      error = this.findParser('css', style, parsers)

    return error
  }
}

module.exports = Task
