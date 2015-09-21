exports.name = "date_setHours";
exports.call = function(date, hoursValue) {
    this.expectNumber(hoursValue);

    var d = new Date(date);
    d.setUTCHours(hoursValue);
    return d.getTime();
};