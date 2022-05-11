const history = (env) => {
  // Reverse the history and print each element separated by a newline
  env.print(env.history.reverse().join('\n'))
}

module.exports = history
