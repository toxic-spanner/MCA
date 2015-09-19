var Block = require('../types/Block');

exports.type = "Program";
exports.call = function(node, ctx, execute) {
    ctx.macros = {};
    Object.keys(node.macros).forEach(function(name) {
        var overloadItems = {};
        var overloads = node.macros[name];

        Object.keys(overloads).forEach(function(overload) {
            var statement = overloads[overload];
            overloadItems[overload] = {
                params: statement.params,
                block: statement.body
            };
        });
        ctx.macros[name] = new Block(overloadItems);
    });

    return execute(node.body);
};