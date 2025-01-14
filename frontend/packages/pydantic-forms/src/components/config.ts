/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 * The last field has no matcher, so it will match as the default
 */
import TextField from '@/components/fields/TextField';
import { PydanticFormFieldConfig } from '@/types';

const fieldsConfig: PydanticFormFieldConfig[] = [
    // no matcher, last in array,
    // so its the final fallback
    {
        id: 'textfield',
        Component: TextField,
    },
];

export default fieldsConfig;
