const alias = (env, args) => {

  // If the number of arguments is not 2
  if (args.length !== 2) {
    env.eprint('Please use the following syntax: <alias> <command>')
    return 1
  }

  // The first argument is the original command name
  const command = args[1]
    // The second argument is the alias
  const alias = args[0]

  // If the alias already exists
  if (env.commands[alias] !== undefined) {
    env.eprint('A command/alias with this name already exists : ' + alias)
    return 1
  }

  // Set the alias
  env.commands[alias] = env.commands[command]
}

module.exports = alias
