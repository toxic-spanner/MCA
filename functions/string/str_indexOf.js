exports.name = "str_indexOf";
exports.call = function(str, substr, position) {
    str = this.castString(str);
    substr = this.castString(substr);

    position = this.castNumber(position || 0);
    this.expect("position", position < str.length);

    if (position < 0) position += str.length;

    return str.indexOf(substr, position);
};