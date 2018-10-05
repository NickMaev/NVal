import { Field } from "./Field";
import { IAssignedRule } from "./IAssignedRule";
import { FieldType } from "./FieldType";
import { ValidationResult } from "./ValidationResult";
import { IRuleSearchItem } from "./IRuleSearchItem";
export declare class NVal {
    protected element: HTMLFormElement;
    protected fields: Field[];
    protected ruleSearchList: IRuleSearchItem[];
    isValid(): boolean;
    isValidElement(htmlElement: HTMLElement): boolean;
    constructor(htmlFormElement: HTMLFormElement);
    protected initFields(htmlFormElement: HTMLFormElement): void;
    protected eventFunctions: any[];
    protected initEvents(): void;
    protected removeEvents(): void;
    protected getAssignedRuleFromAttributes(fieldType: FieldType, htmlElement: HTMLElement): IAssignedRule[];
    protected getErrorPlacementContainers(element: HTMLElement): HTMLElement[];
    protected showError(validationResult: ValidationResult): void;
    protected hideErrors(fields: Field[]): void;
    destroy(): void;
    addRules(items: IRuleSearchItem[]): void;
    assignRules(htmlElement: HTMLElement, assignedRules: IAssignedRule[]): void;
    assignExistingRule(htmlElement: HTMLElement, ruleName: string, errorMessage: string): void;
    toggleRule(htmlElement: HTMLElement, ruleName: string, isActive: boolean): void;
    protected getFieldByElement(htmlElement: HTMLElement): Field;
}
