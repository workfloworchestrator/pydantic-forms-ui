/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import { PydanticComponentMatcher, PydanticFormFieldType } from '@/types';

import { IntegerField } from './fields/IntegerField';
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
];

export default defaultComponentMatchers;
