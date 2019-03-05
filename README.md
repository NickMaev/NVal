[![npm version](https://img.shields.io/npm/v/nval.svg?style=flat-square)](https://www.npmjs.com/package/nval)
[![npm downloads](https://img.shields.io/npm/dm/nval.svg?style=flat-square)](https://www.npmjs.com/package/nval)

# Description
NVal is a vanilla js validator which helps to migrate from jQuery Validation plugin. 
It parses html attributes and assign rules and messages to the elements. It also has simple API.
See also [NVal-Tippy](https://github.com/NickMaev/NVal-Tippy) plugin for use NVal with awesome validation tooltips!

# Changes
##### v. 1.1.4 (2019-03-05)
* Fixed issue with rule activation by assign rule attribute.
* Added toggle rule attribute.
* Updated dependecies.
##### v. 1.1.3 (2018-12-20)
* Fixed working of activity flag in HTML attributes. Now `data-val-[rule]="[true|false]"` works properly.
##### v. 1.1.2 (2018-11-10)
* Fixed `select` element validation rule.

# Usage

## Install
`npm install nval`

## Prepare
Import:
```typescript
import {NVal} from "nval";
```
or use the scripts tag (bundle):
```html
<script src="nval.min.js"></script>
```
Then:
(TypeScript)
```typescript        
var nval = new NVal(document.getElementById("myForm") as HTMLFormElement);
```
(JavaScript, using scripts tag)
```javascript
var nval = new NVal.NVal(document.getElementById("myForm")); // In JS bundle NVal.* required, because of UMD library!
```
## Run check

```typescript
nval.isValid() // Returns boolean.
```

## Common attributes
Attribute | Action
--- | ---
`data-val-[ruleName]="true"` | Assign rule to the element (input/textarea/etc.).
`data-msg-[ruleName]="[message]"` | Define message for the rule.
`data-error="#[elementId]"` | Define error placement container.
`data-val-toggle-[ruleName]="[true | false]"` | Turn on or off the rule.

## Rule attributes
Attribute | Action
--- | ---
`data-val-required="true"` | Make element required.
`data-val-minlength="[number]"` | Define minimal length.
`data-val-maxlength="[number]"` | Define maximal length.
`data-val-range="true"` | Define both borders for number. You must define `min` and `max` attributes.

Email rule will be assign automatically, but you must define the message for it by yourself (for ex.: `data-msg-email="Email address is not valid."`).

NVal also supports placeholders for error messages. For example: `data-msg-minlength="Minimal length is {0}."`, `data-msg-range="From {0} till {1}."`.

# API

Method | Description
--- | ---
`addRules` | Add custom global rules.
`assignRules` | Assign custom rules to the element.
`assignExistingRule` | Assign existing rule to the element.
`toggleRule` | Activate/Deactivate the rule.

## Usage
Note, that in examples below `nval` is instance.

### Add custom global rules
```typescript
nval.addRules([
    {
        fieldTypes: [array of the 'FieldTypes'], // Type of the elements.
        instance: {
            name: [rule name], // Rule name.
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                // Your validation code here.
            }
        }
    }
]);
```
Example:
```typescript
nval.addRules([
    {
        fieldTypes: [FieldType.Text], // Type of the elements.
        instance: {
            name: "agreed", // Rule name.
            apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                var element = elements[0] as HTMLInputElement;
                var val = element.value;
                if (val == null || val === "")
                    return ValidationResult.createOk(elements);
                if (val.toLowerCase() === "agreed")
                    return ValidationResult.createOk(elements);
                return ValidationResult.createError(elements, errorMessage);
            }
        }
    }
]);
```

Then added rule will be assigned to the elements which will have HTML attribute:
`data-val-agreed="true"` 
Hense, validation message will be determined by this:
`data-msg-agreed="You must type 'agreed'."`
Note, that for different `fieldTypes` there are can be different rules. So, for this example, rule `agreed` cannot be assigned to another field types except `[input="text"]`.

### Assign custom rules to element
```typescript
nval.assignRules([html element],
    [
        {
            instance: {
                name: [rule name],
                apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                    // Your code here...
                }
            },
            errorMessage: [error message],
            isActive: [true | false]
        }
    ]
);
```
Example:
```typescript
nval.assignRules(middleNameElement,
    [
        {
            instance: {
                name: "middlenamecheck", // Rule name.
                apply(elements: HTMLElement[], errorMessage: string): ValidationResult {
                    var element = elements[0] as HTMLInputElement;
                    var val = element.value;
                    if (val == null || val === "")
                        return ValidationResult.createOk(elements);
                    if (val[0] === val[0].toLowerCase()) // Check for the first letter that must be capitalized.
                        return ValidationResult.createError(elements, errorMessage);
                    return ValidationResult.createOk(elements);
                }
            },
            errorMessage: "Middle name must have first capital letter.", // Error message.
            isActive: true
        }
    ]
);
```

### Assign existing rule to the element
```typescript
nval.assignExistingRule([html element], [rule name], [error message]);
```
Example:
```typescript
nval.assignExistingRule(middleNameElement, "required", "This field is required.");
```

### Toggle rule
```typescript
nval.toggleRule([html element], [rule name], [true | false]);
```
Example:
```typescript
// Deactivate the rule.
nval.toggleRule(document.getElementById("firstName"), "required", false);
```
