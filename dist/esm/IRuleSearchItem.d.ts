import { FieldType } from "./FieldType";
import { IRuleInstance } from "./IRuleInstance";
export interface IRuleSearchItem {
    fieldTypes: FieldType[];
    instance: IRuleInstance;
}
