exports.name = "map_fill";
exports.call = function(map, value, start, end) {
    this.expectMap(map);

    var mapLength = map.numericLength();

    start = this.castNumber(start || 0);
    end = this.castNumber(end || mapLength);

    if (start < 0) start += mapLength;
    if (end < 0) end += mapLength;

    for (var i = start; i < end; i++) {
        map.setIndex(i, value);
    }
};