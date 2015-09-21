exports.type = "Identifier";
exports.call = function(node, ctx, execute) {
    if (ctx.macros[node.name] && ctx.macros[node.name].hasOverload(0)) {
        var macro = ctx.macros[node.name];
        return macro.getOverload(0).execute(ctx, []);
    }

    return ctx.getVariable(node.name);
};