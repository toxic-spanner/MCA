# Roadmap

 - [ ] Simple all-in-one build tool
 - [ ] REPL (use `mcil-common` and a virtual environment)
 - [ ] Branchable blocks and macros (i.e MCIL branching support)
   For example:
   ```mca
   DO_THING?(a, b, c);
   ```
 - [ ] `@` player references in expressions, supporting parameters
   - Supports binary operations (e.g. @p | @r would select the nearest player _and_ a random player, @p & @r would select the nearest player if they are the random player)
   - Casting to a string results in the selector as it would appear in a command
 - [ ] Explicit casting (something like `toString`?)
 - [ ] Some way to get arguments from the build command (i.e argv)
 - [ ] Synchronous file I/O API
 - [ ] Reflection API
 - [ ] Stack traces
 - [ ] try/catch support