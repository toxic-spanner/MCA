exports.name = "map_shift";
exports.call = function(map) {
    this.expectMap(map);

    var length = map.numericLength();
    if (!length) return null;

    var firstItem = map.getIndex(0);

    map.numericFor(function(index, item) {
        map.removeIndex(index);
        map.setIndex(index - 1, item);
    });

    return firstItem;
};