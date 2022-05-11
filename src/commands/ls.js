const ls = (env, args) => {
  // The dirs to list the content of
  const dirsToList = []

  // The action to execute (ls or help)
  let command = 'ls'

  // The options passed to the command
  const options = []

  /*
   * --- parse arguments ---
   * while there are arguments...
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

      case '-a' || '--all':
        // Add a to the options
        options.push('a')
        args.shift()
        break

      case '-r' || '--recursive':
        // Add r to the options
        options.push('r')
        args.shift()
        break

        // If the argument is not help, all, or recursive, than it may be the directory to list
      default:
        // If a file with this name exists...
        if (env.fs.fileExists(args[0])) {
          // Add the file to the dirs to list
          dirsToList.push(args.shift())
        } else {
          env.eprint('Unknown argument / no file found : ' + args[0])
          return 1
        }

        break
    }
  }

  switch (command) {
    case 'ls':
    {
      if (dirsToList.length === 0) {
          // If no directory is specified, list the current directory
        dirsToList.push('.')
      }

        // The output of the command
      let textResult = ''

        // If we should list the directories recursively...
      const recursive = options.includes('r')
      if (recursive) {
          // This function returns all the directories inside a directory (recursively)
        const lookInside = (dir) => {
            // The files inside the directory
          const result = []

            // Get the content of the directory
          const files = env.fs.getDirContent(dir).result
          files.forEach(file => {
            const fullPath = env.fs.getFullPath(file)
                // If the file is a directory, add it to the result and look inside it for more directories
            if (env.fs.isDir(fullPath)) {
              result.push(fullPath)
              lookInside(fullPath).forEach(subDir => result.push(subDir))
            }
          })

          return result
        }

          // For each directory to list, look inside it for more directories to list
        dirsToList.forEach(dir => lookInside(dir).forEach(subDir => dirsToList.push(subDir)))
      }


      dirsToList.forEach(dirToList => {
          /*
           * If the r option was passed or if there are more than one directory to list
           * add a new line and add the directory name to the output
           */
        if (recursive || dirsToList.length > 1) {
          textResult += '\n' + env.fs.simplifyPath(dirToList) + ' : \n'

        }

          // Get all the files inside the directory
        let content = env.fs.getDirContent(dirToList).result

          // If the a options was not passed to the command, remove all the files starting with a dot
        if (!options.includes('a')) {
          content = content.filter(file => !file.name.startsWith('.'))
        }


          // Add each file inside the directory to the output
        textResult += content.reduce((acc, file) => acc += file.name + ' ', '') + '\n'
      })

        // Print the output
      env.print(textResult.trim())
      break
    }
    case 'help':

      env.print(new env.Help('ls', 'List files in a directory')
        .arg('[dir]', 'List files in the specified directory')
        .arg([ '--all', '-a' ], 'List hidden files')
        .arg([ '-r', '--recursive' ], 'Recursively list files in subdirectories')
        .arg([ '-h', '--help' ], 'Prints this help')
        .toString())
      break
  }
}

module.exports = ls
