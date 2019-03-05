import { Field } from "./Field";
import { IAssignedRule } from "./IAssignedRule";
import { ruleSearchList } from "./RuleSearchList";
import { fieldTagTypeList } from "./FieldTagTypeList";
import { FieldType } from "./FieldType";
import { ValidationResult } from "./ValidationResult";
import { Constants } from "./Constants";
import { nodeListToArray, isNullOrEmpty } from "./Util";
import { IRuleInstance } from "./IRuleInstance";
import { IRuleSearchItem } from "./IRuleSearchItem";

export class NVal {
    protected element: HTMLFormElement;

    protected fields: Field[] = [];

    protected ruleSearchList: IRuleSearchItem[] = [...ruleSearchList];

    /**
     * Validate form.
     */
    public isValid(): boolean {
        if (this.fields == null || this.fields.length === 0) {
            return true;
        }

        this.hideErrors(this.fields);
        for (var i = 0; i < this.fields.length; i++) {
            var validationResult = this.fields[i].isValid();
            if (!validationResult.isValid) {
                this.showError(validationResult);
                return false;
            }
        }

        return true;
    }

    /**
     * Validate element.
     * @param htmlElement
     */
    public isValidElement(htmlElement: HTMLElement): boolean {
        if (this.fields == null || this.fields.length === 0) {
            return true;
        }

        this.hideErrors(this.fields);

        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            console.log("NVal+isValidElement: field not found.");
            return true;
        }

        var validationResult = field.isValid();
        if (!validationResult.isValid) {
            this.showError(validationResult);
            return false;
        }

        return true;
    }

    constructor(htmlFormElement: HTMLFormElement) {

        this.element = htmlFormElement;

        this.initFields(htmlFormElement);
        this.initEvents();
    }

    protected initFields(htmlFormElement: HTMLFormElement): void {
        var self = this;

        this.fields = [];

        fieldTagTypeList.forEach(tagType => {
            var nodeList = htmlFormElement.querySelectorAll(tagType.tag);

            if (tagType.type === FieldType.Radio || tagType.type === FieldType.Checkbox) {
                var sameNameDict = [];
                var elements = nodeListToArray(nodeList);
                elements.forEach(el => {
                    var name = (el as any).name;
                    if (sameNameDict[name] === undefined) {
                        sameNameDict[name] = [];
                    }
                    sameNameDict[name].push(el);
                });

                for (var key in sameNameDict) {

                    var f: Field = new Field(tagType.type);

                    var elGrp = sameNameDict[key];
                    f.elements.push(...elGrp);

                    // Get rules from the first element.
                    f.rules = this.getAssignedRuleFromAttributes(tagType.type, f.elements[0]);

                    self.fields.push(f);
                }
            } else {
                var elements = Array.prototype.slice.call(nodeList) as HTMLElement[];
                elements.forEach(el => {

                    var f: Field = new Field(tagType.type);

                    f.elements.push(el);

                    // Get rules from the first element.
                    f.rules = this.getAssignedRuleFromAttributes(tagType.type, el);

                    self.fields.push(f);
                });
            }
        });

        var inputElements = nodeListToArray(htmlFormElement.querySelectorAll('input, select, textarea'));
        this.fields.forEach(field => {
            field.order = inputElements.indexOf(field.elements[0]);
        });
        this.fields = this.fields.sort((a, b) => a.order - b.order);
    }

    /**
     * Need for delete events.
     */
    protected eventFunctions: any[] = [];

    protected initEvents() {
        var self = this;
        this.fields.forEach(field => {
            field.elements.forEach(el => {
                var fn = (event) => {
                    self.isValidElement(el);
                };
                self.eventFunctions.push(fn);
                el.addEventListener("change", fn);
            });
        });
    }

    protected removeEvents() {
        var self = this;
        this.fields.forEach(field => {
            field.elements.forEach(el => {
                self.eventFunctions.forEach(ef => {
                    el.removeEventListener("change", ef);
                });
            });
        });
        this.eventFunctions = [];
    }

    protected getAssignedRuleFromAttributes(fieldType: FieldType, htmlElement: HTMLElement): IAssignedRule[] {

        var self = this;

        var assignedRules: IAssignedRule[] = [];

        var dataSet = { ...htmlElement.dataset };

        // Set element type rule.
        dataSet[`val${htmlElement.getAttribute("type")}`] = "true";

        for (var key in dataSet) {

            // Grab the rules here.

            if (dataSet.hasOwnProperty(key)) {

                if (key.indexOf("val") !== 0) {
                    // If it's not validation attribute, skip it.
                    continue;
                }

                var ruleKey = key.replace("val", "");

                var ruleName = ruleKey.toLowerCase();
                if (ruleName === "") {
                    continue;
                }

                var ruleSearchItem = self.ruleSearchList.filter(x => x.instance.name === ruleName && x.fieldTypes.indexOf(fieldType) > -1)[0];
                if (ruleSearchItem == null) {
                    continue;
                }

                var isActive = false;

                // "valValue" may contain activity flag or value for the rule.
                var valValue = dataSet[key].toLowerCase();

                var toggleFlag = dataSet[`valToggle${ruleKey}`];

                var isValValueFlag = (valValue == "true" || valValue == "false");
                if (isValValueFlag) {
                    isActive = valValue == "true";
                } else {

                    // Use the "toggleFlag".

                    if (toggleFlag == null) {
                        // If toggle flag is null, make rule active.
                        isActive = true;
                    }
                }

                if (toggleFlag != null) {
                    toggleFlag = toggleFlag.toLowerCase();
                    isActive = toggleFlag == "true";
                }

                var assignedRule: IAssignedRule = {
                    isActive: isActive,
                    instance: ruleSearchItem.instance,
                    errorMessage: ""
                };

                if (assignedRules != null) {
                    assignedRules.push(assignedRule);
                }
            }
        }

        for (var key in dataSet) {

            // Grab error messages here.

            if (dataSet.hasOwnProperty(key)) {
                if (key.indexOf("msg") === 0) {

                    var ruleName = key.replace("msg", "").toLowerCase();
                    var assignedRule = assignedRules.filter(x => x.instance.name === ruleName)[0];
                    if (assignedRule != null) {
                        assignedRule.errorMessage = htmlElement.getAttribute(`data-msg-${ruleName}`);
                    }
                }
            }
        }

        return assignedRules;
    }
    
    protected getErrorPlacementContainers(element: HTMLElement): HTMLElement[] {
        var errorPlacementTag = element.dataset["error"];

        if (errorPlacementTag != null) {
            if (errorPlacementTag[0] === "#") {

                errorPlacementTag = errorPlacementTag.substr(1);

                var errorPlacementElement = document.getElementById(errorPlacementTag);

                if (errorPlacementElement == null) {
                    throw `NVal+getErrorPlacementContainers: error placement element with id '#${errorPlacementTag}' not found.`;
                    return [];
                }

                return [document.getElementById(errorPlacementTag)];
            }
            return nodeListToArray(document.getElementsByTagName(errorPlacementTag) as any);
        }

        return [];
    }

    protected showError(validationResult: ValidationResult): void {
        validationResult.elements.forEach(el => {
            el.classList.add(Constants.ValidationErrorClassName);
        });

        this.getErrorPlacementContainers(validationResult.elements[0]).forEach(ec => {
            if (ec != null) {
                if (isNullOrEmpty(validationResult.message)) {
                    validationResult.message = `There are no message for the '${validationResult.errorRuleName}' rule.`;
                }
                ec.innerHTML =
                    `<span class="${Constants.ErrorMessageClassName}">${validationResult.message}</span>`;
            }
        });
    }

    protected hideErrors(fields: Field[]) {
        fields.forEach(field => {
            field.elements.forEach(el => {
                el.classList.remove(Constants.ValidationErrorClassName);
                this.getErrorPlacementContainers(el).forEach(ec => {
                    if (ec != null) {
                        ec.innerHTML = "";
                    }
                });
            });
        });
    }

    public destroy() {
        this.hideErrors(this.fields);
        this.removeEvents();
        this.fields = [];
        this.element = null;
    }

    public addRules(items: IRuleSearchItem[]): void {
        this.ruleSearchList.push(...items);
        this.fields = [];
        this.initFields(this.element);
    }

    public assignRules(htmlElement: HTMLElement, assignedRules: IAssignedRule[]): void {
        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            throw "NVal+assignRules: can't find HTML element for assign the rule.";
        }
        field.rules.push(...assignedRules);
    }

    public assignExistingRule(htmlElement: HTMLElement, ruleName: string, errorMessage: string): void {
        if (htmlElement == null) {
            throw "NVal+assignExistingRule: can't assign existing rule to 'null'.";
        }
        var inputTag = `input[type=${htmlElement.getAttribute("type")}]`;
        var fieldTagType = fieldTagTypeList.filter(x => x.tag === inputTag)[0];
        if (fieldTagType == null) {
            throw `NVal+assignExistingRule: unrecognizable field tag type '${inputTag}'.`;
        }
        var fieldType = fieldTagType.type;
        var ruleSearchItem = this.ruleSearchList.filter(x => x.fieldTypes.indexOf(fieldType) > -1 && x.instance.name === ruleName)[0];
        if (ruleSearchItem == null) {
            throw `NVal+assignExistingRule: can't find rule with name '${ruleName}' for the field type '${fieldType}'!`;
        }
        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            throw "NVal+assignExistingRule: can't find HTML element for assign the rule.";
        }
        field.rules.push({
            instance: ruleSearchItem.instance,
            errorMessage: errorMessage,
            isActive: true
        });
    }

    public toggleRule(htmlElement: HTMLElement, ruleName: string, isActive: boolean): void {
        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            console.log("NVal+toggleRule: field not found.");
            return;
        }
        var rule = field.rules.filter(x => x.instance.name === ruleName)[0];
        if (rule == null) {
            console.log(`NVal+toggleRule: rule with name ${ruleName} not found.`);
            return;
        }
        rule.isActive = isActive;
    }

    protected getFieldByElement(htmlElement: HTMLElement): Field {
        return this.fields.filter(x => x.elements.indexOf(htmlElement) > -1)[0];
    }
}
