exports.name = "str_trimRight";
exports.call = function(str) {
    return this.castString(str).replace(/\s+$/, "");
};