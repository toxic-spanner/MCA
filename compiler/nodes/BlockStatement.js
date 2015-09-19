var Block = require('../types/Block');

exports.type = "BlockStatement";
exports.call = function(node, ctx, execute) {
    return new Block({ 0: {
        params: [],
        block: node
    } });
};