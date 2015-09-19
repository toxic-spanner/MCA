var errors = require('../errors');

exports.type = "CallExpression";
exports.call = function(node, ctx, execute) {
    // find if there is simply a variable, which could be a macro
    var variableName;
    var currentNode = node.block;
    while (!variableName) {
        if (currentNode.type === "Expression") currentNode = currentNode.expression;
        else if (currentNode.type === "Identifier") variableName = currentNode.name;
        else break;
    }

    var block;
    if (variableName) {
        if (ctx.macros[variableName]) block = ctx.macros[variableName];
        else block = ctx.getVariable(variableName);
    } else block = execute(node.block);

    if (!block || !block.isBlock) errors.typeError("Cannot call a non-block");

    var paramCount = node.params.length;

    if (!block.hasOverload(paramCount)) errors.callError("The block does not have an overload with that amount of parameters");

    var blockVariant = block.getOverload(paramCount);
    var params = execute(node.params);

    return blockVariant.execute(ctx, params);
};