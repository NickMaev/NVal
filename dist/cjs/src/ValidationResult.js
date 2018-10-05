"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationResult = (function () {
    function ValidationResult() {
    }
    ValidationResult.createError = function (elements, errorMessage) {
        var result = new ValidationResult();
        result.message = errorMessage;
        result.elements = elements;
        result.isValid = false;
        return result;
    };
    ValidationResult.createOk = function (elements) {
        var result = new ValidationResult();
        result.isValid = true;
        result.elements = elements;
        return result;
    };
    return ValidationResult;
}());
exports.ValidationResult = ValidationResult;
//# sourceMappingURL=ValidationResult.js.map