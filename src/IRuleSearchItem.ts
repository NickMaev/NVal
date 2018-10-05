import { FieldType } from "./FieldType";
import { IRuleInstance } from "./IRuleInstance";

export interface IRuleSearchItem {
    /**
    * Type of the field which is covered by the rule.
    */
    fieldTypes: FieldType[];
    instance: IRuleInstance;
}