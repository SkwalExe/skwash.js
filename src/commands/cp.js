const cp = (env, args) => {
  const options = []
  let command = 'cp'
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
          return 1
        }
        break
    }
  }
  switch (command) {
    case 'help':

      env.print(new env.Help('cp', 'Copy files from one location to another', false)
        .arg(['--force', '-f'], 'Overwrite existing files')
        .arg(['--help', '-h'], 'Display this help')
        .arg('source', 'The source of the copy')
        .arg('destination', 'The destination of the copy')
        .arg(['--help', '-h'], 'Display this help')
        .toString())
      break
    case 'cp':

      if (source === null) {
        env.eprint('Missing required argument : source path')
        return 1
      }

      if (destination === null) {
        env.eprint('Missing required argument : destination path')
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

      env.fs.copy(source, destination)
      break
  }
}

module.exports = cp