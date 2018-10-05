export var nodeListToArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
};
export var tryGetValue = function (element) {
    var val = element.value;
    return val;
};
export var getNumberFromAttrOrDefault = function (element, attrName, defaultValue) {
    return parseFloat(element.getAttribute(attrName) || defaultValue);
};
export var isNullOrEmpty = function (value) {
    return value == null || value === "";
};
//# sourceMappingURL=Util.js.map