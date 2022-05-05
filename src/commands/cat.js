const cat = (env, args) => {
  const filesToCat = []
  let command = 'cat'
  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break
      default:
        if (!env.fs.isRegularFile(args[0])) {
          env.eprint('Not a file or doesn\'t exists: ' + args[0])
          return 1
        }
        filesToCat.push(args.shift())
        break
    }
  }
  switch (command) {
    case 'cat':
    {
      if (filesToCat.length === 0) {
        env.eprint('Missing file operand')
        return 1
      }

      let textResult = ''
      filesToCat.forEach(file => {
        if (filesToCat.length > 1) { textResult += '\n\n' + env.fs.simplifyPath(file) + ' : \n\n' }
        textResult += env.fs.getFileContent(file).result
      })
      env.print(textResult.trim())
      break
    }

    case 'help':
      env.print(new env.Help('cat', 'prints the content of a file')
        .arg('file', 'The file[s] to print')
        .arg([ '-h', '--help' ], 'Prints this help')
        .toString())
      break
  }
}

module.exports = cat
