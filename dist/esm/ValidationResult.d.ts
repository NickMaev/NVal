export declare class ValidationResult {
    message: string;
    isValid: boolean;
    elements: HTMLElement[];
    static createError(elements: HTMLElement[], errorMessage: string): ValidationResult;
    static createOk(elements: HTMLElement[]): ValidationResult;
}
