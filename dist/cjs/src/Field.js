"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationResult_1 = require("./ValidationResult");
var Field = (function () {
    function Field(fieldType) {
        this.elements = [];
        this.fieldType = fieldType;
    }
    Field.prototype.isValid = function () {
        var activeRules = this.rules.filter(function (x) { return x.isActive; });
        if (activeRules.length === 0)
            return ValidationResult_1.ValidationResult.createOk(this.elements);
        var firstError;
        for (var i = 0; i < activeRules.length; i++) {
            var ruleWrapper = activeRules[i];
            var errorMessage = ruleWrapper.errorMessage;
            var validationResult = ruleWrapper.instance.apply(this.elements, errorMessage);
            validationResult.errorRuleName = ruleWrapper.instance.name;
            if (!validationResult.isValid) {
                firstError = validationResult;
                break;
            }
        }
        if (firstError != null)
            return firstError;
        return ValidationResult_1.ValidationResult.createOk(this.elements);
    };
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=Field.js.map