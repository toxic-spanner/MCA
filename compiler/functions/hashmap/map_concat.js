exports.name = "map_concat";
exports.call = function(map1, map2) {
    map1 = this.castMap(map1);
    map2 = this.castMap(map2);

    var result = map1.clone();
    var offset = map1.numericLength();

    map2.for(function(index, item) {
        if (typeof index === "number") result.setIndex(index + offset, item);
        else result.setIndex(index, item);
    });

    return result;
};