import { ValidationResult } from "./ValidationResult";
var Field = (function () {
    function Field(fieldType) {
        this.elements = [];
        this.fieldType = fieldType;
    }
    Field.prototype.isValid = function () {
        var activeRules = this.rules.filter(function (x) { return x.isActive; });
        if (activeRules.length === 0)
            return ValidationResult.createOk(this.elements);
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
        return ValidationResult.createOk(this.elements);
    };
    return Field;
}());
export { Field };
//# sourceMappingURL=Field.js.map