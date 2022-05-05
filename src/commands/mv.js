const mv = (env, args) => {
  const result = new env.Result()
  const options = []
  let command = 'mv'
  let source = null
  let destination = null
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break
      case '-f' || '--force':
        options.push('f')
        args.shift()
        break

      default:
        if (source === null) {
          source = args.shift()
        } else if (destination === null) {
          destination = args.shift()
        } else {
          env.eprint('Unknown argument : ' + args[0])
          return result
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

      if (source === null) {
        env.eprint('Missing required argument : source')
        return 1
      }

      if (destination === null) {
        env.eprint('Missing required argument : destination')
        return 1
      }

      if (!env.fs.fileExists(source)) {
        env.eprint('Source file does not exist : ' + source)
        return 1
      }

      if (env.fs.fileExists(destination)) {
        if (!options.includes('f')) {
          env.eprint('Destination file already exists : ' + destination)
          return 1
        } else { env.fs.delete(destination) }
      }

      if (env.fs.copy(source, destination).success) { env.fs.delete(source) }

      break
  }
}

module.exports = mv
