import { FieldType } from "./FieldType";
import { tryGetValue, getNumberFromAttrOrDefault, isNullOrEmpty } from "./Util";
import { ValidationResult } from "./ValidationResult";
import { IRuleSearchItem } from "./IRuleSearchItem";

export const ruleSearchList: IRuleSearchItem[] = [
    {
        fieldTypes: [FieldType.Text, FieldType.Password, FieldType.Textarea, FieldType.Number, FieldType.Email],
        instance: {
            name: "required",
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                var element = elements[0] as any;
                var val = null;
                var selectedOption = (Array as any).from(element.options).filter(x => x.selected)[0];
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                var element = elements[0];
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                val = val.trim();
                var minLength = parseInt(element.dataset["valMinlength"] || 0 as any);
                var isValid = val.length >= minLength;
                if(!isValid)
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                var element = elements[0];
                var val = tryGetValue(element);
                if (isNullOrEmpty(val))
                    return ValidationResult.createOk(elements);
                val = val.trim();
                var maxLength = parseInt(element.dataset["valMaxlength"] || 0 as any);
                var isValid = val.length <= maxLength;
                if(!isValid)
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                var isValid = elements.map((x: any) => x.checked).filter((x: boolean) => x).length > 0;
                return isValid ? ValidationResult.createOk(elements) :
                    ValidationResult.createError(elements, errorMessage);
            }
        }
    },
    {
        fieldTypes: [FieldType.Number],
        instance: {
            name: "range",
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
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
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
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