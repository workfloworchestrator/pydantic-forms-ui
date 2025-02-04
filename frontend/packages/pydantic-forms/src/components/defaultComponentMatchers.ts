/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import { IntegerField, LabelField, TextAreaField } from '@/components/fields';
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
];
// If nothing  matches, it defaults to Text field in the mapToComponent function
export default defaultComponentMatchers;
