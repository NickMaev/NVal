import { IRuleInstance } from "./IRuleInstance";

export interface IAssignedRule {
    isActive: boolean;
    instance: IRuleInstance;
    errorMessage: string;
}