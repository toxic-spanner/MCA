exports.name = "str_endsWith";
exports.call = function(str, substr, position) {
    str = this.castString(str);
    substr = this.castString(substr);

    var strLength = str.length;

    position = this.castNumber(position || strLength);
    this.expect("position", position <= strLength);

    if (position < 0) position += strLength;

    var index = str.lastIndexOf(substr, position);
    return index === str.length - substr.length;
};