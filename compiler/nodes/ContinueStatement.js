var errors = require('../errors');

exports.type = "ContinueStatement";
exports.call = function() {
    errors.notAllowedError("continue is not allowed here");
};