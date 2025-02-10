/**
 * Pydantic Forms
 *
 * This is pretty much the matcher of the JSON Schema 'properties' definition to fields.
 * Here we try to make the mess we receive easily usable in the components
 *
 * Since the actual field definition is kinda scattered in the schema, it is a bit ugly imo
 */
import { TextField } from '@/components';
import defaultComponentMatchers from '@/components/defaultComponentMatchers';
import { zodValidationPresets } from '@/components/zodValidations';
import {
    getFieldAllOfAnyOfEntry,
    getFieldAttributes,
    getFieldOptions,
    getFieldValidation,
} from '@/core/helper';
import {
    PydanticComponentMatcher,
    PydanticFormApiRefResolved,
    PydanticFormField,
    PydanticFormFieldDetailProvider,
    PydanticFormLabels,
    PydanticFormsContextConfig,
} from '@/types';

/**
 * Map field of the schema to a better usable format
 * Translate the labels
 * Also maps it to the actual component used
 *
 * @param fieldId The ID of the field
 * @param schema The full JSON Schema received from the backend
 * @param formLabels An object with formLabels for the translation of field names
 * @returns A better usable field to be used in components
 */
export const mapFieldToComponent = (
    fieldId: string,
    schema: PydanticFormApiRefResolved,
    formLabels: PydanticFormLabels = {},
    fieldDetailProvider?: PydanticFormFieldDetailProvider,
    componentMatcher?: PydanticFormsContextConfig['componentMatcher'],
): PydanticFormField => {
    const matcher = getComponentMatcher(componentMatcher);

    const fieldProperties = schema.properties[fieldId];
    const options = getFieldOptions(fieldProperties);

    const fieldOptionsEntry = getFieldAllOfAnyOfEntry(fieldProperties);

    const field: PydanticFormField = {
        id: fieldId,
        title: formLabels[fieldId]?.toString() ?? fieldProperties.title,
        description: formLabels[fieldId + '_info']?.toString() ?? '',
        format: fieldProperties.format ?? fieldOptionsEntry?.[0]?.format,
        type:
            fieldProperties.type ??
            fieldOptionsEntry?.[0]?.type ??
            fieldOptionsEntry?.[0]?.items?.type,
        options: options.options,
        isEnumField: options.isOptionsField,
        default: fieldProperties.default,
        validation: getFieldValidation(fieldProperties),
        required: !!schema.required?.includes(fieldId),
        attributes: getFieldAttributes(fieldProperties),
        schemaField: fieldProperties,
        columns: 6,
        ...fieldDetailProvider?.[fieldId],
    };
    field.componentMatch = matcher(field);

    return field;
};

export const getComponentMatcher = (
    componentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    const matchers = componentMatcher
        ? componentMatcher(defaultComponentMatchers)
        : defaultComponentMatchers;

    const matcher = (field: PydanticFormField): PydanticComponentMatcher => {
        const matchedComponent = matchers.find(({ matcher }) => {
            return matcher(field);
        });

        if (matchedComponent) return matchedComponent;

        // Defaults to textField when there are no matches
        return {
            id: 'textfield',
            ElementMatch: {
                Element: TextField,
                isControlledElement: true,
            },
            matcher: () => true,
            validator: zodValidationPresets.string,
        };
    };

    return matcher;
};
