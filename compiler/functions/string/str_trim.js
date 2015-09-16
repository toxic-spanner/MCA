exports.name = "str_trim";
exports.call = function(str) {
    return this.castString(str).trim();
};