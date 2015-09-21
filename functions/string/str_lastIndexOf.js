exports.name = "str_lastIndexOf";
exports.call = function(str, substr, position) {
    str = this.castString(str);
    substr = this.castString(substr);

    var strLength = str.length;
    position = this.castNumber(position || strLength);
    this.expect("position", position <= strLength);

    if (position < 0) position += str.length;

    return str.lastIndexOf(substr, position);
};