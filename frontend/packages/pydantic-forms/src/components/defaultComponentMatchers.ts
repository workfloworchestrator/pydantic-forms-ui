/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import {
    ArrayField,
    CheckboxField,
    DividerField,
    DropdownField,
    HiddenField,
    IntegerField,
    LabelField,
    ListField,
    MultiCheckboxField,
    ObjectField,
    RadioField,
    TextAreaField,
} from '@/components/fields';
import {
    PydanticComponentMatcher,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from '@/types';

import { zodValidationPresets } from './zodValidationsPresets';

const defaultComponentMatchers: PydanticComponentMatcher[] = [
    {
        id: 'integerfield',
        ElementMatch: {
            Element: IntegerField,
            isControlledElement: true,
        },
        matcher(field) {
            return field.type === PydanticFormFieldType.INTEGER;
        },
        validator: zodValidationPresets.integer,
    },
    {
        id: 'textareafield',
        ElementMatch: {
            Element: TextAreaField,
            isControlledElement: true,
        },
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.LONG
            );
        },
        validator: zodValidationPresets.string,
    },
    {
        id: 'label',
        ElementMatch: {
            Element: LabelField,
            isControlledElement: false,
        },
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.LABEL
            );
        },
    },
    {
        id: 'divider',
        ElementMatch: {
            Element: DividerField,
            isControlledElement: false,
        },
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.DIVIDER
            );
        },
    },
    {
        id: 'hidden',
        ElementMatch: {
            Element: HiddenField,
            isControlledElement: false,
        },
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.HIDDEN
            );
        },
    },
    {
        id: 'radio',
        ElementMatch: {
            Element: RadioField,
            isControlledElement: true,
        },
        matcher(field) {
            // We are looking for a single value from a set list of options. With less than 4 options, use radio buttons.
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.options.length > 0 &&
                field.options.length <= 3
            );
        },
    },
    {
        id: 'dropdown',
        ElementMatch: {
            Element: DropdownField,
            isControlledElement: true,
        },
        matcher(field) {
            // We are looking for a single value from a set list of options. With more than 3 options, use a dropdown.
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.options.length >= 4
            );
        },
    },
    {
        id: 'checkbox',
        ElementMatch: {
            Element: CheckboxField,
            isControlledElement: true,
        },
        matcher(field) {
            return field.type === PydanticFormFieldType.BOOLEAN;
        },
    },
    {
        id: 'multicheckbox',
        ElementMatch: {
            Element: MultiCheckboxField,
            isControlledElement: true,
        },
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.ARRAY &&
                field.options.length > 0 &&
                field.options.length <= 5
            );
        },
        validator: zodValidationPresets.array,
    },
    {
        id: 'list',
        ElementMatch: {
            Element: ListField,
            isControlledElement: true,
        },
        matcher(field) {
            return (
                field.options.length > 0 &&
                field.type === PydanticFormFieldType.ARRAY
            );
        },
        validator: zodValidationPresets.array,
    },
    {
        id: 'object',
        ElementMatch: {
            Element: ObjectField,
            isControlledElement: false,
        },
        matcher(field) {
            return field.type === PydanticFormFieldType.OBJECT;
        },
    },
    {
        id: 'array',
        ElementMatch: {
            Element: ArrayField,
            isControlledElement: true,
        },
        matcher(field) {
            return field.type === PydanticFormFieldType.ARRAY;
        },
        validator: zodValidationPresets.array,
    },
];

// If nothing matches, it defaults to Text field in the mapToComponent function
export default defaultComponentMatchers;
