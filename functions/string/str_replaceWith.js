exports.name = "str_replaceWith";
exports.call = function(str, substr, newSubstr) {
    str = this.castString(str);
    substr = this.castString(substr);
    newSubstr = this.castString(newSubstr);
};