exports.name = "str_slice";
exports.call = function(str, beginSlice, endSlice) {
    str = this.castString(str);
    beginSlice = this.castNumber(beginSlice);

    var strLength = str.length;
    endSlice = this.castNumber(endSlice || strLength - 1);
    this.expect("endSlice", endSlice < strLength);

    if (endSlice < 0) endSlice += str.length;

    return str.slice(beginSlice, endSlice);
};