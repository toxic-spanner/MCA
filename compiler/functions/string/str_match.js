exports.name = "str_match";
exports.call = function(str, regexp) {
    str = this.castString(str);
    regexp = this.castString(regexp);

    var result = {};
    tryRegex(str, result);
    this.expect("regexp", result.regex);

    return str.match(result.regex);
};

function tryRegex(str, result) {
    try {
        result.regex = new RegExp(str);
    } catch (e) {
        result.regex = false;
    }
}