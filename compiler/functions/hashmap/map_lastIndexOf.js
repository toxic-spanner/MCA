exports.name = "map_lastIndexOf";
exports.call = function(map, search, index) {
    map = this.castMap(map);
    var mapLength = map.numericLength();

    index = this.castNumber(index || mapLength);
    this.expect("index", index <= mapLength);

    if (index < 0) index += mapLength;

    for (var i = index - 1; i >= 0; i--) {
        if (map.getIndex(i).equals(search)) return i;
    }
    return -1;
};