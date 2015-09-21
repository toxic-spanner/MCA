exports.name = "date_addHours";
exports.call = function(date, addHours) {
    this.expectNumber(addHours);

    var d = new Date(date);
    d.setUTCHours(d.getUTCHours() + addHours);
    return d.getTime();
};