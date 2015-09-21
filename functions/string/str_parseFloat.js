exports.name = "str_parseFloat";
exports.call = function(str) {
    str = this.castString(str);
    return parseFloat(str);
};