const touch = (env, args) => {
  // All the files to create
  const filesToCreate = []

  // The created files
  const createdFiles = []

  /*
   * --- parse args ---
   * while there are args
   */
  while (args.length > 0) {
    switch (args[0]) {
      // It may be the name of a file to create
      default: {
        // If a file with this name already exists
        if (env.fs.fileExists(args[0])) {
          env.eprint('File already exists : ' + args[0])
          return 1
        }


        filesToCreate.push(args.shift())
        break
      }
    }
  }
  if (filesToCreate.length === 0) {
    env.eprint('Missing file operand')
    return 1
  }

  filesToCreate.forEach(file => {
    const parentPath = env.fs.getParentPath(file)
    const basename = env.fs.basename(file)
      // Try to create the file
    const createdFile = env.fs.createFile(parentPath, basename)
      // If the opration failed
    if (!createdFile.success) {
      env.print(createdFile.error + ' : ' + createdFile.errorCause)
        // Delete the created files
      createdFiles.forEach(file => env.fs.delete(env.fs.getFullPath(file)))
      return 1
    }
    createdFiles.push(createdFile.result)
  })
}

module.exports = touch
