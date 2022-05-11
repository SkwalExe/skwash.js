const cd = (env, args) => {
  // The dir to cd into
  const newDir = args[0]

  // If the dir doesn't exist
  if (!env.fs.fileExists(newDir)) {
    env.eprint('Directory does not exist : ' + newDir)
    return 1
  }

  // If the dir is not a directory
  if (!env.fs.isDir(newDir)) {
    env.eprint('Not a directory : ' + newDir)
    return 1
  }

  // Cd into the dir
  env.fs.changeDir(newDir)
}

module.exports = cd
