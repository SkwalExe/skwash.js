const mkdir = (env, args) => {

  // The dirs to create
  const dirsToCreate = []

  // The created dirs
  const createdDirs = []

  // The options passed to the program
  const options = []

  // The action to execute (mkdir or help)
  const command = 'mkdir'

  /*
   * --- parse the arguments ---
   * while there are arguments
   */
  while (args.length > 0) {
    switch (args[0]) {
      case '-p' || '--parents':
        // Add p to the options
        options.push('p')
        args.shift()
        break

        // If the arg is not -p or --parents it may be the path of the dir to create
      default:
        // Add the dir to the dirs to create
        dirsToCreate.push(args.shift())
        break
    }
  }
  switch (command) {
    case 'help':
      env.print(new env.Help('mkdir', 'Create a directory')
        .arg('dir', 'Create the specified directory')
        .arg([ '--parents', '-p' ], 'Create parent directories as needed, ignore if the directory already exists')
        .arg([ '--help', '-h' ], 'Display this help')
        .toString())
      break
    case 'mkdir':
      // If there are no dirs to create
      if (dirsToCreate.length === 0) {
        env.eprint('Missing file operand')
        return 1
      }

      // For each dir to create
      for (let i = 0; i < dirsToCreate.length; i++) {
        const dir = dirsToCreate[i]
          // If the dir already exists
        if (env.fs.fileExists(dir)) {
          // If the -p option is not set
          if (!options.includes('p')) {
            env.eprint('File already exists : ' + dir)
            createdDirs.forEach(dir => env.fs.delete(dir))
            return 1
          } else {
            continue
          }
        }
        const parentPath = env.fs.getParentPath(dir)
        const parent = env.fs.getPath(parentPath)
        const basename = env.fs.basename(dir)
          // If the parent of the dir to create does not exist
        if (!env.fs.fileExists(parentPath)) {
          // If the -p option is set then create the parent dir
          if (options.includes('p')) {
            mkdir(env, [parentPath])
          } else {
            env.eprint('Parent directory does not exist : ' + parentPath)
            return 1
          }
        }

        // If the parent directory is not a directory
        if (!env.fs.isDir(parentPath)) {
          env.eprint('Cannot create directory : ' + parent + ' is not a directory')
          return 1
        }

        const createdDir = env.fs.createDir(parentPath, basename)

        // If the dir wasn't created successfully
        if (!createdDir.success) {
          env.print(createdDir.error + ' : ' + createdDir.errorCause)

          // Delete the created dirs
          createdDirs.forEach(dir => env.fs.delete(env.fs.getFullPath(dir)))

          return 1
        }

        createdDirs.push(createdDir.result)
      }
      break
  }
}

module.exports = mkdir
