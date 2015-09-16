exports.name = "map_values";
exports.call = function(map) {
    return this.castMap(map).values();
};