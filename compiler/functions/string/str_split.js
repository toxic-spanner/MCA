exports.name = "str_split";
exports.call = function(str, separator, limit) {
    str = this.castString(str);
    separator = this.castString(separator || "");

    if (limit) return str.split(separator, this.castNumber(limit));
    else str.split(separator);
};