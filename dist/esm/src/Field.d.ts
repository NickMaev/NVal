import { ValidationResult } from "./ValidationResult";
import { IAssignedRule } from "./IAssignedRule";
import { FieldType } from "./FieldType";
export declare class Field {
    order: number;
    elements: HTMLElement[];
    fieldType: FieldType;
    rules: IAssignedRule[];
    constructor(fieldType: FieldType);
    isValid(): ValidationResult;
}
