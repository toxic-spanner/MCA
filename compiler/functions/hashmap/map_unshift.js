exports.name = "map_unshift";
exports.call = function(map, element) {
    this.expectMap(map);

    map.numericFor(function(index, item) {
        map.removeIndex(index);
        map.setIndex(index + 1, item);
    });

    map.setIndex(0, element);
};