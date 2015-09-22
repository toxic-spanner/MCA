var errors = require('../errors');

function Hashmap() {
    this.isMap = true;

    this.stringKeyNames = [];
    this.numberKeyNames = [];
    this.stringKeys = {};
    this.numberKeys = {};
}

Hashmap.prototype.toJSON = function() {
    return Hashmap.toJSON(this, function(item) {
        return item.toJSON ? item.toJSON() : item;
    });
};

Hashmap.prototype.keys = function() {
    return this.stringKeyNames.concat(this.numberKeyNames);
};

Hashmap.prototype.values = function() {
    var values = [];
    this.stringKeyNames.forEach(function(key) {
        values.push(this.stringKeys[key]);
    }.bind(this));
    this.numberKeyNames.forEach(function(key) {
        values.push(this.numberKeys[key]);
    }.bind(this));
    return values;
};

Hashmap.prototype.toObject = function(call) {
    call = call || function(item) { return item; };

    var result = {};
    this.stringKeyNames.forEach(function(key) {
        var item = call(this.stringKeys[key]);
        if (item.isMap) item = item.toObject(call);
        result[key] = item;
    }.bind(this));
    this.numberKeyNames.forEach(function(key) {
        var item = call(this.numberKeys[key]);
        if (item.isMap) item = item.toObject(call);
        result[key] = item;
    }.bind(this));
    return result;
};

Hashmap.prototype.clone = function() {
    var stringKeyNames = [];
    var numberKeyNames = [];
    var stringKeys = {};
    var numberKeys = {};
    var map = new Hashmap();

    this.stringKeyNames.forEach(function(key) {
        stringKeyNames.push(key);
        stringKeys[key] = this.stringKeys[key];
    }.bind(this));
    this.numberKeyNames.forEach(function(key) {
        numberKeyNames.push(key);
        numberKeys[key] = this.numberKeys[key];
    }.bind(this));

    map.stringKeyNames = stringKeyNames;
    map.numberKeyNames = numberKeyNames;
    map.stringKeys = stringKeys;
    map.numberKeys = numberKeys;
    return map;
};

Hashmap.prototype.numericLength = function() {
    var largestKey = 0;
    this.numberKeyNames.forEach(function(key) {
        if (key > largestKey) largestKey = key;
    });
    return largestKey + 1;
};

Hashmap.prototype.for = function(call) {
    if (this.stringFor(call)) return this.numericFor(call);
    return false;
};

Hashmap.prototype.stringFor = function(call) {
    var stringLength = this.stringKeyNames.length;
    var i, keyName;

    for (i = 0; i < stringLength; i++) {
        keyName = this.stringKeyNames[i];
        if (call(keyName, this.stringKeys[keyName]) === false) return false;
    }
    return true;
};

Hashmap.prototype.numericFor = function(call) {
    var numberLength = this.numberKeyNames.length;
    var i, keyName;

    for (i = 0; i < numberLength; i++) {
        keyName = this.numberKeyNames[i];
        if (call(keyName, this.numberKeys[keyName]) === false) return false;
    }
    return true;
};

Hashmap.prototype.setIndex = function(key, value) {
    if (typeof key === "number") {
        this.numberKeys[key] = value;
        if (this.numberKeyNames.indexOf(key) === -1) this.numberKeyNames.push(key);
    } else {
        this.stringKeys[key] = value;
        if (this.stringKeyNames.indexOf(key) === -1) this.stringKeyNames.push(key);
    }
};

Hashmap.prototype.removeIndex = function(key) {
    var index;
    if (typeof key === 'number') {
        index = this.numberKeyNames.indexOf(key);
        if (index !== -1) this.numberKeyNames.splice(index, 1);
    } else {
        index = this.stringKeyNames.indexOf(key);
        if (index !== -1) this.stringKeyNames.splice(index, 1);
    }
};

Hashmap.prototype.getIndex = function(key) {
    if (typeof key === "number") {
        if (this.numberKeys.hasOwnProperty(key.toString())) return this.numberKeys[key];
    } else if (this.stringKeys.hasOwnProperty(key)) return this.stringKeys[key];

    errors.referenceError("Unknown map index " + key);
};

Hashmap.fromKeyValueList = function(list) {
    var map = new Hashmap();
    var nextAuto = 0;

    list.forEach(function(item) {
        var key = item.key;
        if (key == null) key = nextAuto++;

        if (typeof key === "number") {
            if (key >= nextAuto) nextAuto = item.value + 1;
            map.numberKeys[key] = item.value;
            map.numberKeyNames.push(key);
        } else {
            map.stringKeys[key] = item.value;
            map.stringKeyNames.push(key);
        }
    });

    return map;
};

Hashmap.fromArray = function(arr) {
    var map = new Hashmap();

    for (var i = 0; i < arr.length; i++) {
        map.numberKeys[i] = arr[i];
        map.numberKeyNames.push(i);
    }

    return map;
};

Hashmap.type = "map";
Hashmap.matches = function(map) {
    return map && map.isMap;
};
Hashmap.equal = function(map1, map2, ctx) {
    if (!arrayEqual(map1.stringKeyNames, map2.stringKeyNames)) return false;
    if (!arrayEqual(map1.numberKeyNames, map2.numberKeyNames)) return false;

    var keyName, i;
    for (i = 0; i < map1.stringKeyNames; i++) {
        keyName = map1.stringKeyNames[i];
        if (ctx.notStrictEqual(map1.stringKeys[keyName], map2.stringKeys[keyName])) return false;
    }
    for (i = 0; i < map1.numberKeyNames; i++) {
        keyName = map1.numberKeyNames[i];
        if (ctx.notStrictEqual(map1.numberKeys[keyName], map2.numberKeys[keyName])) return false;
    }
    return true;
};
Hashmap.toJSON = function(map, toJSON) {
    // if it is only a numeric map, use an array
    if (!map.stringKeyNames.length) {
        var result = [];
        map.numberKeyNames.forEach(function(key) {
            result[key] = map.numberKeys[key];
        });
        return result;
    }
    return map.toObject(function(item) {
        return toJSON(item);
    });
};
Hashmap.cast = {
    string: function(map) {
        return JSON.stringify(map.toObject());
    },
    boolean: function(map) {
        return map.stringKeyNames.length > 0 || map.numberKeyNames.length > 0;
    }
};

function arrayEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    a = a.sort();
    b = b.sort();

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

module.exports = Hashmap;