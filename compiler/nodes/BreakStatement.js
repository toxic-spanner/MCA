var errors = require('../errors');

exports.type = "BreakStatement";
exports.call = function() {
    errors.notAllowedError("break is not allowed here");
};