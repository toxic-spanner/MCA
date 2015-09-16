exports.name = "str_repeat";
exports.call = function(str, count) {
    str = this.castString(str);
    count = this.castNumber(count);

    var result = "";
    for (var i = 0; i < count; i++) {
        result += str;
    }
    return result;
};