import {FieldType} from "./FieldType";
import {IFieldTagTypePair} from "./IFieldTagTypePair";

/**
 * Field and tag pair list.
 */
export const fieldTagTypeList: IFieldTagTypePair[] = [
    {
        tag: "input[type=password]",
        type: FieldType.Password
    },
    {
        tag: "input[type=checkbox]",
        type: FieldType.Checkbox
    },
    {
        tag: "input[type=radio]",
        type: FieldType.Radio
    },
    {
        tag: "input[type=text]",
        type: FieldType.Text
    },
    {
        tag: "input[type=email]",
        type: FieldType.Email
    },
    {
        tag: "input[type=file]",
        type: FieldType.File
    },
    {
        tag: "input[type=number]",
        type: FieldType.Number
    },
    {
        tag: "select",
        type: FieldType.Select
    },
    {
        tag: "textarea",
        type: FieldType.Textarea
    }];
