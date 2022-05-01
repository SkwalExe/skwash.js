class Help {
  constructor(name, description) {
    this.name = name
    this.description = description
    this.args = []
    this.author = '@SkwalExe'
    this.additionalInfo = []
    this.argsAfterName = true;
    this.longestArgLength = 0;

    this.arg = (flags, description) => {
      if (typeof flags === 'string')
        flags = [flags]
      this.args.push({
        flags: flags,
        description: description
      })

      if (flags.join(', ').length > this.longestArgLength)
        this.longestArgLength = flags.join(', ').length

      return this
    }
    this.setAuthor = (author) => {
      this.author = author
      return this
    }
    this.info = (info) => {
      this.additionalInfo.push(info)
      return this
    }
    this.showArgsAfterName = (argsAfterName) => {
      this.argsAfterName = argsAfterName
      return this
    }
    this.alignArgs_ = true;
    this.alignArgs = (alignArgs) => {
      this.alignArgs_ = alignArgs
      return this
    }

  }

  toString = () => {
    let result = this.name
    if (this.argsAfterName)
      result += this.args.length > 0 ? ' ' + this.args.reduce((acc, arg) => acc += arg.flags.join(', ') + " ", "") : ''

    result += "\n-----------------\n"
    result += this.description
    result += "\nAuthor : "
    result += this.author
    result += "\n-----------------\n"
    result += "Options :\n"
    result += this.args.reduce((acc, arg) => acc += "  " + arg.flags.join(', ') + (this.alignArgs_ ? (" ".repeat(this.longestArgLength - arg.flags.join(', ').length)) : '') + " : " + arg.description + "\n", "")
    result += this.additionalInfo.length > 0 ? '\n-----------------\n' : ''
    result += this.additionalInfo.join('\n');

    return result;
  }
}

module.exports = Help