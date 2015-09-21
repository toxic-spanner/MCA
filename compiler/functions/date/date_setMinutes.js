exports.name = "date_setMinutes";
exports.call = function(date, minutesValue) {
    this.expectNumber(minutesValue);

    var d = new Date(date);
    d.setUTCMinutes(minutesValue);
    return d.getTime();
};