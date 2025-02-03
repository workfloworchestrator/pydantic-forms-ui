/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import { IntegerField, TextAreaField } from '@/components/fields';
import {
    PydanticComponentMatcher,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from '@/types';

import { zodValidationPresets } from './zodValidations';

// no matchers, it defaults to Text field in the mapToComponent function
const defaultComponentMatchers: PydanticComponentMatcher[] = [
    {
        id: 'integerfield',
        Element: IntegerField,
        matcher(field) {
            return field.type === PydanticFormFieldType.INTEGER;
        },
        validator: zodValidationPresets.integer,
    },
    {
        id: 'textareafield',
        Element: TextAreaField,
        matcher(field) {
            return (
                field.type === PydanticFormFieldType.STRING &&
                field.format === PydanticFormFieldFormat.LONG
            );
        },
        validator: zodValidationPresets.string,
    },
];

export default defaultComponentMatchers;
