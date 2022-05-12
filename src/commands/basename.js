const basename = (env, args) => {
  let file = args[0];

  if (!file) {
    env.eprint('basename: missing operand')
    return 1;
  }

  env.print(env.fs.basename(file))
}

module.exports = basename
