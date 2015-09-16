exports.name = "str_trimLeft";
exports.call = function(str) {
    return this.castString(str).replace(/^\s+/, "");
};