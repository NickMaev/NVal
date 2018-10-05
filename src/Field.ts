import { ValidationResult } from "./ValidationResult";
import {IAssignedRule} from "./IAssignedRule";
import {FieldType} from "./FieldType";

/**
 * Field which includes one or more elements.
 */
export class Field {
    /**
     * Order of the element in the DOM.
     */
    public order: number;
    /**
     * One or more elements (> 1 in case of the same name group: checkboxes, radios).
     */
    public elements: HTMLElement[] = [];


    public fieldType: FieldType;

    /**
     * Assigned rules.
     */
    public rules: IAssignedRule[];

    constructor(fieldType: FieldType) {
        this.fieldType = fieldType;
    }

    /**
     * Validate field which includes one or more elements.
     */
    public isValid(): ValidationResult {
        var activeRules = this.rules.filter(x => x.isActive);
        if (activeRules.length === 0)
            return ValidationResult.createOk(this.elements);
        
        var firstError: ValidationResult;

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
    }
}
