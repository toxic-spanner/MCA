var Hashmap = require('./Hashmap');

exports.type = "string";
exports.matches = function(str) {
    return typeof str === "string";
};
exports.equal = function(str1, str2) {
    if (str1.length !== str2.length) return false;
    return str1 === str2;
};
exports.toJSON = function(str) {
    return str;
};
exports.cast = {
    number: function(str) {
        return parseFloat(str);
    },
    map: function(str) {
        return Hashmap.fromArray(str.split(""));
    },
    boolean: function(str) {
        return !!str;
    }
};