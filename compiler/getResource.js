module.exports = function getResource(root) {
    var result = {};
    root.forEach(function(item) {
        if (Array.isArray(item)) {
            var child = getResource(item);
            Object.keys(child).forEach(function(key) {
                result[key] = child[key];
            });
        } else if (item) {
            if (item.name) result[item.name] = item;
            else if (item.type) result[item.type] = item;
        }
    });
    return result;
};