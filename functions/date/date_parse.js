exports.name = "date_parse";
exports.call = function(dateString) {
    return Date.parse(this.castString(dateString));
};