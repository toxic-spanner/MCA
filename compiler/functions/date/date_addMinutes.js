exports.name = "date_addMinutes";
exports.call = function(date, minutes) {
    this.expectNumber(minutes);

    var d = new Date(date);
    d.setUTCMinutes(d.getUTCMinutes() + minutes);
    return d.getTime();
};