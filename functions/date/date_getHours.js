exports.name = "date_getHours";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCHours();
};