exports.name = "map_pop";
exports.call = function(map) {
    this.expectMap(map);

    var length = map.numericLength();
    if (!length) return null;

    var lastIndex = length - 1;
    var lastItem = map.getIndex(lastIndex);
    map.removeIndex(lastIndex);

    return lastItem;
};