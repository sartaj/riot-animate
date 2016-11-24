'use strict'

const
  Task = require('../Task'),
  helpers = require('../helpers'),
  chalk = require('chalk'),
  compiler = global.compiler || require('riot-compiler'),
  path = require('path'),
  sh = require('shelljs'),
  constants = require('./../const'),
  START_FRAG = constants.MODULAR_START_FRAG,
  END_FRAG = constants.MODULAR_END_FRAG

/**
 * Compile the tags using the riot-compiler
 */
class Make extends Task {
  run(opt) {
    // Generate a list of input/output files
    var
      isInputFile = opt.flow[0] == 'f',
      isOutputFile = opt.flow[1] == 'f',

      from   = isInputFile ?
                [opt.from] :
                helpers.find(this.extRegex, opt.from),

      base   = isInputFile ?
                path.dirname(opt.from) :
                opt.from,

      to     = isOutputFile ?
                [opt.to] :
                helpers.remap(this.extRegex, from, opt.to, base, opt.export)

    // Create any necessary dirs

    var dirs = {}
    to.map((f) => dirs[path.dirname(f)] = 0 )
    sh.mkdir('-p', Object.keys(dirs))

    // extend the compiler parsers
    if (opt.parsers)
      helpers.extend(compiler.parsers, opt.parsers)

    // Process files
    if (isOutputFile)
      this.toFile(from, to, opt)
    else
      this.toDir(from, to, opt)

    // Print what's been done (unless --silent)

    /* istanbul ignore next */
    if (!opt.compiler.silent) {
      from.map((src, i) => {
        helpers.log(
          chalk.blue(helpers.toRelative(src)) +
          chalk.cyan(' -> ') +
          chalk.green(helpers.toRelative(to[i] || to[0]))
        )
      })
    }

    return true

  }

  /**
   * Write all the tags compiled in a single file on the file system
   * @param   { Array } from - source files array
   * @param   { String } to - output path
   * @param   { Object } opt - cli options
   */
  toFile(from, to, opt) {
    this.encapsulate(
      from.map((path) => this.parse(path, opt)).join('\n'),
      opt
    ).to(to[0])
  }

  /**
   * Write all the tags compiled in several files on the file system
   * @param   { Array } from - source files array
   * @param   { Array } to - output folder
   * @param   { Object } opt - cli options
   */
  toDir(from, to, opt) {
    from.map((from, i) => {
      return this.encapsulate(this.parse(from, opt), opt).to(to[i])
    })
  }

  /**
   * Compile the source files using the riot-compiler
   * @param   { String } from - source files array
   * @param   { Object } opt - cli options
   * @returns { String } riot-compiler output
   */
  parse(from, opt) {
    var out
    try {
      out = compiler.compile(
              sh.cat(from).toString().replace(/^\uFEFF/g, /* strips BOM */''),
              opt.compiler,
              from
            )
      // take only the css
    } catch (e) {
      helpers.err(e)
    }
    if (opt.export)
      return out.reduce((prev, curr) => prev + curr[opt.export], '')
    else return out
  }

  /**
   * Wrap the generated tags using a default UMD wrapper
   * @param   { String } from - source files array
   * @param   { Object } opt - cli options
   * @returns { String } wrapped output
   */
  encapsulate(from, opt) {
    var out = !opt.compiler.modular ? from : `${START_FRAG}${from}${END_FRAG}`
    return sh.ShellString(out)
  }
}

module.exports = Make