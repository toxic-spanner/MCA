var errors = require('../../errors');

exports.name = "map_squash";
exports.call = function(map1, map2) {
    return squash(map1, map2, []);
};

function squash(map1, map2, encounteredMaps) {
    map1 = this.castMap(map1);
    map2 = this.castMap(map2);

    var result = map1.clone();

    map2.for(function(index, item) {
        var newValue = item;
        if (item.isMap) {
            var map1Item = map1.getIndex(index);
            if (map1Item.isMap) {
                // todo: this might not be needed
                if (encounteredMaps.indexOf(item)) errors.recursiveError("Recursive call to squash.");

                newValue = squash(map1Item, item, encounteredMaps);

                encounteredMaps.push(item);
            }
        }
        result.setIndex(index, newValue);
    });

    return result;
}