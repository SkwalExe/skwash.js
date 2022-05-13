const realpath = (env, args) => {

  args.forEach(path => {
    env.print(env.fs.simplifyPath(path))
  })

  if (args.length === 0) {
    env.eprint('Missing operand')
  }

}

module.exports = realpath
