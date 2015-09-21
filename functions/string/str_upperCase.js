exports.name = "str_upperCase";
exports.call = function(str) {
    return this.castString(str).toUpperCase();
};