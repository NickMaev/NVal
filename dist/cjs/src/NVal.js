"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("./Field");
var RuleSearchList_1 = require("./RuleSearchList");
var FieldTagTypeList_1 = require("./FieldTagTypeList");
var FieldType_1 = require("./FieldType");
var Constants_1 = require("./Constants");
var Util_1 = require("./Util");
var NVal = (function () {
    function NVal(htmlFormElement) {
        this.fields = [];
        this.ruleSearchList = RuleSearchList_1.ruleSearchList.slice();
        this.eventFunctions = [];
        this.element = htmlFormElement;
        this.initFields(htmlFormElement);
        this.initEvents();
    }
    NVal.prototype.isValid = function () {
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
    };
    NVal.prototype.isValidElement = function (htmlElement) {
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
    };
    NVal.prototype.initFields = function (htmlFormElement) {
        var _this = this;
        var self = this;
        this.fields = [];
        FieldTagTypeList_1.fieldTagTypeList.forEach(function (tagType) {
            var _a;
            var nodeList = htmlFormElement.querySelectorAll(tagType.tag);
            if (tagType.type === FieldType_1.FieldType.Radio || tagType.type === FieldType_1.FieldType.Checkbox) {
                var sameNameDict = [];
                var elements = Util_1.nodeListToArray(nodeList);
                elements.forEach(function (el) {
                    var name = el.name;
                    if (sameNameDict[name] === undefined) {
                        sameNameDict[name] = [];
                    }
                    sameNameDict[name].push(el);
                });
                for (var key in sameNameDict) {
                    var f = new Field_1.Field(tagType.type);
                    var elGrp = sameNameDict[key];
                    (_a = f.elements).push.apply(_a, elGrp);
                    f.rules = _this.getAssignedRuleFromAttributes(tagType.type, f.elements[0]);
                    self.fields.push(f);
                }
            }
            else {
                var elements = Array.prototype.slice.call(nodeList);
                elements.forEach(function (el) {
                    var f = new Field_1.Field(tagType.type);
                    f.elements.push(el);
                    f.rules = _this.getAssignedRuleFromAttributes(tagType.type, el);
                    self.fields.push(f);
                });
            }
        });
        var inputElements = Util_1.nodeListToArray(htmlFormElement.querySelectorAll('input, select, textarea'));
        this.fields.forEach(function (field) {
            field.order = inputElements.indexOf(field.elements[0]);
        });
        this.fields = this.fields.sort(function (a, b) { return a.order - b.order; });
    };
    NVal.prototype.initEvents = function () {
        var self = this;
        this.fields.forEach(function (field) {
            field.elements.forEach(function (el) {
                var fn = function (event) {
                    self.isValidElement(el);
                };
                self.eventFunctions.push(fn);
                el.addEventListener("change", fn);
            });
        });
    };
    NVal.prototype.removeEvents = function () {
        var self = this;
        this.fields.forEach(function (field) {
            field.elements.forEach(function (el) {
                self.eventFunctions.forEach(function (ef) {
                    el.removeEventListener("change", ef);
                });
            });
        });
        this.eventFunctions = [];
    };
    NVal.prototype.getAssignedRuleFromAttributes = function (fieldType, htmlElement) {
        var self = this;
        var assignedRules = [];
        var dataSet = __assign({}, htmlElement.dataset);
        dataSet["val" + htmlElement.getAttribute("type")] = "true";
        for (var key in dataSet) {
            if (dataSet.hasOwnProperty(key)) {
                if (key.indexOf("val") !== 0) {
                    continue;
                }
                var ruleKey = key.replace("val", "");
                var ruleName = ruleKey.toLowerCase();
                if (ruleName === "") {
                    continue;
                }
                var ruleSearchItem = self.ruleSearchList.filter(function (x) { return x.instance.name === ruleName && x.fieldTypes.indexOf(fieldType) > -1; })[0];
                if (ruleSearchItem == null) {
                    continue;
                }
                var isActive = false;
                var valValue = dataSet[key].toLowerCase();
                var toggleFlag = dataSet["valToggle" + ruleKey];
                var isValValueFlag = (valValue == "true" || valValue == "false");
                if (isValValueFlag) {
                    isActive = valValue == "true";
                }
                else {
                    if (toggleFlag == null) {
                        isActive = true;
                    }
                }
                if (toggleFlag != null) {
                    toggleFlag = toggleFlag.toLowerCase();
                    isActive = toggleFlag == "true";
                }
                var assignedRule = {
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
            if (dataSet.hasOwnProperty(key)) {
                if (key.indexOf("msg") === 0) {
                    var ruleName = key.replace("msg", "").toLowerCase();
                    var assignedRule = assignedRules.filter(function (x) { return x.instance.name === ruleName; })[0];
                    if (assignedRule != null) {
                        assignedRule.errorMessage = htmlElement.getAttribute("data-msg-" + ruleName);
                    }
                }
            }
        }
        return assignedRules;
    };
    NVal.prototype.getErrorPlacementContainers = function (element) {
        var errorPlacementTag = element.dataset["error"];
        if (errorPlacementTag != null) {
            if (errorPlacementTag[0] === "#") {
                errorPlacementTag = errorPlacementTag.substr(1);
                var errorPlacementElement = document.getElementById(errorPlacementTag);
                if (errorPlacementElement == null) {
                    throw "NVal+getErrorPlacementContainers: error placement element with id '#" + errorPlacementTag + "' not found.";
                    return [];
                }
                return [document.getElementById(errorPlacementTag)];
            }
            return Util_1.nodeListToArray(document.getElementsByTagName(errorPlacementTag));
        }
        return [];
    };
    NVal.prototype.showError = function (validationResult) {
        validationResult.elements.forEach(function (el) {
            el.classList.add(Constants_1.Constants.ValidationErrorClassName);
        });
        this.getErrorPlacementContainers(validationResult.elements[0]).forEach(function (ec) {
            if (ec != null) {
                if (Util_1.isNullOrEmpty(validationResult.message)) {
                    validationResult.message = "There are no message for the '" + validationResult.errorRuleName + "' rule.";
                }
                ec.innerHTML =
                    "<span class=\"" + Constants_1.Constants.ErrorMessageClassName + "\">" + validationResult.message + "</span>";
            }
        });
    };
    NVal.prototype.hideErrors = function (fields) {
        var _this = this;
        fields.forEach(function (field) {
            field.elements.forEach(function (el) {
                el.classList.remove(Constants_1.Constants.ValidationErrorClassName);
                _this.getErrorPlacementContainers(el).forEach(function (ec) {
                    if (ec != null) {
                        ec.innerHTML = "";
                    }
                });
            });
        });
    };
    NVal.prototype.destroy = function () {
        this.hideErrors(this.fields);
        this.removeEvents();
        this.fields = [];
        this.element = null;
    };
    NVal.prototype.addRules = function (items) {
        var _a;
        (_a = this.ruleSearchList).push.apply(_a, items);
        this.fields = [];
        this.initFields(this.element);
    };
    NVal.prototype.assignRules = function (htmlElement, assignedRules) {
        var _a;
        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            throw "NVal+assignRules: can't find HTML element for assign the rule.";
        }
        (_a = field.rules).push.apply(_a, assignedRules);
    };
    NVal.prototype.assignExistingRule = function (htmlElement, ruleName, errorMessage) {
        if (htmlElement == null) {
            throw "NVal+assignExistingRule: can't assign existing rule to 'null'.";
        }
        var inputTag = "input[type=" + htmlElement.getAttribute("type") + "]";
        var fieldTagType = FieldTagTypeList_1.fieldTagTypeList.filter(function (x) { return x.tag === inputTag; })[0];
        if (fieldTagType == null) {
            throw "NVal+assignExistingRule: unrecognizable field tag type '" + inputTag + "'.";
        }
        var fieldType = fieldTagType.type;
        var ruleSearchItem = this.ruleSearchList.filter(function (x) { return x.fieldTypes.indexOf(fieldType) > -1 && x.instance.name === ruleName; })[0];
        if (ruleSearchItem == null) {
            throw "NVal+assignExistingRule: can't find rule with name '" + ruleName + "' for the field type '" + fieldType + "'!";
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
    };
    NVal.prototype.toggleRule = function (htmlElement, ruleName, isActive) {
        var field = this.getFieldByElement(htmlElement);
        if (field == null) {
            console.log("NVal+toggleRule: field not found.");
            return;
        }
        var rule = field.rules.filter(function (x) { return x.instance.name === ruleName; })[0];
        if (rule == null) {
            console.log("NVal+toggleRule: rule with name " + ruleName + " not found.");
            return;
        }
        rule.isActive = isActive;
    };
    NVal.prototype.getFieldByElement = function (htmlElement) {
        return this.fields.filter(function (x) { return x.elements.indexOf(htmlElement) > -1; })[0];
    };
    return NVal;
}());
exports.NVal = NVal;
//# sourceMappingURL=NVal.js.map