// This file is used to reference the preinstalled commands

const commands = {
  touch: require('./touch'),
  ls: require('./ls'),
  rm: require('./rm'),
  cd: require('./cd'),
  pwd: require('./pwd'),
  mkdir: require('./mkdir'),
  cat: require('./cat'),
  echo: require('./echo'),
  history: require('./history'),
  help: require('./help'),
  cp: require('./cp'),
  mv: require('./mv'),
  alias: require('./alias'),
  file: require('./file')
}

module.exports = commands
