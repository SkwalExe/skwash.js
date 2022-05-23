# skwash.js

🐧 Linux-like shell 🐚 emulated directly in javascript 😍

![](assets/banner.png)

# Example

[A simple example of the usage of the library](https://skwalexe.github.io/skwash.js/example.html) is provided in this repository.

# JsDelivr

```html
<script src="https://cdn.jsdelivr.net/gh/SkwalExe/skwash.js@v0.8.2/dist/skwash.min.js"></script>
```

# NPM module

Install the npm module 

```bash
npm install skwash
```

And import it in your project 

```js
const ShellEmulator = require('skwash');

let myShell = new ShellEmulator();
```

# Setting up 

You can import the library into you website with [JsDelivr](#JsDelivr) or, you can use the [npm module](#NPM-module) and import it in your project.

# Your first shell ✨

Skwash.js provides the following features:

- [✨ Custom Commands](#custom-commands)
- [✨ Aliases](#aliases)
- [✨ Stderr and stdout](#stderr-and-stdout)
- [✨ File system](#file-system)
- [✨ Basic shell commands (cd, ls, cat...)](#basic-shell-commands)
- [✨ History](#history)
- [✨ Scripts](#scripts)
- [✨ Events](#events)
- [✨ Redirections](#redirections)
- [✨ Snapshots](#snapshots)

Once you created a shell instance, you can use these functions to interact with it:

- [✨ `ShellEmulator.run()`](#shellemulatorrun)
- [✨ `ShellEmulator.registerCommand()`](#shellemulatorregistercommand)
- [✨ `ShellEmulator.removeCommand()`](#shellemulatorremovecommand)
- [✨ `ShellEmulator.on()`](#shellemulatoron)
- [✨ `ShellEmulator.toJson()`](#shellemulatortojson)
- [✨ `ShellEmulator.loadFromJson()`](#shellemulatorloadfromjson)
- [✨ `ShellEmulator.fs.*`](#shellemulatorfs)

By default, the shell is provided with the following build-in commands:

- [✨ `touch`](#touch)
- [✨ `ls`](#ls)
- [✨ `rm`](#rm)
- [✨ `cd`](#cd)
- [✨ `pwd`](#pwd)
- [✨ `mkdir`](#mkdir)
- [✨ `cat`](#cat)
- [✨ `echo`](#echo)
- [✨ `history`](#history)
- [✨ `help`](#help)
- [✨ `cp`](#cp)
- [✨ `mv`](#mv)
- [✨ `alias`](#alias)
- [✨ `file`](#file)
- [✨ `true`](#true)
- [✨ `false`](#false)
- [✨ `basename`](#basename)

# Features 🎉

## Custom Commands

You can create your own commands by using the [`ShellEmulator.registerCommand()`](#registerCommand) function

## Aliases

The user can create aliases from the command line with the built-in [alias](#alias) command.

## Stderr and stdout

Commands can write to the standard output and standard error streams.

This is useful for example, to display stderr messages (errors) in another color.

## File system

skwash.js uses [SkwalExe's FakeFileSystem.js](https://github.com/SkwalExe/FakeFileSystem.js) to emulate the file system in the memory.

## Basic shell commands

By default, shell instances are provided with [built-in commands](#Built-in-commands-).

Build-in commands can be disabled by passing `false` to the class constructor.

```js
var myShell = new ShellEmulator(false);
```

## History

Skwash.js keeps track of the commands that have been executed by the user in the `ShellEmulator.history` array, this history can be accessed with the [`history`](#history) command.

## Scripts

skwash.js can execute scripts from the file system.

The script will have to be written with the [`ShellEmulator.fs.writeFile()`](#fs) function because we do not support file writing yet in the shell.

## Events

You can listen to events emitted by the shell with the [`ShellEmulator.on()`](#on) function.

Current events are:
- `stdout`: when a command writes to the standard output
- `stderr`: when a command writes to the standard error output
- `output`: when a command writes to the standard output or the standard error output

## Redirections

The user can use redirectors to redirect the output of a command to a file.

The supported redirectors are:
- `>>`: append to the file
- `>`: overwrite the file

## Snapshots

You can save the current state of the shell in a snapshot with the [`ShellEmulator.toJson()`](#shellemulatortojson) and [`ShellEmulator.loadFromJson()`](#shellemulatorloadfromjson) functions.

Snapshots cannot save commands, snapshots can only save :
- the current file system
- the command history
- the variables

# Functions 🛠️

## `ShellEmulator.run()`

This functions run a command line in the shell (supports multiple commands separated by `;` or line breaks) and returns the exit code of the last command.

```js
myShell.run('touch bonjour; ls;');
```

## `ShellEmulator.registerCommand()`

This function registers a new command in the shell.

The first argument is the name of the command, the second argument is the function that will be called when the command is executed.

```js
myShell.registerCommand('myCommand', (env, args) => {
  env.print(`Hello ${args[0]} !`);
});
```

Your function musts take two arguments:
- `env`: the shell environment
- `args`: the arguments passed to the command

To output text use the following functions:
- `env.print()` : prints to strout
- `env.eprint()` : prints to stderr

You can access the file system with the `env.fs` object.

## `ShellEmulator.removeCommand()`

This function is used to remove a command from the shell.

It can also be used to remove built-in commands.

```js
myShell.removeCommand('myCommand');
```

## `ShellEmulator.on()`

This function is used to create an event listener.

The first parameter is the name of the event (`stdout`, `stderr`, `output`) and the second parameter is the function that will be called when the event is emitted.

```js
myShell.on('stdout', text => {
  console.log("Some text was written to stdout: " + text);
});
```

Your function musts take one argument which is the text emitted by the shell.

## `ShellEmulator.toJson()`

This function is used to save the current state of the shell in a JSON string.

```js
var json = myShell.toJson();
```

You can use the [`ShellEmulator.loadFromJson()`](#loadFromJson) function to load the state of the shell from a JSON string.

## `ShellEmulator.loadFromJson()`

This function is used to load a snapshot of the shell from a JSON string.

```js
myShell.loadFromJson(json);
```

To generate a snapshot, use the [`ShellEmulator.toJson()`](#toJson) function.

## `ShellEmulator.fs.*`

The `ShellEmulator.fs` Object is the object that represents the file system.

More information about the file system can be found in the [FakeFileSystem.js](https://github.com/SkwalExe/FakeFileSystem.js/wiki) documentation.

# Built in commands 🔧

## `touch`

This command is used to create an empty file.

```bash
touch file.txt
```

## `ls`

This command is used to list the files in the current directory.

```bash
ls
> file.txt
```

## `rm`

This command is used to remove a file or a directory.

```bash
rm file.txt
```

## `cd`

This command is used to change the current directory.

```bash
cd /home/user
```

## `pwd`

This command is used to display the current directory.

```bash
pwd
> /home/user
```

## `mkdir`

This command is used to create a directory.

```bash
mkdir myDir
```

## `cat`

This command is used to display the content of a file.

```bash
cat file.txt
> Hello world !
```

## `echo`

This command is used to display text.
npm run lint && 
```bash
history
> ls
> cat file.txt
> echo Hello world !
```

## `help`

This command is used to display the help of the shell.

```bash
help
> skwalsh.js [help][touch][ls][rm][cd][pwd][mkdir][cat][echo][history][cp][mv]
> -----------------
> linux shell emulator for javascript
> Author : @SkwalExe
> -----------------
> Options :
>   help : Display this help
>   touch : Create a new empty file
>   ls : List files in the current directory or the specified one
>   rm : Remove the specified file/directory
>   cd : Change the current working directory
>   pwd : Print the current working directory
>   mkdir : Create a new directory
>   cat : Display the contents of a file
>   echo : Echo the specified string
>   history : Display the history of commands
>   cp : Copy a file
>   mv : Move a file
>   alias : Create an alias
>   [command] : Execute the specified command
```

## `cp`

This command is used to copy a file.

```bash
cp file.txt file2.txt
```

## `mv`

This command is used to move a file.

```bash
mv file.txt file2.txt
```

## `alias`

This command is used to create an alias for a command.

```bash
alias list ls
list
> file.txt
```

## `file`

This command is used to determine the type of a file : file, or directory.

```bash
file file.txt
> file.txt: regular file
```

## `true`

This command is used to return a success code.

```bash
true; echo $?
> 0
```

## `false`

This command is used to return a failure code.

```bash
false; echo $?
> 1
```

## `basename`

This command is used to return the name of the file or the last part of the path.

```bash
basename file.txt
> file.txt
basename /home/user/file.txt
> file.txt
```

# final

If you have any problem, don't hesitate to open an issue

# Contributing

1. Start by [**forking** this repository](https://github.com/SkwalExe/skwash.js/fork)

2. Then clone your fork to your local machine.
  ```git
  git clone https://github.com/your-username/skwash.js.git
  ```

3. Install dev dependencies
```npm
npm install --save-dev
```

4. Create a new branch
  ```git
  git checkout -b super-cool-feature
  ```

5. Then make your changes

6. Update the changelog and version number if needed (using [Semantic Versioning](https://semver.org)) also, update the version number in the JsDelivr links (js and css)
  ```bash
  # bug fix
  npm version patch --no-git-tag-version

  # add a new feature 
  npm version minor --no-git-tag-version
  
  # changes that break backwards compatibility
  npm version major --no-git-tag-version
  ```

7. List and correct linting errors
  ```bash
  npm run lint
  ```

8. Update the minified/browser version of the library
  ```bash
  npm run build
  ```


9. Once you're done, commit your changes and push them to the remote repository.
  ```git
  git add --all
  git commit -m "Add super-cool-feature"
  git push origin super-cool-feature
  ```

10. Then, open a pull request on GitHub from your fork.
    1. Go to [this link](https://github.com/SkwalExe/skwash.js/compare/)
    2. Click compare across forks
    3. On the right, on `head repository` select your fork
    4. And on `compare` select the branch you just created
    5. Click on `Create Pull Request` and submit your pull request 

<a href="https://github.com/SkwalExe#ukraine"><img src="https://raw.githubusercontent.com/SkwalExe/SkwalExe/main/ukraine.jpg" width="100%" height="15px" /></a>