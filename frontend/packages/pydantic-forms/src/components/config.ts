/**
 * Dynamic Forms
 *
 * We will search for the first field that returns a positive match
 * The last field has no matcher, so it will match as the default
 */
import DFAgreeField from '@/components/fields/AgreeBoolean';
import DFCheckboxField from '@/components/fields/Checkbox';
import DFNoOptionsEnum from '@/components/fields/DFNoOptionsEnum';
import DFDatePicker from '@/components/fields/DatePicker';
import DFDateTime from '@/components/fields/DateTime';
import DFDropDown from '@/components/fields/DropDown';
import DFFileUpload from '@/components/fields/FileUpload';
import DFHiddenField from '@/components/fields/Hidden';
import DFListField from '@/components/fields/List';
import DFMarkdownField from '@/components/fields/MarkdownField';
import DFMultiSelect from '@/components/fields/MultiSelect';
import DFPassword from '@/components/fields/Password';
import DFRadioField from '@/components/fields/Radio';
import DFSensitive from '@/components/fields/Sensitive';
import DFSkipField from '@/components/fields/Skip';
import DFSwitchField from '@/components/fields/Switch';
import DFTextField from '@/components/fields/Text';
import DFTextArea from '@/components/fields/TextArea';
import { DfFieldFormats, DfFieldTypes, DfFieldsConfig } from '@/types';

const fieldsConfig: DfFieldsConfig = [
    {
        id: 'hiddenfield',
        Component: DFHiddenField,
        matcher(field) {
            return field.format === DfFieldFormats.HIDDEN;
        },
        preventColRender: true,
    },

    {
        id: 'password',
        Component: DFPassword,
        matcher(field) {
            const isString = field.type === DfFieldTypes.STRING;
            return isString && !!field.attributes.password;
        },
    },

    {
        id: 'sensitive',
        Component: DFSensitive,
        matcher(field) {
            const isString = field.type === DfFieldTypes.STRING;
            return isString && !!field.attributes.sensitive;
        },
    },

    {
        id: 'DFAgreeField',
        Component: DFAgreeField,
        matcher(field) {
            return !!field.attributes.isAgreeField;
        },
    },

    {
        id: 'datepicker',
        Component: DFDatePicker,
        matcher(field) {
            return field.format === DfFieldFormats.DATE;
        },
    },

    {
        id: 'datetimepicker',
        Component: DFDateTime,
        matcher(field) {
            return [DfFieldFormats.DATETIME, DfFieldFormats.TIMESTAMP].includes(
                field.format,
            );
        },
    },

    {
        id: 'is_enum_with_no_options',
        Component: DFNoOptionsEnum,
        matcher(field) {
            return field.isEnumField && field.options.length === 0;
        },
    },

    {
        id: 'switch',
        Component: DFSwitchField,
        matcher(field) {
            // boolean fields will use switch
            if (field.type === DfFieldTypes.BOOLEAN) {
                return true;
            }

            // fields with array of options dont fit
            if (field.type === DfFieldTypes.ARRAY) {
                return false;
            }

            // use switch only when 2 options and their values are max then 4 chars
            return (
                field.options.length === 2 &&
                field.options.filter((option) => option.value.length < 5)
                    .length === 2
            );
        },
    },

    {
        id: 'checkbox',
        Component: DFCheckboxField,
        matcher(field) {
            // fields with array of options dont fit
            if (field.type !== DfFieldTypes.ARRAY) {
                return false;
            }

            // use checkbox when between 1 and 5 options
            return field.options.length >= 1 && field.options.length < 6;
        },
    },

    {
        id: 'radio',
        Component: DFRadioField,
        matcher(field) {
            // fields with array of options dont fit
            if (field.type !== DfFieldTypes.STRING) {
                return false;
            }

            // use radio when between 1 and 5 options
            return field.options.length > 1 && field.options.length < 6;
        },
    },

    {
        id: 'dropdown',
        Component: DFDropDown,
        matcher(field) {
            return (
                field.type === DfFieldTypes.STRING && field.options.length > 1
            );
        },
    },

    {
        id: 'mutltiselect',
        Component: DFMultiSelect,
        matcher(field) {
            return (
                field.type === DfFieldTypes.ARRAY && field.options.length > 0
            );
        },
    },

    {
        id: 'list',
        Component: DFListField,
        matcher(field) {
            return (
                field.type === DfFieldTypes.ARRAY && field.options.length === 0
            );
        },
    },

    {
        id: 'skip',
        Component: DFSkipField,
        matcher(field) {
            return field.format === DfFieldFormats.SKIP;
        },
    },

    {
        id: 'markdown',
        Component: DFMarkdownField,
        matcher(field) {
            return field.format === DfFieldFormats.MARKDOWN;
        },
    },

    {
        id: 'textarea',
        Component: DFTextArea,
        matcher(field) {
            return field.format === DfFieldFormats.LONG;
        },
    },

    {
        id: 'upload-field',
        Component: DFFileUpload,
        matcher(field) {
            return field.format === DfFieldFormats.FILE;
        },
    },

    // no matcher, last in array,
    // so its the final fallback
    {
        id: 'textfield',
        Component: DFTextField,
    },
];

export default fieldsConfig;
