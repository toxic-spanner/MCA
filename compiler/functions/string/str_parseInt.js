exports.name = "str_parseInt";
exports.call = function(str, radix) {
    str = this.castString(str);
    if (radix) return parseInt(str, this.castNumber(radix));
    else return parseInt(str);
};