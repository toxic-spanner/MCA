exports.name = "str_lowerCase";
exports.call = function(str) {
    return this.castString(str).toLowerCase();
};