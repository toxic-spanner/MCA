var Hashmap = require('../types/Hashmap');

exports.type = "MapExpression";
exports.call = function(node, ctx, execute) {
    return Hashmap.fromKeyValueList(execute(node.elements));
};