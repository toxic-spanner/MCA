exports.name = "date_setMilliseconds";
exports.call = function(date, millisecondsValue) {
    this.expectNumber(millisecondsValue);

    var d = new Date(date);
    d.setUTCMilliseconds(millisecondsValue);
    return d.getTime();
};