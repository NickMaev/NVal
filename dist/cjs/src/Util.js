"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeListToArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
};
exports.tryGetValue = function (element) {
    var val = element.value;
    return val;
};
exports.getNumberFromAttrOrDefault = function (element, attrName, defaultValue) {
    return parseFloat(element.getAttribute(attrName) || defaultValue);
};
exports.isNullOrEmpty = function (value) {
    return value == null || value === "";
};
//# sourceMappingURL=Util.js.map