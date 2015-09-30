# MCA Compiler

[Compiler Roadmap](https://github.com/toxic-spanner/mca-compiler/blob/master/ROADMAP.md) - [Language Roadmap](https://github.com/toxic-spanner/mca-language/blob/gh-pages/ROADMAP.md)

MCA is an assembly language that compiles to Minecraft circuitry, specifically Command Blocks. To simplify this, it also introduces a higher-level macro-based language that includes compile-time variables, functions, and operations.

This repository contains the MCA parser and compiler, which compiles to an intermediatery language named MCIL, as well as a set of command-line tools for compiling and debugging.

**This compiler currently implements [MCA v1.1.0](http://toxic-spanner.github.io/mca-language/).**

Documentation on the MCA language is at [toxic-spanner.github.io/mca-language](https://toxic-spanner.github.io/mca-language).

## Installation

The compiler is availabe from [NPM](https://npmjs.org/).

Install for command-line usage:
```shell
$ npm install mca-compiler -g
```

Install for Node-based usage:
```shell
$ npm install mca-compiler --save
```

## Command-line Usage

### Basic Usage

The compiler provides an all-in-one command, `build`, to simplify the build process. For more options, such as the ability to export the AST, or view various execution data, see the commands covered in the **Advanced usage** section.

The `mca-build` command is used to parse, compile, and then export the commands from some MCA code.

Usage:
```
mca-build [file] <builder> [--help] [-w <width>] [--width <width>] [-h <height>]
          [--height <height>] [-d <depth>] [--depth <depth>] [-c <input>] [--code <input>]
          [-o <file>] [--output <file>]
```

`mca-build` takes input code from `--code` (`-c` for short), `[file]` (a file path), or stdin (in that order of preference), parses it, executes it, and then passes the result to a builder to export.

If the `--output` flag (`-o` for short) is provided, the exported information from the builder will be written to the provided file - otherwise, it will be displayed on the console.

`builder` should be the name of a global or local 'builder' NPM package, or a builder command. This builder takes the output MCIL code, and converts it to some kind of format. For most cases, the official [`mcil-mcedit`](https://github.com/toxic-spanner/mcil-mcedit) package should be sufficient, as it exports an MCEdit schematic file. The value of the `--width` (or `-w` for short), `--height` (`-h` for short) and `--depth` (`-d` for short) is passed to the builder to specify the maximum width (x-axis), height (y-axis) and depth (z-axis) for the resulting object.

Builder packages should export a function `export(code, dimensions)`, where `code` is an MCIL object, and `dimensions` is an object with the properties `width`, `height`, and `depth`. Builder commands should accept arguments in the format `builder "<output>" --width <width> --height <height> --depth <depth>` where `<output>` is the name of the file to write the output to, and should take the MCIL JSON input via stdin.

### Advanced Usage

The compiler provides two advanced commands to facilitate with parsing, compilation, and debugging.

#### Parsing

The `mca-parse` command parses code and provides an abstract syntax tree (AST) in various formats.

Usage:
```
mca-parse [file] [-h] [--help] [-s] [--show] [-f] [--friendly]
          [-c <input>] [--code <input>] [-o <file>] [--output< file>]
```

`mca-parse` takes MCA code from `--code` (`-c` for short), `[file]` (a file path), or stdin (in that order), and parses it. If the `--show` (or `-s`) flag is set, the AST JSON will be sent to stdout. If the `--output` (or `-o`) flag is set, it will be written to the provided file, relative to the current directory.

The `--friendly` (or `-f`) flag formats the output of `--show` to be human-friendly, and aid debugging. It is represented in an XML-like tree view with the line positions of each node shown on the left.

**Note:** setting the `--friendly` flag will _not_ affect what `--output` writes to the file. To write the friendly output to a file, use a pipe (e.g. with bash, `mca-parse somefile.mca --friendly > friendly_ast`).

#### Compiling

The `mca-compile` command inputs an abstract syntax tree, and provides information on the execution of the code, as well as the compiled commands.

Usage:
```
mca-compile [ast] [-h] [--help] [-t] [--tree] [-r] [--result] [-c] [--compiled]
            [-f] [--friendly] [-l] [--log] [-o <file>] [--output <file>]
```

`mca-compile` takes a JSON-formatted AST from `[ast]` (a file path), or stdin (in that order), and executes it.

This command has various flags which enable different types of output. The `--tree` flag (`-t` for short) outputs a tree similar to an AST, but one that represents the order of execution of each node. The `--result` flag (`-r` for short) outputs the results from root-level expressions as JSON. The `--compiled` flag (`-c` for short) outputs the compiled MCIL as JSON.

If multiple outputs are enabled, they are outputted in the following order, separated by a new line:

1. `--tree`
2. `--result`
3. `--compiled`

The `--friendly` flag, or `-f` for short, enables a human-friendly formatting for each output. For the execution tree, this is an XML-like output similar to `--friendly` for the `mca-parse` command. For the result flag, this is formatted JSON (with colours). For the compiled flag, this is a list of branches and instructions in a simple format.

The `--log` (or `-l`) flag enables output from the program through the `.log` internal function. This is displayed before all other outputs, and each line is prepended with `[output]␣` (where `␣` is a trailing space) when the `--friendly` flag is _not_ present.

The `--output` flag, or `-o` for short, is similar to `mca-parse`'s output flag. It writes the compiled MCIL code (with no `--friendly` formatting) to the provided file, relative to the current directory.

#### All together, now

Both commands allow reading/writing from stdin and stdout respectively. This means that a file can be read, parsed, and compiled in one "command", such as the bash command, which will display the compiled MCIL in "friendly" mode:

```bash
mca-parse somefile.mca -s | mca-compile -c -f
```

Alternatively, offloading file reading to `cat`:
```bash
cat somefile.mca | mca-parse -s | mca-compile -c -f
```

### Code usage

Here we will outline how to parse and compile through Node. For more advanced operations, such as adding functions, check the documentation.

#### Parsing

The `mca-compiler` module exposes a `parse` function, which returns a root `Program` AST node.

Usage:
```
mca.parse(code, source);
```

`code` is the MCA code to parse, `source` is the source file location. If provided, `source` **must be an absolute path.**

Example:

```js
var mca = require('mca-compiler');

var ast = mca.parse(".log('hi')", "/");
```

#### Compiling

The module also exposes a `compile` function, which returns an object providing execution information.

Usage:
```
mca.compile(code, source);
```

`code` can either be a root Program AST node, or a string. If it is a string, it will be parsed using `mca.parse`, and the resulting AST will be used. `source` is only required if `code` is a string (otherwise it will be ignored).

`mca.compile` returns an object with the following properties:

```js
{
  execution: Array // the results from all root-level statements (i.e those that are direct
                   //   descendants of the Program node)
  compiled: Object // the resulting MCIL object
  context: Context // the execution context object
}
```

## License

The MCA compiler is licensed under the MIT license. More information is available in the LICENSE file.

_Toxic Spanner_ is not affiliated with Minecraft, Mojang, or Microsoft.
