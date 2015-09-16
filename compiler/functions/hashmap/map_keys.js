exports.name = "map_keys";
exports.call = function(map) {
    return this.castMap(map).keys();
};