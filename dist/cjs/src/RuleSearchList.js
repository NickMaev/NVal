"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldType_1 = require("./FieldType");
var Util_1 = require("./Util");
var ValidationResult_1 = require("./ValidationResult");
exports.ruleSearchList = [
    {
        fieldTypes: [FieldType_1.FieldType.Text, FieldType_1.FieldType.Password, FieldType_1.FieldType.Textarea, FieldType_1.FieldType.Number, FieldType_1.FieldType.Email],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var val = Util_1.tryGetValue(elements[0]);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createError(elements, errorMessage);
                val = val.trim();
                var isValid = val !== "";
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Select],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = null;
                var selectedOption = Array.from(element.options).filter(function (x) { return x.selected; })[0];
                if (selectedOption) {
                    val = selectedOption.getAttribute("value");
                }
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createError(elements, errorMessage);
                val = val.trim();
                var isValid = val !== "";
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Text, FieldType_1.FieldType.Password, FieldType_1.FieldType.Textarea, FieldType_1.FieldType.Email],
        instance: {
            name: "minlength",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                val = val.trim();
                var minLength = parseInt(element.dataset["valMinlength"] || 0);
                var isValid = val.length >= minLength;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", minLength.toString());
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Text, FieldType_1.FieldType.Password, FieldType_1.FieldType.Textarea, FieldType_1.FieldType.Email],
        instance: {
            name: "maxlength",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                val = val.trim();
                var maxLength = parseInt(element.dataset["valMaxlength"] || 0);
                var isValid = val.length <= maxLength;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", maxLength.toString());
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Checkbox, FieldType_1.FieldType.Radio],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var isValid = elements.map(function (x) { return x.checked; }).filter(function (x) { return x; }).length > 0;
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Number],
        instance: {
            name: "range",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var min = Util_1.getNumberFromAttrOrDefault(element, "min", -9999999999999999);
                var max = Util_1.getNumberFromAttrOrDefault(element, "max", 9999999999999999);
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = min <= numValue && numValue <= max;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", min.toString()).replace("{1}", max.toString());
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Number],
        instance: {
            name: "min",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var min = Util_1.getNumberFromAttrOrDefault(element, "min", -9999999999999999);
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = min <= numValue;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", min.toString());
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Number],
        instance: {
            name: "max",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var max = Util_1.getNumberFromAttrOrDefault(element, "min", 9999999999999999);
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = numValue <= max;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", max.toString());
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType_1.FieldType.Email],
        instance: {
            name: "email",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = Util_1.tryGetValue(element);
                if (Util_1.isNullOrEmpty(val))
                    return ValidationResult_1.ValidationResult.createOk(elements);
                var rx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var isValid = val.match(rx) != null;
                return isValid ? ValidationResult_1.ValidationResult.createOk(elements) :
                    ValidationResult_1.ValidationResult.createError(elements, errorMessage);
            }
        }
    }
];
//# sourceMappingURL=RuleSearchList.js.map