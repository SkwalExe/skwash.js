/*
 * Skwash.js
 * https://github.com/SkwalExe/skwash.js
 * License : MIT
 */
const FFS = require('fakefilesystem')
const CmdLineParser = require('cmdline-parser')

class ShellEmulator {
  constructor(defaultCommands = true) {
    this.parser = new CmdLineParser(false, true, false, false, true, false, false)
    this.Help = require('./classes/Help')
    this.history = []
    this.commands = defaultCommands ? require('./commands') : {}
    this.fs = new FFS()
    this.Result = require('./classes/Result')
    this.lastExitCode = 0
    this.variables = {}
    this.registerCommand = (name, func) => {
      const result = new this.Result()
      if (this.commands[name]) {
        result.error = 'Command already exists'
        result.errorCause = name
        return result
      }
      this.commands[name] = result.result = func
      result.success = true
      return result
    }

    this.removeCommand = (name) => {
      const result = new this.Result()
      if (!this.commands[name]) {
        result.error = 'Command does not exist'
        result.errorCause = name
        return result
      }
      delete this.commands[name]
      result.success = true
      return result
    }

    this.print = console.log
    this.eprint = console.log

    this.on = (eventName, func) => {
      switch (eventName) {
        case 'output':
          this.print = this.eprint = func
          break

        case 'stdout':
          this.print = func
          break

        case 'stderr':
          this.eprint = func
          break
      }
    }

    this.executeCommand = (command) => {

      this.variables['cd'] = this.fs.CWD();
      this.variables['?'] = this.lastExitCode;

      command = command.trim()

      const variableMatch = command.match(/^([a-zA-Z0-9_]+)=(.*)$/)

      if (variableMatch) {
        const name = variableMatch[1]
        const value = variableMatch[2]
        this.variables[name] = value
        return 0
      }

      /*
       * Regex for allowed var names
       * /[^\\]\$[a-zA-Z0-9_]{1,}|\?/g
       */

      const variableRegex = /\$[a-zA-Z0-9_]{1,}|\?/g

      const variables = command.match(variableRegex)

      if (variables) {
        variables.forEach(variable => {
          variable = variable.substring(1)
          command = command.replace(`$${variable}`, this.variables[variable] || '')
        })
      }

      let parsed = this.parser.parseCommand(command)
      if (parsed.invalid) {
        this.eprint('[ Skwash ] : ' + parsed.invalidReason)
        return 130
      }

      let args = parsed.args;

      let writeTo = parsed['>'];
      let appendTo = parsed['>>'];

      const commandName = parsed.name
      let oldPrint = this.print
      let oldEprint = this.eprint
      if (writeTo.length > 0 || appendTo.length > 0) {

        this.print = this.eprint = (text) => {
          for (let i = 0; i < writeTo.length; i++) {
            this.fs.writeFile(writeTo[i], text)
          }

          for (let i = 0; i < appendTo.length; i++) {
            this.fs.writeFile(appendTo[i], text, true)
          }
        }
      }

      if (!this.commands[commandName]) {
        if (this.fs.isRegularFile(commandName)) {
          const file = this.fs.getFileContent(commandName)
          if (file.success) {
            command = file.result
            return this.run(command)
          }
        } else {
          this.eprint(`[ Skwash ] : Command not found: ${commandName}`)
          this.lastExitCode = 127
          return 127
        }
      }

      const commandResult = this.commands[commandName](this, args)
      this.lastExitCode = typeof commandResult === 'number' ? commandResult : 0

      if (writeTo.length > 0 || appendTo.length > 0) {
        this.print = oldPrint
        this.eprint = oldEprint
      }
      return this.lastExitCode
    }

    this.run = (command) => {
      command = command.trim()
        // Add command to the history if needed
      if (command.length > 0 && this.history[0] !== command && command !== 'history') {
        this.history.unshift(command)
      }

      if (/[;\n]/.test(command)) {
        const commands = command.split(/[;\n]/).filter(cmd => cmd.trim().length > 0)
        if (commands.length > 0) {
          commands.forEach(cmd => this.executeCommand(cmd))
          return this.lastExitCode
        }
      }
      command = command.split(/[\s;\n]/).filter(cmd => cmd.trim().length > 0).join(' ')
      return this.executeCommand(command)
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = ShellEmulator
}
