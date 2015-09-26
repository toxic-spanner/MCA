# Roadmap

## Standard API
 - [ ] **Documentation!**
 - [ ] Synchronous file I/O API
 - [ ] Reflection API

## Language
 - [ ] **Documentation!**
 - [ ] Branchable blocks and macros (i.e MCIL branching support), such as `DO_THING?(a, b, c)` (syntax yet to be decided)
 - [ ] `@` player references in expressions, supporting parameters
   - Supports binary operations (e.g. `@p | @r` would select the nearest player as well as a random player, `@p & @r` would select the nearest player if they are the random player)
   - Casting to a string results in the selector as it would appear in a command
 - [ ] Explicit casting (something like `toString`?)
 - [ ] Some way to get arguments execution arguments (i.e argv)
 - [ ] Try/catch support


## Compiler
 - [ ] **Documentation!**
 - [ ] Simple all-in-one compile tool
 - [ ] REPL (maybe use a Minecraft server, interface with a plugin)
 - [ ] Stack traces
