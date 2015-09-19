exports.name = "map_includes";
exports.call = function(map, search, index) {
    map = this.castMap(map);
    if (index) {
        index = this.castNumber(index);
        var mapLength = map.numericLength();

        this.expect(index, index < mapLength);

        if (index < 0) index += mapLength;

        for (var i = index; i < mapLength; i++) {
            if (this.strictEqual(map.getIndex(i), search)) return true;
        }
    } else {
        var hasFound = false;
        map.for(function(index, item) {
            if (this.strictEqual(item, search)) {
                hasFound = true;
                return false;
            }
        }.bind(this));
        if (hasFound) return true;
    }

    return false;
};