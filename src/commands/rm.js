const rm = (env, args) => {
  const filesToDelete = []
  let containsDir = false
  const options = []
  let command = 'rm'

  while (args.length > 0) {
    switch (args[0]) {
      case '-r' || '-R' || '--recursive':
        options.push('r')
        args.shift()
        break

      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

      default:
        if (env.fs.isDir(args[0])) { containsDir = true }
        filesToDelete.push(args.shift())
        break
    }
  }

  switch (command) {
    case 'rm':

      if (filesToDelete.length === 0) {
        env.eprint('Missing file operand')
        return 1
      }

      if (containsDir && !options.includes('r')) {
        env.eprint('Cannot remove directory : -r not specified')
        return 1
      }

      filesToDelete.forEach(file => env.fs.delete(file))

      break

    case 'help':
      env.print(new env.Help('rm', 'Remove files from the file system')
        .arg(['-r', '--recursive'], 'Remove directories, too')
        .arg('files', 'Files to remove')
        .info('To delete files starting with - use rm ./-file')
        .toString())
      break
  }
}

module.exports = rm