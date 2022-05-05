/*
 * Skwash.js
 * https://github.com/SkwalExe/skwash.js
 * License : MIT
 */
const FFS = require('fakefilesystem')

class ShellEmulator {
  constructor(defaultCommands = true) {
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
      command = command.trim()

      const variableMatch = command.match(/^([a-zA-Z0-9_]+)=(.*)$/)

      if (variableMatch) {
        const name = variableMatch[1]
        const value = variableMatch[2]
        this.variables[name] = value
        return 0
      }


      let args = command.split(' ').filter(args => args !== '')
      args.forEach((arg, index) => {
        switch (arg) {
          case '$?':
            args[index] = this.lastExitCode.toString()
            break

          case '$cd':
            args[index] = this.fs.CWD();
            break

          default:
            if (/^\$[a-zA-Z0-9_]+$/.test(arg))
              args[index] = this.variables[arg.slice(1)] || ''
            break;
        }

      })
      const commandName = args.shift()

      if (!this.commands[commandName]) {
        if (this.fs.isRegularFile(commandName)) {
          const file = this.fs.getFileContent(commandName)
          if (file.success) {
            command = file.result
            return this.run(command)
          }
        } else {
          this.eprint(`Command not found: ${commandName}`)
          this.lastExitCode = 127
          return 127
        }
      }

      const commandResult = this.commands[commandName](this, args)
      this.lastExitCode = typeof commandResult === 'number' ? commandResult : 0
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
