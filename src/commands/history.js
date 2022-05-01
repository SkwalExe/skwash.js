const history = (env, args) => {
  env.print(env.history.reverse().join('\n'))
}

module.exports = history
