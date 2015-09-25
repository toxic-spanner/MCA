var Block = require('../types/Block');

exports.type = "BlockStatement";
exports.call = function(node, ctx, execute) {
    var obj = {};
    obj[node.params.length] = {
        params: node.params,
        block: node.body
    };

    return new Block(obj);
};