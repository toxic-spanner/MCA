exports.name = "str_charAt";
exports.call = function(str, index) {
    str = this.castString(str);
    index = this.castString(index);
    this.expect("index", index < str.length);

    if (index < 0) index += str.length;

    return str.charAt(index);
};