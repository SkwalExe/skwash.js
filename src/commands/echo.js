const cd = (env, args) => {
  let string = args.join(' ')
    // Replace escape sequences with their actual characters
  string = string.replace(/\\n/g, '\n')
  string = string.replace(/\\t/g, '\t')
  string = string.replace(/\\r/g, '\r')
  string = string.replace(/\\"/g, '"')
  string = string.replace(/\\'/g, '\'')
  string = string.replace(/\\\\/g, '\\')

  env.print(string)

}

module.exports = cd
