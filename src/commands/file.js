const file = (env, args) => {

  args.forEach(file => {
    // If the file doesn't exist
    if (!env.fs.fileExists(file)) {
      env.print(file + ' : No such file or directory')
    }

    if (env.fs.isDir(file)) {
      env.print(file + ' : Directory')
    }

    if (env.fs.isRegularFile(file)) {
      env.print(file + ' : Regular file')
    }
  })

}

module.exports = file
