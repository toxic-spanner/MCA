exports.name = "map_indexOf";
exports.call = function(map, search, index) {
    map = this.castMap(map);
    index = this.castNumber(index || 0);
    var mapLength = map.numericLength();

    this.expect(index, index < mapLength);

    if (index < 0) index += mapLength;

    for (var i = index; i < mapLength; i++) {
        if (map.getIndex(i).equals(search)) return i;
    }
    return -1;
};