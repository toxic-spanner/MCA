var errors = require('../errors');

exports.type = "ReturnStatement";
exports.call = function() {
    errors.notAllowedError("return is not allowed here");
};