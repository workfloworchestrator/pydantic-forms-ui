/**
 * Pydantic Forms
 *
 * Helper functions to be used in PydanticForms
 */
import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';

import {
    Properties,
    PydanticFormApiResponse,
    PydanticFormField,
    PydanticFormFieldAttributes,
    PydanticFormFieldOption,
    PydanticFormFieldType,
    PydanticFormFieldValidations,
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
} from '@/types';

/**
 * Error object formatting
 *
 * @param apiErrorResp The JSON Schema from the backend
 * @returns A object better usable for displaying errors
 */
export const getErrorDetailsFromResponse = function (
    apiErrorResp: PydanticFormApiResponse,
) {
    return {
        detail: apiErrorResp.detail ?? '',
        source: apiErrorResp.validation_errors,
        mapped: apiErrorResp.validation_errors.reduce((old, cur) => {
            return {
                ...old,
                [cur.loc[0]]: {
                    value: cur.input,
                    msg: cur.msg,
                },
            };
        }, {}),
    };
};

/**
 * Easy pluk options or format from the anyOf, allOf or oneOf keys
 *
 * @param field A field from the 'properties' key of the JSON Schema
 * @returns anyOf, allOf, or allOf value
 */
export const getFieldAllOfAnyOfEntry = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
) => {
    const optionFields = [
        propertySchemaParsed.anyOf,
        propertySchemaParsed.oneOf,
        propertySchemaParsed.allOf,
    ];

    for (const optionsDefs of optionFields) {
        if (!optionsDefs) {
            continue;
        }

        return optionsDefs;
    }
};

/**
 * Field to field options
 *
 * @param propertySchemaParsed A field from the 'properties' key of the JSON Schema
 * @returns an array of options in strings
 */
export const getFieldOptions = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
) => {
    let isOptionsField = false;
    const options: PydanticFormFieldOption[] = [];

    const optionDef = getFieldAllOfAnyOfEntry(propertySchemaParsed);

    const propertyEnums =
        propertySchemaParsed.enum ?? propertySchemaParsed.items?.enum;
    const propertyOptions =
        propertySchemaParsed.options ?? propertySchemaParsed.items?.options;

    if (propertyEnums && !propertyOptions) {
        isOptionsField = true;

        options.push(...enumToOption(propertyEnums));
    }

    if (propertyOptions) {
        options.push(...optionsToOption(propertyOptions, propertyEnums));
    }

    const hasEntryWithEnums = optionDef?.filter(
        (option) => !!option.items?.enum || option?.enum,
    );

    if (propertySchemaParsed.items) {
        isOptionsField = true;
    }

    if (!optionDef) {
        return {
            options,
            isOptionsField: false,
        };
    }

    for (const entry of optionDef) {
        if (entry.type === 'null' && hasEntryWithEnums) {
            continue;
        }

        if (entry.items) {
            isOptionsField = true;
        }

        const itemFieldEnums = entry?.enum ?? entry.items?.enum;
        const itemFieldOptions = entry?.options ?? entry.items?.options;

        if (itemFieldEnums && !itemFieldOptions) {
            isOptionsField = true;
            // add all the other options to the options arr
            options.push(...enumToOption(itemFieldEnums));
        }

        if (itemFieldOptions) {
            isOptionsField = true;
            // add all the other options to the options arr
            options.push(...optionsToOption(itemFieldOptions, itemFieldEnums));
        }
    }

    return {
        options,
        isOptionsField,
    };
};

export const enumToOption = (enums: string[]) =>
    enums.map((option: string) => ({
        value: option,
        label: option,
    }));

export const optionsToOption = (
    options: { [id: string]: string },
    enums?: string[],
) =>
    Object.keys(options)
        .map((id: string) => ({
            value: id,
            label: options[id as keyof typeof options],
        }))
        .sort(
            (a, b) =>
                (enums?.indexOf(a.value) ?? 0) - (enums?.indexOf(b.value) ?? 0),
        );

export const getFieldLabelById = (
    fieldId: string,
    formSchema?: PydanticFormSchema,
) => {
    const fieldMap = getFlatFieldMap(formSchema?.properties ?? {});
    return fieldMap.has(fieldId) ? fieldMap.get(fieldId)?.title : fieldId;
};

type FieldMap = Map<string, PydanticFormField>;
export const getFlatFieldMap = (
    properties: Properties,
    fieldMap: FieldMap = new Map(),
) => {
    if (properties) {
        Object.entries(properties ?? {}).forEach(([id, field]) => {
            if (field.properties) {
                getFlatFieldMap(field.properties, fieldMap);
            }
            fieldMap.set(id, field);
        });
    }

    return fieldMap;
};

/**
 * Field to validation object
 *
 * @param fieldProperties A field from the 'properties' key of the JSON Schema
 * @returns returns a validation object
 */
export const getFieldValidation = (
    fieldProperties: PydanticFormPropertySchemaParsed,
) => {
    const validation: PydanticFormFieldValidations = {};
    const propertyDef = getFieldAllOfAnyOfEntry(fieldProperties);
    const isNullable = propertyDef?.filter((option) => option.type === 'null');

    if (isNullable) {
        validation.isNullable = true;
    }

    for (const properties of [fieldProperties, ...(propertyDef ?? [])]) {
        if (fieldProperties.type === PydanticFormFieldType.STRING) {
            if (properties.maxLength)
                validation.maxLength = properties.maxLength;
            if (properties.minLength)
                validation.minLength = properties.minLength;
            if (properties.pattern) validation.pattern = properties.pattern;
        }
        if (
            fieldProperties.type === PydanticFormFieldType.NUMBER ||
            fieldProperties.type === PydanticFormFieldType.INTEGER
        ) {
            if (properties.minimum) validation.minimum = properties.minimum;
            if (properties.maximum) validation.maximum = properties.maximum;
            if (properties.exclusiveMinimum)
                validation.exclusiveMinimum = properties.exclusiveMinimum;
            if (properties.exclusiveMaximum)
                validation.exclusiveMaximum = properties.exclusiveMaximum;
            if (properties.multipleOf)
                validation.multipleOf = properties.multipleOf;
        }
        if (fieldProperties.type === PydanticFormFieldType.ARRAY) {
            validation.minItems = properties.minItems;
            validation.maxItems = properties.maxItems;
            validation.uniqueItems = properties.uniqueItems;
        }
    }

    return validation;
};

/**
 * Returns if a field should be nullable
 * @param field
 * @returns
 */
export const isNullableField = (field: PydanticFormField) =>
    !!field.validations.isNullable;

/**
 * Will return a Record map of [fieldId]: "Fieldvalue"
 *
 * Requires both fieldsDef (these can have default values)
 * And labelData (this holds the current values from API)
 */
export const getFormValuesFromFieldOrLabels = (
    pydanticFormSchema: PydanticFormSchema,
    labelData?: Record<string, string>,
) => {
    const fieldValues: Record<string, string> = {};

    const includedFields: string[] = [];

    for (const [, field] of Object.entries(pydanticFormSchema.properties)) {
        includedFields.push(field.id);

        if (typeof field.default === 'undefined') {
            continue;
        }

        fieldValues[field.id] = field.default;
    }

    if (labelData) {
        for (const fieldId in labelData) {
            if (labelData[fieldId] && includedFields.includes(fieldId)) {
                fieldValues[fieldId] = labelData[fieldId];
            }
        }
    }

    return fieldValues;
};

/**
 * Finds and returns the attributes in the schemafield
 */
export const getFieldAttributes = function (
    schemaField: PydanticFormPropertySchemaParsed,
) {
    const attributes: PydanticFormFieldAttributes = {};

    // we could do this in a few lines by casting schemafield
    // to the attributes. However, we dont know yet if the
    // data from the Backend will stay the same..

    if (schemaField.uniforms?.disabled) {
        attributes.disabled = true;
    }

    if (schemaField.uniforms?.sensitive) {
        attributes.sensitive = true;
    }

    if (schemaField.uniforms?.password) {
        attributes.password = true;
    }

    return attributes;
};

/**
 * This function can be used as the onValueChange handler in a react hook form form element component.
 * When used, it will trigger the related validations whenever the field changes
 *
 * @param rhf
 * @param field
 * @returns
 */
export const rhfTriggerValidationsOnChange =
    (
        rhf: ReturnType<typeof useForm>,
        field: ControllerRenderProps<FieldValues, string>,
    ) =>
    (value: string) => {
        field.onChange(value);

        // it seems we need this because the 2nd error would get stale..
        // https://github.com/react-hook-form/react-hook-form/issues/8170
        // https://github.com/react-hook-form/react-hook-form/issues/10832
        rhf.trigger(field.name);
    };
