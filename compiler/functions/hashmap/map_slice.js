exports.name = "map_slice";
exports.call = function(map, begin, end) {
    map = this.castMap(map);
    var mapLength = map.numericLength();

    begin = this.castNumber(begin || 0);
    this.expect("begin", begin < mapLength);

    end = this.castNumber(end || mapLength - 1);
    this.expect("end", end < mapLength);

    if (begin < 0) begin += mapLength;
    if (end < 0) end += mapLength;

    var result = [];
    for (var i = begin; i < end; i++) {
        result.push(map.getIndex(i));
    }
    return this.castMap(result);
};