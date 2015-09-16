exports.name = "map_concat";
exports.call = function(map1, map2) {
    this.expectMap(map1);
    map2 = this.castMap(map2);

    var offset = map1.numericLength();

    map2.for(function(index, item) {
        if (typeof index === "number") map1.setIndex(index + offset, item);
        else map1.setIndex(index, item);
    });
};