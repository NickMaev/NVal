import { ValidationResult } from "./ValidationResult";
export interface IRuleInstance {
    name: string;
    apply(elements: HTMLElement[], errorMessage: string): ValidationResult;
}
