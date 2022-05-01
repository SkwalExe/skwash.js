const ls = (env, args) => {
  const dirsToList = []
  let command = 'ls'
  const options = []

  while (args.length > 0) {
    switch (args[0]) {
      case '-h' || '--help':
        command = 'help'
        args.shift()
        break

      case '-a' || '--all':
        options.push('a')
        args.shift()
        break

      case '-r' || '--recursive':
        options.push('r')
        args.shift()
        break

      default:
        if (env.fs.fileExists(args[0])) { dirsToList.push(args.shift()) } else {
          env.eprint('Unknown argument / no file found : ' + args[0])
          return 1
        }

        break
    }
  }

  switch (command) {
    case 'ls':
      {
        if (dirsToList.length === 0) { dirsToList.push('.') }

        let textResult = ''
        const recursive = options.includes('r')

        if (recursive) {
          const lookInside = (dir) => {
            const result = []
            const files = env.fs.getDirContent(dir).result
            files.forEach(file => {
              const fullPath = env.fs.getFullPath(file)
              if (env.fs.isDir(fullPath)) {
                result.push(fullPath)
                lookInside(fullPath).forEach(subDir => result.push(subDir))
              }
            })
            return result
          }
          dirsToList.forEach(dir => lookInside(dir).forEach(subDir => dirsToList.push(subDir)))
        }

        dirsToList.forEach(dirToList => {
          if (recursive || dirsToList.length > 1) { textResult += '\n' + env.fs.simplifyPath(dirToList) + ' : \n' }
          let content = env.fs.getDirContent(dirToList).result
          if (!options.includes('a')) { content = content.filter(file => !file.name.startsWith('.')) }
          textResult += content.reduce((acc, file) => { return acc += file.name + ' ' }, '') + '\n'
        })

        env.print(textResult.trim())
        break
      }
    case 'help':

      env.print(new env.Help('ls', 'List files in a directory')
        .arg('[dir]', 'List files in the specified directory')
        .arg(['--all', '-a'], 'List hidden files')
        .arg(['-r', '--recursive'], 'Recursively list files in subdirectories')
        .arg(['-h', '--help'], 'Prints this help')
        .toString())
      break
  }
}

module.exports = ls