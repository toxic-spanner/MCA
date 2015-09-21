var Command = require('../types/Command');

exports.type = "CommandLiteral";
exports.call = function(node, ctx, execute) {
    var paramValues = node.params.map(function(item) {
        if (typeof item === "string") return item;
        return ctx.castString(execute(item));
    });

    var params = paramValues.join("").trim();
    ctx.pushCommand(node.name, params);
    return new Command(node.name, params);
};