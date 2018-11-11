import { FieldType } from "./FieldType";
import { tryGetValue, getNumberFromAttrOrDefault, isNullOrEmpty } from "./Util";
import { ValidationResult } from "./ValidationResult";
export var ruleSearchList = [
    {
        fieldTypes: [FieldType.Text, FieldType.Password, FieldType.Textarea, FieldType.Number, FieldType.Email],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var val = tryGetValue(elements[0]);
                if (isNullOrEmpty(val))
                    return ValidationResult.createError(elements, errorMessage);
                val = val.trim();
                var isValid = val !== "";
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Select],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = null;
                var selectedOption = Array.from(element.options).filter(function (x) { return x.selected; })[0];
                if (selectedOption) {
                    val = selectedOption.getAttribute("value");
                }
                if (isNullOrEmpty(val))
                    return ValidationResult.createError(elements, errorMessage);
                val = val.trim();
                var isValid = val !== "";
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Text, FieldType.Password, FieldType.Textarea, FieldType.Email],
        instance: {
            name: "minlength",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                val = val.trim();
                var minLength = parseInt(element.dataset["valMinlength"] || 0);
                var isValid = val.length >= minLength;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", minLength.toString());
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Text, FieldType.Password, FieldType.Textarea, FieldType.Email],
        instance: {
            name: "maxlength",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                val = val.trim();
                var maxLength = parseInt(element.dataset["valMaxlength"] || 0);
                var isValid = val.length <= maxLength;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", maxLength.toString());
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Checkbox, FieldType.Radio],
        instance: {
            name: "required",
            apply: function (elements, errorMessage) {
                var isValid = elements.map(function (x) { return x.checked; }).filter(function (x) { return x; }).length > 0;
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Number],
        instance: {
            name: "range",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var min = getNumberFromAttrOrDefault(element, "min", -9999999999999999);
                var max = getNumberFromAttrOrDefault(element, "max", 9999999999999999);
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = min <= numValue && numValue <= max;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", min.toString()).replace("{1}", max.toString());
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Number],
        instance: {
            name: "min",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var min = getNumberFromAttrOrDefault(element, "min", -9999999999999999);
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = min <= numValue;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", min.toString());
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Number],
        instance: {
            name: "max",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var max = getNumberFromAttrOrDefault(element, "min", 9999999999999999);
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                var numValue = parseFloat(val);
                var isValid = numValue <= max;
                if (!isValid)
                    errorMessage = errorMessage.replace("{0}", max.toString());
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Email],
        instance: {
            name: "email",
            apply: function (elements, errorMessage) {
                var element = elements[0];
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                var rx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var isValid = val.match(rx) != null;
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    }
];
//# sourceMappingURL=RuleSearchList.js.map