exports.name = "date_create";
exports.call = function(year, month, day, hour, minute, second, millisecond) {
    this.expectNumber(year);
    this.expectNumber(month);
    this.expectNumber(day = day || 1);
    this.expectNumber(hour = hour || 0);
    this.expectNumber(minute = minute || 0);
    this.expectNumber(second = second || 0);
    this.expectNumber(millisecond = millisecond || 0);

    if (year < 100) year += 1900;

    year = Math.max(1900, year);
    month = clamp(month, 0, 11);
    day = clamp(day, 1, 31);
    hour = clamp(hour, 0, 23);
    minute = clamp(minute, 0, 59);
    second = clamp(second, 0, 59);
    millisecond = clamp(millisecond, 0, 999);

    return Date.UTC(year, month, day, hour, minute, second, millisecond);
};

function clamp(number, min, max) {
    if (number < min) return min;
    if (number > max) return max;
    return number;
}