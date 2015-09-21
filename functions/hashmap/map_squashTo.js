var errors = require('../../errors');

exports.name = "map_squashTo";
exports.call = function(map1, map2) {
    return squashTo(map1, map2, []);
};

function squashTo(map1, map2, encounteredMaps) {
    this.expectMap(map1);
    map2 = this.castMap(map2);

    map2.for(function(index, item) {
        var newValue = item;
        if (item.isMap) {
            var map1Item = map1.getIndex(index);
            if (map1Item.isMap) {
                // todo: this might not be needed
                if (encounteredMaps.indexOf(item)) errors.recursiveError("Recursive call to squashTo");

                squashTo(map1Item, item, encounteredMaps);
                newValue = map1Item;

                encounteredMaps.push(item);
            }
        }
        map1.setIndex(index, newValue);
    });
}