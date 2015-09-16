exports.name = "map_includes";
exports.call = function(map, search, index) {
    map = this.castMap(map);
    if (index) {
        index = this.castNumber(index);
        var mapLength = map.numericLength();

        this.expect(index, index < mapLength);

        if (index < 0) index += mapLength;

        for (var i = index; i < mapLength; i++) {
            if (map.getIndex(i).equals(search)) return true;
        }
    } else {
        var hasFound = false;
        map.for(function(index, item) {
            if (item.equals(search)) {
                hasFound = true;
                return false;
            }
        });
        if (hasFound) return true;
    }

    return false;
};