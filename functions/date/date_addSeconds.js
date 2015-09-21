exports.name = "date_addSeconds";
exports.call = function(date, seconds) {
    this.expectNumber(seconds);

    var d = new Date(date);
    d.setUTCSeconds(d.getUTCSeconds() + seconds);
    return d.getTime();
};