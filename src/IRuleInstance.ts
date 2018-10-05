import { ValidationResult } from "./ValidationResult";

export interface IRuleInstance {
    /**
     * Name of the rule.
     * In some cases there can be rules with
     * same name but with different 'fieldTypes'. 
     */
    name: string;
    /**
     *  Validate one or more elements.
     * @param elements One or more elements.
     * @param errorMessage Error message for modifying it.
     */
    apply(elements: HTMLElement[], errorMessage: string): ValidationResult;
}

