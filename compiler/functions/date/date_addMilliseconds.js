exports.name = "date_addMilliseconds";
exports.call = function(date, milliseconds) {
    this.expectNumber(milliseconds);

    var d = new Date(date);
    d.setUTCMilliseconds(d.getUTCMilliseconds() + milliseconds);
    return d.getTime();
};