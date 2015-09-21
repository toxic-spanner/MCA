exports.name = "date_setSeconds";
exports.call = function(date, secondsValue) {
    this.expectNumber(secondsValue);

    var d = new Date(date);
    d.setUTCSeconds(secondsValue);
    return d.getTime();
};