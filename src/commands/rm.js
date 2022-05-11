const rm = (env, args) => {
  // The files to delete
  const filesToDelete = []

  // If the files to delete contains a dire
  let containsDir = false

  // The options passed to the command
  const options = []

  // The action to execute (help, or rm)
  let command = 'rm'


  /*
   * --- parse args ---
   * while there are args
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-r' || '-R' || '--recursive':
        // Add r to the options
        options.push('r')
        args.shift()
        break

      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

        // If the option is not -h or -r it may be the path of a file to delete
      default:
        // If the arg is a directory
        if (env.fs.isDir(args[0])) {
          containsDir = true
        }
        // Add the file to the files to delete
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

      // Delete all the files to delete
      filesToDelete.forEach(file => env.fs.delete(file))

      break

    case 'help':
      env.print(new env.Help('rm', 'Remove files from the file system')
        .arg([ '-r', '--recursive' ], 'Remove directories, too')
        .arg('files', 'Files to remove')
        .info('To delete files starting with - use rm ./-file')
        .toString())
      break
  }
}

module.exports = rm
