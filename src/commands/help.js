const help = (env) => {

  // This command diplays information only about the preinstalled commands

  const help = new env.Help('skwash.js', 'linux shell emulator for javascript')
    .arg('help', 'Display this help')
    .arg('touch', 'Create a new empty file')
    .arg('ls', 'List files in the current directory or the specified one')
    .arg('rm', 'Remove the specified file/directory')
    .arg('cd', 'Change the current working directory')
    .arg('pwd', 'Print the current working directory')
    .arg('mkdir', 'Create a new directory')
    .arg('cat', 'Display the contents of a file')
    .arg('echo', 'Echo the specified string')
    .arg('history', 'Display the history of commands')
    .arg('cp', 'Copy a file')
    .arg('mv', 'Move a file')
    .arg('alias', 'Create an alias for a command')
    .arg('file', 'Display information about a file')
    .arg('true', 'Do nothing, successfully')
    .arg('false', 'Do nothing, unsuccessfully')
    .arg('basename', 'Get the basename of a file')
    .arg('realpath', 'Get the absolute path of a file')
    .arg('uname', 'Display information about the current system')
    .arg('[command]', 'Run the specified command')
    .showArgsAfterName(false)

  env.print(help.toString())
}

module.exports = help
