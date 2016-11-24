#!/usr/bin/env node

'use strict'

//
// Use in CLI:
//
//   Type "riot" for help.
//
// Use in Node:
//
//   var riot = require('riot/compiler')
//   riot.make({ from: 'foo', to: 'bar', compact: true })
//   riot.watch({ from: 'foo.tag', to: 'bar.js' })
//

// Include the available tasks
const
  Check       = require('./tasks/Check'),
  New         = require('./tasks/New'),
  Make        = require('./tasks/Make'),
  Watch       = require('./tasks/Watch'),
  helpers     = require('./helpers'),
  options     = require('./options'),
  path        = require('path'),
  chalk       = require('chalk'),
  co          = require('co'),
  optionator  = require('optionator')(options),
  API         =
  {
    help() {
      var h = optionator.generateHelp()
      helpers.log(h)
      return h
    },
    version() {
      var v = helpers.getVersion()
      helpers.log(v)
      return v
    },
    new(opt) { return new New(opt) },
    check(opt) { return new Check(opt) },
    make(opt) { return new Make(opt) },
    watch(opt) { return new Watch(opt) },
    // this could be handy to someone who wants to have
    // also access to the private cli parser function
    _cli: cli
  }

/* istanbul ignore next */
function cli(ar) {

  // Get CLI arguments

  var args

  // was an error thrown parsing the options?
  try {
    args = optionator.parse(
      ar ? ['node', path.resolve('lib')].concat(ar) : process.argv,
      options
    )
  } catch (e) {
    helpers.err(e)
    return e
  }

  // read the config file
  // let's go async here
  return co(function*() {
    if (args.config)
      return yield helpers.loadConfigFile(args.config)
    else
      return {}

  }).then(function(opt) {
    // Translate args into options hash
    // extending args with the options loaded via config file
    helpers.extend(args, opt)
    opt = {
      compiler: {
        compact: args.compact,
        template: args.template, // html preprocessor
        style: args.style, // css preprocessor
        type: args.type, // javascript preprocessor
        brackets: args.brackets,
        entities: !!args.export,
        exclude: args.exclude,
        expr: args.expr,
        modular: args.modular,
        silent: args.silent,
        whitespace: args.whitespace
      },
      ext: args.ext,
      css: args.css,
      new: args.new,
      export: args.export,
      colors: args.colors,
      parsers: args.parsers, // to extend the default compiler parsers
      from: args.from || args._.shift(),
      to: args.to || args._.shift()
    }

    // Call matching method
    var method = Object
                  .keys(API)
                  .filter((v) => args[v])[0] || (opt.from ? 'make' : 'help')

    // check whether the output should be colorized
    chalk.constructor({enabled: !!opt.colors })

    // create isSilent as global variable
    global.isSilent = args.silent

    // flag used to detect wheter a task is triggered via command line or not
    opt.isCli = true

    return API[method](opt)

  }).catch((e) => helpers.err(e))

}


// Run from CLI or as Node module

if (module.parent) {
  module.exports = API
  global.isSilent = true
/* istanbul ignore next */
} else cli()


