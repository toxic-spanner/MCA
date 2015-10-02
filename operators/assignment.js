var getAssignable = require('../getAssignable');

exports.type = '=';
exports.call = function(left, right, ctx, execute) {
    var assignable = getAssignable(left, ctx);
    return assignable.setValue(execute(right));
};