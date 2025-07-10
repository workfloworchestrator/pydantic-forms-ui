/**
 * Pydantic Forms
 *
 * Helper functions to be used in PydanticForms
 */
import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';

import { z } from 'zod/v4';
import type { ZodType } from 'zod/v4';

import defaultComponentMatchers from '@/components/defaultComponentMatchers';
import { TextField } from '@/components/fields';
import {
    ElementMatch,
    Properties,
    PydanticComponentMatcher,
    PydanticFormApiResponse,
    PydanticFormComponents,
    PydanticFormField,
    PydanticFormFieldAttributes,
    PydanticFormFieldOption,
    PydanticFormFieldType,
    PydanticFormFieldValidations,
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
    PydanticFormsContextConfig,
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
 * This functions looks to see if the field has any of the anyOf, allOf or oneOf keys. If it
 * does hoists these properties to the root level. This is for use cases where we get field definitions
 * like this:
 * {
 *     "id": "bfd",
 *    "type": "object",
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
            (isNullable(propertySchemaParsed) &&
                propertySchemaParsed.oneOf.length > 2) ||
            (!isNullable(propertySchemaParsed) &&
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
            (isNullable(propertySchemaParsed) &&
                propertySchemaParsed.anyOf.length > 2) ||
            (!isNullable(propertySchemaParsed) &&
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
    // .options is a custom property that left here for backwards compatibility.
    const propertyEnums =
        propertySchemaParsed.enum ?? propertySchemaParsed.items?.enum;
    const propertyOptions =
        propertySchemaParsed.options ?? propertySchemaParsed.items?.options;

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
 * Checks if the schema's type or one of the combinator props anyOf or oneOf contains a type of 'null'.
 * This tells us if the field is allowed to be null or not.
 *
 * @param schema A field from the 'properties' key of the JSON Schema
 * @returns true if the schema is nullable, false otherwise
 */
export const isNullable = (schema: PydanticFormPropertySchemaParsed) => {
    // Check if the schema has a type of 'null' or if it has an anyOf with a type of 'null'
    const isNullType = schema.type === PydanticFormFieldType.NULL;
    const hasNullAnyOf = schema.anyOf?.some(
        (item) => item.type === PydanticFormFieldType.NULL,
    );

    const hasNullOneOf = schema.oneOf?.some(
        (item) => item.type === PydanticFormFieldType.NULL,
    );

    return isNullType || hasNullAnyOf || hasNullOneOf || false;
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
        maxLength,
        minLength,
        pattern,
        type,
        minimum,
        maximum,
        exclusiveMaximum,
        exclusiveMinimum,
        multipleOf,
        minItems,
        maxItems,
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
 * Will return a Record map of [fieldId]: "Fieldvalue"
 *
 * Requires both fieldsDef (these can have default values)
 * And labelData (this holds the current values from API)
 */
export const getFormValuesFromFieldOrLabels = (
    pydanticFormSchema?: PydanticFormSchema,
    labelData?: Record<string, string>,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): FieldValues => {
    if (!pydanticFormSchema) {
        return {};
    }

    const fieldValues: FieldValues = {};

    const includedFields: string[] = [];

    const pydanticFormComponents = getPydanticFormComponents(
        pydanticFormSchema.properties,
        componentMatcherExtender,
    );

    pydanticFormComponents.forEach((component) => {
        const { Element, pydanticFormField } = component;

        if (Element.isControlledElement) {
            includedFields.push(pydanticFormField.id);

            if (typeof pydanticFormField.default !== 'undefined') {
                fieldValues[pydanticFormField.id] = pydanticFormField.default;
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

export const getMatcher = (
    componentMatcherExtender: PydanticFormsContextConfig['componentMatcherExtender'],
) => {
    const componentMatchers = componentMatcherExtender
        ? componentMatcherExtender(defaultComponentMatchers)
        : defaultComponentMatchers;

    return (field: PydanticFormField): PydanticComponentMatcher | undefined => {
        return componentMatchers.find(({ matcher }) => {
            return matcher(field);
        });
    };
};

export const getClientSideValidationRule = (
    pydanticFormField: PydanticFormField | undefined,
    rhf?: ReturnType<typeof useForm>,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): ZodType => {
    if (!pydanticFormField) return z.unknown();
    const matcher = getMatcher(componentMatcherExtender);

    const componentMatch = matcher(pydanticFormField);

    let validationRule =
        componentMatch?.validator?.(pydanticFormField, rhf) ?? z.unknown();

    if (!pydanticFormField.required) {
        validationRule = validationRule.optional();
    }

    if (pydanticFormField.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};

const defaultComponent: ElementMatch = {
    Element: TextField,
    isControlledElement: true,
};

export const fieldToComponentMatcher = (
    pydanticFormField: PydanticFormField,
    componentMatcherExtender: PydanticFormsContextConfig['componentMatcherExtender'],
) => {
    const matcher = getMatcher(componentMatcherExtender);
    const matchedComponent = matcher(pydanticFormField);

    const ElementMatch: ElementMatch = matchedComponent
        ? matchedComponent.ElementMatch
        : defaultComponent; // Defaults to textField when there are no matches

    return {
        Element: ElementMatch,
        pydanticFormField: pydanticFormField,
    };
};
export const getPydanticFormComponents = (
    properties: Properties,
    componentMatcherExtender: PydanticFormsContextConfig['componentMatcherExtender'],
): PydanticFormComponents => {
    const components: PydanticFormComponents = Object.values(properties).map(
        (pydanticFormField) => {
            return fieldToComponentMatcher(
                pydanticFormField,
                componentMatcherExtender,
            );
        },
    );

    return components;
};
