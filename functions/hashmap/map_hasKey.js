exports.name = "map_hasKey";
exports.call = function(map, key) {
    key = this.cast(["string", "number"], key);
    map = this.castMap(map);

    if (typeof key === 'number') {
        if (map.numberKeyNames.indexOf(key) !== -1) return true;
    }
    if (typeof key === 'string') {
        if (map.stringKeyNames.indexOf(key) !== -1) return true;
    }
};