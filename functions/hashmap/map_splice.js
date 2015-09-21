exports.name = "map_splice";
exports.call = function(map, start, deleteCount, insert) {
    this.expectMap(map);
    start = this.castNumber(start);
    deleteCount = this.castNumber(deleteCount);
    insert = this.castMap(insert || []);

    var removed = [];

    // how much to move all elements after the deleted items
    var postOffset = insert.numericLength() - deleteCount;

    var end = start + deleteCount;

    // remove the items
    for (var i = start; i < end; i++) {
        removed.push(map.getIndex(i));
        map.removeIndex(i);
    }

    // offset the other items
    var numericLength = map.numericLength();
    for (var x = end; x < numericLength; x++) {
        var value = map.getIndex(x);
        map.removeIndex(x);
        map.setIndex(x + postOffset, value);
    }

    // insert the new items
    insert.for(function(index, item) {
        if (typeof index === "number") map.setIndex(start + index + 1, item);
        else map.setIndex(index, item);
    });

    return removed;
};