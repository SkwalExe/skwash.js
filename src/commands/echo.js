const echo = (env, args) => {
  // Join all the arguments into a string
  let string = args.join(' ')
    // Replace escape sequences with their actual characters
  string = string.replace(/\\n/g, '\n')
  string = string.replace(/\\t/g, '\t')
  string = string.replace(/\\r/g, '\r')
  string = string.replace(/\\"/g, '"')
  string = string.replace(/\\'/g, '\'')
  string = string.replace(/\\\\/g, '\\')

  // Print the string
  env.print(string)
}

module.exports = echo
