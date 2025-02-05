/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import {
    DividerField,
    DropdownField,
    HiddenField,
    IntegerField,
    LabelField,
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
        id: 'dropdown',
        ElementMatch: {
            Element: DropdownField,
            isControlledElement: true,
        },
        matcher(field) {
            // We are looking for a single value from a set list of options. Use a dropdown.
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.options.length > 0
            );
        },
    },
];
// If nothing  matches, it defaults to Text field in the mapToComponent function
export default defaultComponentMatchers;
