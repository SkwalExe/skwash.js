const mv = (env, args) => {
  // The options passed to the command
  const options = []

  // The action to execute (mv or help)
  let command = 'mv'

  // The source file
  let source = null

  // The destination path
  let destination = null

  /*
   * --- parse args ---
   * while there are args
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break
      case '-f' || '--force':
        // Add f to the options
        options.push('f')
        args.shift()
        break

        // If the arg is not -h or -h it may be the source or destination path
      default:
        // If the source is not set yet
        if (source === null) {
          source = args.shift()
            // Else if the destination is not set
        } else if (destination === null) {
          destination = args.shift()
            // If the destination and the source are already set
        } else {
          env.eprint('Unknown argument : ' + args[0])
        }
        break
    }
  }
  switch (command) {
    case 'help':

      env.print(new env.Help('mv', 'Move a file from one location to another', false)
        .arg([ '--force', '-f' ], 'Overwrite existing files')
        .arg([ '--help', '-h' ], 'Display this help')
        .arg('source', 'The source of the move')
        .arg('destination', 'The destination of the move')
        .toString())

      break
    case 'mv':
    {

      if (source === null) {
        env.eprint('Missing required argument : source')
        return 1
      }

      if (destination === null) {
        env.eprint('Missing required argument : destination')
        return 1
      }

      let operation = env.fs.move(source, destination)

      if (operation.success)
        return 0;

      env.eprint(operation.error + ' : ' + operation.errorCause)

      return 1
    }
  }
}

module.exports = mv
