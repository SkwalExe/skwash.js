const cat = (env, args) => {
  const filesToCat = []

  // The action to execute (cat or help)
  let command = 'cat'

  /*
   * --- parse arguments ---
   * While there are arguments
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

        // If the argument is not help
      default:
        // If the argument insn't a regular file
        if (!env.fs.isRegularFile(args[0])) {
          env.eprint('Not a file or doesn\'t exists: ' + args[0])
          return 1
        }

        // Add the file to the list of files to cat
        filesToCat.push(args.shift())
        break
    }
  }

  switch (command) {
    case 'cat':
    {
        // If there are no files to cat
      if (filesToCat.length === 0) {
        env.eprint('Missing file operand')
        return 1
      }

        // The output of the command
      let textResult = ''
      filesToCat.forEach(file => {
          // If there are more than one file to cat
        if (filesToCat.length > 1) {
            // Add the name of the file to the output
          textResult += '\n\n' + env.fs.simplifyPath(file) + ' : \n\n'
        }

          // Add the content of the file to the output
        textResult += env.fs.getFileContent(file).result
      })

        // Print the output
      env.print(textResult.trim())
      break
    }

    case 'help':
      // Print the help message
      env.print(new env.Help('cat', 'prints the content of a file')
        .arg('file', 'The file[s] to print')
        .arg([ '-h', '--help' ], 'Prints this help')
        .toString())
      break
  }
}

module.exports = cat
