const mkdir = (env, args) => {
  const dirsToCreate = []
  const createdDirs = []
  const options = []
  const command = 'mkdir'
  while (args.length > 0) {
    switch (args[0]) {
      case '-p' || '--parents':
        options.push('p')
        args.shift()
        break

      default:
        if (env.fs.fileExists(args[0])) {
          env.eprint('File already exists : ' + args[0])
          return 1
        }
        dirsToCreate.push(args.shift())
        break
    }
  }
  switch (command) {
    case 'help':
      env.print(new env.Help('mkdir', 'Create a directory')
        .arg('dir', 'Create the specified directory')
        .arg(['--parents', '-p'], 'Create parent directories as needed, ignore if the directory already exists')
        .arg(['--help', '-h'], 'Display this help')
        .toString())
      break
    case 'mkdir':
      if (dirsToCreate.length === 0) {
        env.eprint('Missing file operand')
        return 1
      }
      for (let i = 0; i < dirsToCreate.length; i++) {
        const dir = dirsToCreate[i]
        if (env.fs.fileExists(dir)) {
          if (!options.includes('p')) {
            env.eprint('File already exists : ' + dir)
            createdDirs.forEach(dir => env.fs.delete(dir))
            return 1
          } else { continue }
        }
        const parentPath = env.fs.getParentPath(dir)
        const parent = env.fs.getPath(parentPath)
        const basename = env.fs.basename(dir)
        if (!env.fs.fileExists(parentPath)) {
          if (options.includes('p')) { mkdir(env, [parentPath]) } else {
            env.eprint('Parent directory does not exist : ' + parentPath)
            return 1
          }
        }

        if (!env.fs.isDir(parentPath)) {
          env.eprint('Cannot create directory : ' + parent + ' is not a directory')
          return 1
        }
        const createdDir = env.fs.createDir(parentPath, basename)

        if (!createdDir.success) {
          env.print(createdDir.error + ' : ' + dir)
          createdDirs.forEach(dir => env.fs.delete(env.fs.getFullPath(dir)))

          return 1
        }

        createdDirs.push(createdDir.result)
      };
      break
  }
}

module.exports = mkdir