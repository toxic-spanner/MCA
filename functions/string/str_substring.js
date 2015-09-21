exports.name = "str_substring";
exports.call = function(str, indexStart, indexEnd) {
    str = this.castString(str);
    indexStart = this.castNumber(indexStart);
    this.expect("indexStart", indexStart <= strLength);

    var strLength = str.length;

    indexEnd = this.castNumber(indexEnd || strLength - 1);
    this.expect("indexEnd", indexEnd <= strLength);

    if (indexStart < 0) indexStart += strLength;
    if (indexEnd < 0) indexEnd += strLength;

    return str.substring(indexStart, indexEnd);
};