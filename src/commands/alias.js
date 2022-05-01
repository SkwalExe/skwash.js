const alias = (env, args) => {

  if (args.length !== 2) {
    env.eprint('Please use the following syntax: <alias> <command>')
    return 1
  }


  const command = args[1]
  const alias = args[0]

  if (env.commands[alias] !== undefined) {
    env.eprint('A command/alias with this name already exists : ' + alias)
    return 1
  }

  env.commands[alias] = env.commands[command]
}

module.exports = alias