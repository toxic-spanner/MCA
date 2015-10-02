module.exports = require('../getResource')([
    require('./assignment'),

    require('./binaryAnd'),
    require('./binaryOr'),

    require('./comparisonEqual'),
    require('./comparisonGt'),
    require('./comparisonGte'),
    require('./comparisonLt'),
    require('./comparisonLte'),
    require('./comparisonNotEqual'),

    require('./logicalAnd'),
    require('./logicalOr'),

    require('./mathDivide'),
    require('./mathMinus'),
    require('./mathModulo'),
    require('./mathMultiply'),
    require('./mathPlus'),

    require('./shiftLeft'),
    require('./shiftRight'),
    require('./shiftURight'),

    require('./unaryAdd'),
    require('./unaryBinaryNot'),
    require('./unaryNegative'),
    require('./unaryNot'),
    require('./unaryPositive'),
    require('./unarySubtract')
]);