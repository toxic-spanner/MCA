exports.name = "date_getSeconds";
exports.call = function(date) {
    this.expectNumber(date);

    return (new Date(date)).getUTCSeconds();
};