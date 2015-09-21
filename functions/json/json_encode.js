var types = require('../../types');
var errors = require('../../errors');

function encode(obj) {
    for (var name in types) {
        if (!types.hasOwnProperty(name)) continue;

        var type = types[name];
        if (type.matches && type.matches(obj) && type.toJSON) {
            return type.toJSON(obj, encode);
        }
    }
    errors.typeError("Cannot serialize JSON structure");
}

exports.name = "json_encode";
exports.call = function(obj) {
    return JSON.stringify(encode(obj));
};