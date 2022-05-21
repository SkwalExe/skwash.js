const cp = (env, args) => {

  // The action to execute (cp or help)
  let command = 'cp'

  // The source file
  let source = null

  // The destination path
  let destination = null

  /*
   * --- parse arguments ---
   * while there are arguments
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

        // If the argument is not help, it may be the source/destination path
      default:
        // If the source is not set yet
        if (source === null) {
          // Set the source
          source = args.shift()
            // Else if the destination is not set yet
        } else if (destination === null) {
          // Set the destination
          destination = args.shift()
        } else {
          env.eprint('Unknown argument : ' + args[0])
          return 1
        }
        break
    }
  }
  switch (command) {
    case 'help':
      env.print(new env.Help('cp', 'Copy files from one location to another', false)
        .arg([ '--help', '-h' ], 'Display this help')
        .arg('source', 'The source of the copy')
        .arg('destination', 'The destination of the copy')
        .arg([ '--help', '-h' ], 'Display this help')
        .toString())
      break
    case 'cp':
    {
      if (source === null) {
        env.eprint('Missing required argument : source path')
        return 1
      }

      if (destination === null) {
        env.eprint('Missing required argument : destination path')
        return 1
      }
      let operation = env.fs.copy(source, destination)

      if (operation.success)
        return 0;

      env.eprint(operation.error + ' : ' + operation.errorCause)
      return 1;
    }
  }
}

module.exports = cp
