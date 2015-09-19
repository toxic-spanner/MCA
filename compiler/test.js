var compiler = require('./');
var fs = require('fs');

var contents = fs.readFileSync('E:/Documents/GitHub/radioactive-toolbox/builder/flags/IS_FLAG.mca', 'utf8');

var ast = compiler.parse(contents);
//console.log(JSON.stringify(ast, null, 2));

try {
    var types = require('./types');

    console.log("Execution tree:");
    var result = compiler.compile(ast);
    console.log(">", require('util').inspect(result.result, {colors: true}));
    console.log("Commands:");
    console.log(result.context.commandStructure.map(function(item) {
        return types.Command.cast.string(item);
    }).join("\n"));

} catch (ex) {
    if (ex.loc) ex.message += " on line " + ex.loc.start.line + " column " + ex.loc.start.column;
    console.log(ex.stack);
}