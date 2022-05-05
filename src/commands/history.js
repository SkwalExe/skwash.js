const history = (env) => {
  env.print(env.history.reverse().join('\n'))
}

module.exports = history
