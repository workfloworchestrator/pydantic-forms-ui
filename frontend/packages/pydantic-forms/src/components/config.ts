/**
 * Dynamic Forms
 *
 * We will search for the first field that returns a positive match
 * The last field has no matcher, so it will match as the default
 */
import DFTextField from '@/components/fields/Text';
import { DfFieldsConfig } from '@/types';

const fieldsConfig: DfFieldsConfig = [
    /*
    {
        id: 'textarea',
        Component: DFTextArea,
        matcher(field) {
            return field.format === DfFieldFormats.LONG;
        },
    },
*/
    // no matcher, last in array,
    // so its the final fallback
    {
        id: 'textfield',
        Component: DFTextField,
    },
];

export default fieldsConfig;
