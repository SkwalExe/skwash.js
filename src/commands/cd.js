const cd = (env, args) => {
  const newDir = args[0]

  if (!env.fs.fileExists(newDir)) {
    env.eprint('Directory does not exist : ' + newDir)
    return 1
  }

  if (!env.fs.isDir(newDir)) {
    env.eprint('Not a directory : ' + newDir)
    return 1
  }

  env.fs.changeDir(newDir)

}

module.exports = cd