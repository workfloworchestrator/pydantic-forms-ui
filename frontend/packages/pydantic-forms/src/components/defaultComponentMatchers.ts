/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import {
    CheckboxField,
    DividerField,
    DropdownField,
    HiddenField,
    IntegerField,
    LabelField,
    RadioField,
    TextAreaField,
} from '@/components/fields';
import {
    PydanticComponentMatcher,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from '@/types';

import { zodValidationPresets } from './zodValidations';

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
];

// If nothing  matches, it defaults to Text field in the mapToComponent function
export default defaultComponentMatchers;
