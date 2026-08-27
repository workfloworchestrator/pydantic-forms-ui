/**
 * Pydantic Forms
 *
 * Helper functions to be used in PydanticForms
 */
import { FieldValues } from 'react-hook-form';

import {
    Properties,
    PydanticFormApiValidationError,
    PydanticFormContextConfig,
    PydanticFormField,
    PydanticFormFieldAttributes,
    PydanticFormFieldOption,
    PydanticFormFieldType,
    PydanticFormFieldValidations,
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
    PydanticFormValidationErrorDetails,
    PydanticFormValidationResponse,
} from '../types';
import { getPydanticFormComponents } from './getPydanticFormComponents';

export const getFormFieldIdFromLocation = (
    loc: PydanticFormApiValidationError['loc'],
) => loc.join('.');

/**
 * Error object formatting
 *
 * @param apiErrorResp The JSON Schema from the backend
 * @returns A object better usable for displaying errors
 */
export const getValidationErrorDetailsFromResponse = (
    formValidationResponse: PydanticFormValidationResponse,
): PydanticFormValidationErrorDetails => {
    return {
        detail: formValidationResponse.detail ?? '',
        source: formValidationResponse.validation_errors,
        mapped: formValidationResponse.validation_errors.reduce((old, cur) => {
            return {
                ...old,
                [getFormFieldIdFromLocation(cur.loc)]: {
                    value: cur.input,
                    msg: cur.msg,
                },
            };
        }, {}),
    };
};

export const removeValidationErrorByLoc = (
    validationErrors: PydanticFormValidationErrorDetails | null,
    locToRemove: string,
): PydanticFormValidationErrorDetails | null => {
    if (!validationErrors) return null;

    const newSource = validationErrors.source.filter((err) => {
        const locPath = getFormFieldIdFromLocation(err.loc); // e.g. "contact_persons.0.email"
        return locPath !== locToRemove;
    });

    const newMapped = { ...validationErrors.mapped };
    delete newMapped[locToRemove];

    return {
        ...validationErrors,
        source: newSource,
        mapped: newMapped,
    };
};

/**
 * This functions looks to see if the field has any of the anyOf, allOf or oneOf keys. If it
 * does hoists these properties to the root level. When hoisting the root level properties win over the
 * hoisted one. This is for use cases where we get field definitions
 * like this:
 * {
 *     "id": "bfd",
 *    "type": "object",
 *    "required": ["enabled"],
 *    "allOf": [
 *        {... propertySchemaParsed}
 *        {type: "null"}
 *     ]
 * }
 */
export const flattenSchemaCombinators = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
): PydanticFormPropertySchemaParsed => {
    if (propertySchemaParsed.allOf) {
        const allOfProperties = propertySchemaParsed.allOf.reduce(
            (mergedItem, allOfItem) => {
                return { ...mergedItem, ...allOfItem };
            },
        );

        if (propertySchemaParsed.anyOf || propertySchemaParsed.oneOf) {
            console.warn(
                'Pydantic forms does not currently support combining allOf with anyOf or oneOf. This may lead to unexpected behavior.',
            );
        }

        return {
            ...allOfProperties,
            ...propertySchemaParsed,
        };
    }

    if (propertySchemaParsed.oneOf) {
        if (propertySchemaParsed.anyOf) {
            console.warn(
                'Pydantic forms does not support combining oneOf with anyOf. This may lead to unexpected behavior.',
            );
        }

        if (
            (containsNullableSchema(propertySchemaParsed.oneOf) &&
                propertySchemaParsed.oneOf.length > 2) ||
            (!containsNullableSchema(propertySchemaParsed.oneOf) &&
                propertySchemaParsed.oneOf.length > 1)
        ) {
            console.warn(
                "Pydantic forms does not support multiple oneOf schema's and defaults to the first one. This may lead to unexpected behavior.",
            );
        }

        return {
            ...propertySchemaParsed.oneOf[0],
            ...propertySchemaParsed,
        };
    }

    if (propertySchemaParsed.anyOf) {
        if (
            (containsNullableSchema(propertySchemaParsed.anyOf) &&
                propertySchemaParsed.anyOf.length > 2) ||
            (!containsNullableSchema(propertySchemaParsed.anyOf) &&
                propertySchemaParsed.anyOf.length > 1)
        ) {
            console.warn(
                "Pydantic forms does not support multiple anyOf schema's and defaults to the first one. This may lead to unexpected behavior.",
            );
        }

        return {
            ...propertySchemaParsed.anyOf[0],
            ...propertySchemaParsed,
        };
    }

    return propertySchemaParsed;
};

/**
 * Field to field options
 *
 * @param propertySchemaParsed A field from the 'properties' key of the JSON Schema
 * @returns an array of options in strings
 */
export const getFieldOptions = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
): PydanticFormFieldOption[] => {
    const options: PydanticFormFieldOption[] = [];

    // NOTE: enum is the property described in the JSON Schema specification that stores possible values for a field.
    // .options is a custom property left here for backwards compatibility.
    const propertyEnums = propertySchemaParsed.enum;
    const propertyOptions = propertySchemaParsed.options;

    if (propertyEnums && !propertyOptions) {
        options.push(...enumToOption(propertyEnums));
    }

    if (propertyOptions) {
        options.push(...optionsToOption(propertyOptions, propertyEnums));
    }

    return options;
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
    fieldId: string | number,
    formSchema?: PydanticFormSchema,
) => {
    const fieldMap = getFlatFieldMap(formSchema?.properties ?? {});
    return fieldMap.has(fieldId) ? fieldMap.get(fieldId)?.title : fieldId;
};

type FieldMap = Map<string | number, PydanticFormField>;
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
 * Checks if the schema's type or one of the combinator props anyOf or oneOf contains a type of 'null'.
 * This tells us if the field is allowed to be null or not.
 *
 * @returns true if the schema is nullable, false otherwise
 */
export const isNullable = (schema: PydanticFormPropertySchemaParsed) => {
    // Check if the schema has a type of 'null' or if it has an anyOf with a type of 'null'
    const isNullType = schema.type === PydanticFormFieldType.NULL;
    const hasNullAnyOf = containsNullableSchema(schema.anyOf ?? []);
    const hasNullOneOf = containsNullableSchema(schema.oneOf ?? []);

    return isNullType || hasNullAnyOf || hasNullOneOf || false;
};

const containsNullableSchema = (
    schemas: PydanticFormPropertySchemaParsed[],
): boolean => {
    return schemas.some((item) => item.type === PydanticFormFieldType.NULL);
};

/**
 * Field to validation object
 *
 * @param fieldProperties A field from the 'properties' key of the JSON Schema
 * @returns returns a validation object
 */
export const getFieldValidation = (
    schema: PydanticFormPropertySchemaParsed,
) => {
    const validation: PydanticFormFieldValidations = {};

    if (isNullable(schema)) {
        validation.isNullable = true;
    }
    const {
        maxItems,
        minItems,
        maxLength,
        minLength,
        pattern,
        type,
        minimum,
        maximum,
        exclusiveMaximum,
        exclusiveMinimum,
        multipleOf,
        uniqueItems,
    } = schema;

    if (type === PydanticFormFieldType.STRING) {
        if (maxLength) validation.maxLength = maxLength;
        if (minLength) validation.minLength = minLength;
        if (pattern) validation.pattern = pattern;
    }
    if (
        type === PydanticFormFieldType.NUMBER ||
        type === PydanticFormFieldType.INTEGER
    ) {
        if (minimum) validation.minimum = minimum;
        if (maximum) validation.maximum = maximum;
        if (exclusiveMinimum) validation.exclusiveMinimum = exclusiveMinimum;
        if (exclusiveMaximum) validation.exclusiveMaximum = exclusiveMaximum;
        if (multipleOf) validation.multipleOf = multipleOf;
    }
    if (type === PydanticFormFieldType.ARRAY) {
        validation.minItems = minItems;
        validation.maxItems = maxItems;
        validation.uniqueItems = uniqueItems;
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
 * Returns the initial values for the form field based on the
 * default values and const values found in the parsed PydanticFormSchema.
 * Iterates over the properties and arrayItems of the schema.
 *
 * And labelData (this holds the current values from API)
 */
export const getFormValuesFromFieldOrLabels = (
    componentMatcher: PydanticFormContextConfig['componentMatcher'],
    properties?: Properties,
    labelData?: Record<string, string>,
): FieldValues => {
    if (!properties) {
        return {};
    }

    const objectHasProperties = (object: Record<string, unknown>) => {
        return object &&
            typeof object === 'object' &&
            Object.keys(object).length > 0
            ? true
            : false;
    };

    const propertyHasProperties = (
        pydanticFormField: PydanticFormField,
    ): boolean => {
        return objectHasProperties(pydanticFormField.properties || {});
    };

    const hasDefaultValue = (defaultFieldValue: unknown): boolean => {
        return (
            typeof defaultFieldValue !== 'undefined' &&
            defaultFieldValue !== null
        );
    };

    const fieldValues: FieldValues = {};

    const includedFields: string[] = [];

    const pydanticFormComponents = getPydanticFormComponents(
        properties,
        componentMatcher,
    );

    pydanticFormComponents.forEach((component) => {
        const { Element, pydanticFormField } = component;

        if (
            Element.isControlledElement ||
            propertyHasProperties(pydanticFormField) ||
            pydanticFormField.arrayItem
        ) {
            includedFields.push(pydanticFormField.id);
            const defaultFieldValue = pydanticFormField.default;

            if (propertyHasProperties(pydanticFormField)) {
                // If the field has properties and there is no default value for a property
                // we try to get it from the property definition
                const objectProperties = pydanticFormField.properties || {};
                const objectDefaults: FieldValues = Object.entries(
                    objectProperties,
                ).reduce((defaults, [key, property]) => {
                    if (
                        hasDefaultValue(defaultFieldValue) &&
                        hasDefaultValue(defaultFieldValue[key])
                    ) {
                        defaults[key] = defaultFieldValue[key];
                    } else {
                        const nestedDefault = getFormValuesFromFieldOrLabels(
                            componentMatcher,
                            { [key]: property },
                            labelData,
                        );

                        if (objectHasProperties(nestedDefault)) {
                            defaults[key] = nestedDefault[key];
                        }
                    }
                    return defaults;
                }, {} as FieldValues);

                if (objectHasProperties(objectDefaults)) {
                    fieldValues[pydanticFormField.id] = objectDefaults;
                }
            } else if (pydanticFormField.arrayItem) {
                // If there is no default value in the array field we get it from the arrayItem
                if (hasDefaultValue(defaultFieldValue)) {
                    fieldValues[pydanticFormField.id] = defaultFieldValue;
                } else {
                    const arrayItem = pydanticFormField.arrayItem;
                    const arrayItemDefault = getFormValuesFromFieldOrLabels(
                        componentMatcher,
                        { arrayItem },
                        labelData,
                    );

                    if (objectHasProperties(arrayItemDefault)) {
                        fieldValues[pydanticFormField.id] = [
                            arrayItemDefault[arrayItem.id],
                        ];
                    } else if (pydanticFormField.required) {
                        // This is somewhat of a special case.
                        // It deals with the situation where an array is marked required but has no default value.
                        // Not setting the value here would require a user to select and then unselect an item if they want to send an empty array
                        fieldValues[pydanticFormField.id] = [];
                    }
                }
            } else if (hasDefaultValue(defaultFieldValue)) {
                fieldValues[pydanticFormField.id] = defaultFieldValue;
            }
        }
    });

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

    if (schemaField.const) {
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
