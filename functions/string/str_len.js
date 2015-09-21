exports.name = "str_len";
exports.call = function(str) {
    return this.castString(str).length;
};