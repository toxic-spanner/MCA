var clc = require('cli-color');

// font styles
exports.errorHeader = clc.redBright;
exports.errorMessage = clc.red;
exports.sectionHeader = clc.green;

exports.evenLocation = clc.blackBright;
exports.oddLocation = clc.white;

exports.warningTag = clc.redBright;
exports.specialTag = clc.cyanBright;
exports.specialAttribute = clc.magentaBright;
exports.tag = clc.cyan;
exports.attribute = clc.magenta;
exports.attributeType = clc.blueBright;
exports.attributeValue = clc.white;

exports.bullet = clc.yellow;
exports.branchName = clc.green;
exports.noCommands = clc.blackBright.italic;
exports.command = clc.cyan;
exports.commandContent = clc.magenta;

exports.showError = function(header, ex) {
    console.error(common.errorHeader(header));
    console.error(common.errorMessage(ex && ex.stack ? ex.stack : ex));
    process.exit(1);
};

function pad(number, limit, character, right) {
    number += "";
    if (number.length < limit) {
        if (right) return character + pad(number, limit - 1, right);
        return pad(number, limit - 1, right) + character;
    }
    return number;
}
exports.pad = pad;

exports.formatLocation = function(loc) {
    return pad(pad(loc.line, 2, "0", true), 3, " ", true) + ":" + pad(pad(loc.column, 2, "0", true), 3, " ");
};

exports.put = function(text) {
    process.stdout.write(text, 'utf8');
};

var indentAmount = 4;

exports.indent = 8;

function ind(add) {
    add = add || 0;
    process.stdout.write(clc.move.right(exports.indent + add));
}
exports.ind = ind;

function getAttributes(attributes, keyStyle, typeStyle, valueStyle) {
    var attributeTexts = [];

    for (var key in attributes) {
        if (!attributes.hasOwnProperty(key)) continue;

        var value = attributes[key];
        var valueType = typeof value;

        if (valueType !== "string" && valueType !== "number" && valueType !== "boolean") continue;

        var attr = keyStyle(key);
        if (typeStyle) attr += typeStyle("(" + valueType + ")");

        attributeTexts.push(attr + keyStyle('="') + valueStyle(value) +
            keyStyle('"'));
    }
    return attributeTexts.join(" ");
}

exports.startTag = function(name, attributes, indentOffset) {
    exports.startSpecialTag(exports.tag, exports.attribute, exports.attributeType, exports.attributeValue, name,
        attributes, indentOffset);
};

exports.endTag = function(name, indentOffset) {
    exports.endSpecialTag(exports.tag, name, indentOffset);
};

exports.startSpecialTag = function(tagStyle, keyStyle, typeStyle, valueStyle, name, attributes, indentOffset) {
    ind(indentOffset);

    var attributeText = getAttributes(attributes, keyStyle, typeStyle, valueStyle);

    var tagStart = tagStyle("<" + name);
    if (attributeText.length) tagStart += " " + attributeText;
    console.log(tagStart + exports.tag(">"));

    exports.indent += indentAmount;
};

exports.endSpecialTag = function(tagStyle, name, indentOffset) {
    exports.indent -= indentAmount;

    ind(indentOffset);
    console.log(tagStyle("</" + name + ">"));
};