/**
 * Dynamic Forms
 *
 * This is pretty much the matcher of the JSON Schema 'properties' definition to fields.
 * Here we try to make the mess we receive easily usable in the components
 *
 * Since the actual field definition is kinda scattered in the schema, it is a bit ugly imo
 */
import {
    getFieldAllOfAnyOfEntry,
    getFieldAttributes,
    getFieldOptions,
    getFieldValidation,
    matchComponentWithField,
} from '@/core/helper';
import {
    PydanticFormApiRefResolved,
    PydanticFormField,
    PydanticFormFieldDetailProvider,
    PydanticFormLabels,
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
export const mapToUsableField = (
    fieldId: string,
    schema: PydanticFormApiRefResolved,
    formLabels: PydanticFormLabels = {},
    fieldDetailProvider?: PydanticFormFieldDetailProvider,
): PydanticFormField => {
    const schemaField = schema.properties[fieldId];

    const options = getFieldOptions(schemaField);

    const fieldOptionsEntry = getFieldAllOfAnyOfEntry(schemaField);

    const field: PydanticFormField = {
        id: fieldId,
        title: formLabels[fieldId]?.toString() ?? schemaField.title,
        description: formLabels[fieldId + '_info']?.toString() ?? '',
        format: schemaField.format ?? fieldOptionsEntry?.[0]?.format,
        type:
            schemaField.type ??
            fieldOptionsEntry?.[0]?.type ??
            fieldOptionsEntry?.[0]?.items?.type,
        options: options.options,
        isEnumField: options.isOptionsField,
        default: schemaField.default,
        validation: getFieldValidation(schemaField),
        required: !!schema.required?.includes(fieldId),
        attributes: getFieldAttributes(schemaField),
        schemaField: schemaField,
        columns: 6,
        ...fieldDetailProvider?.[fieldId],
    };

    // match it with an actual component
    const matchedComponent = matchComponentWithField(field);

    if (matchedComponent?.Component) {
        field.FormElement = matchedComponent.Component.Element;
        field.validator = matchedComponent.Component?.validator;

        field.matchedFieldResult = matchedComponent;
    }

    return field;
};
