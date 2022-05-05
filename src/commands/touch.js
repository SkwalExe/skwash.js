const touch = (env, args) => {
  const filesToCreate = []
  const createdFiles = []
  while (args.length > 0) {
    switch (args[0]) {
      default: if (env.fs.fileExists(args[0])) {
        env.eprint('File already exists : ' + args[0])
        return 1
      }
        filesToCreate.push(args.shift())
        break
    }
  }
  if (filesToCreate.length === 0) {
    env.eprint('Missing file operand')
    return 1
  }

  filesToCreate.forEach(file => {
    const parentPath = env.fs.getParentPath(file)
    const basename = env.fs.basename(file)
    const createdFile = env.fs.createFile(parentPath, basename)
    if (!createdFile.success) {
      env.print(createdFile.error + ' : ' + file)
      createdFiles.forEach(file => env.fs.delete(env.fs.getFullPath(file)))
      return 1
    }
    createdFiles.push(createdFile.result)
  })
}

module.exports = touch
