exports.name = "map_push";
exports.call = function(map, element) {
    this.expectMap(map);

    var length = map.numericLength();
    map.setIndex(length, element);
};