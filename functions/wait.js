exports.name = "wait";
exports.call = function(ticks) {
    this.pushWait(ticks);
};