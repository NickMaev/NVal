export class ValidationResult {
    public message: string;
    public isValid: boolean;
    public elements: HTMLElement[];
    public errorRuleName: string;

    public static createError(elements: HTMLElement[], errorMessage: string): ValidationResult {
        var result = new ValidationResult();
        result.message = errorMessage;
        result.elements = elements;
        result.isValid = false;
        return result;
    }

    public static createOk(elements: HTMLElement[]): ValidationResult {
        var result = new ValidationResult();
        result.isValid = true;
        result.elements = elements;
        return result;
    }
}
