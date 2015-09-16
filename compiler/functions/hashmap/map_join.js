exports.name = "map_join";
exports.call = function(map, separator) {
    map = this.castMap(map);
    separator = this.castString(separator || ',');

    var values = map.values();
    var result = [];
    for (var i = 0; i < values.length; i++) {
        result.push(this.castString(values[i]));
    }
    return result.join(separator);
};