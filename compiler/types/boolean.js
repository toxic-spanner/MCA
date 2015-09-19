exports.type = "boolean";
exports.matches = function(bool) {
    return typeof bool === "boolean";
};
exports.equal = function(bool1, bool2) {
    return bool1 === bool2;
};
exports.toJSON = function(bool) {
    return exports.cast.number(bool);
};
exports.cast = {
    number: function(bool) {
        return bool ? 1 : 0;
    },
    string: function(bool) {
        return bool ? "1" : "0";
    }
};