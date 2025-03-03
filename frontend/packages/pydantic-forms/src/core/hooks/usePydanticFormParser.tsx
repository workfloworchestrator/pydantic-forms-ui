import { useMemo } from 'react';

import $RefParser from '@apidevtools/json-schema-ref-parser';

import {
    getFieldAllOfAnyOfEntry,
    getFieldAttributes,
    getFieldOptions,
    getFieldValidation,
} from '@/core/helper';

/**
 * Pydantic Forms
 *
 * A hook that will parse the received JSON Schema
 * and parse it and turn it into something more usable.
 *
 */
import type {
    PydanticFormField,
    PydanticFormSchema,
    PydanticFormSchemaParsed,
    PydanticFormSchemaRawJson,
} from '@/types';
import { PydanticFormFieldType } from '@/types';

const refParseSchema = (
    pydanticFormRawJsonSchema: PydanticFormSchemaRawJson,
): PydanticFormSchemaParsed | undefined => {
    try {
        const parsedSchema = $RefParser.dereference(pydanticFormRawJsonSchema, {
            mutateInputSchema: false,
        });

        return parsedSchema as unknown as PydanticFormSchemaParsed;
    } catch (error) {
        console.error(error);
        new Error('Could not parse JSON references');
    }
};

const parseProperties = (
    schema: PydanticFormSchemaParsed,
    prefix: string = '',
) => {
    const schemaProperties = schema.properties;

    if (!schemaProperties) return {};

    const properties = Object.entries(schemaProperties);
    const parsedProperties = properties.reduce(
        (
            propertiesObject: PydanticFormSchema['properties'],
            [propertyId, propertySchema],
        ) => {
            const options = getFieldOptions(propertySchema);
            const fieldOptionsEntry = getFieldAllOfAnyOfEntry(propertySchema);
            const id = `${prefix && prefix + '.'}${propertyId}`;

            const parsedProperty: PydanticFormField = {
                id,
                title: propertySchema.title,
                description: propertySchema.description,
                format: propertySchema.format ?? fieldOptionsEntry?.[0]?.format,
                type:
                    propertySchema.type ??
                    fieldOptionsEntry?.[0]?.type ??
                    fieldOptionsEntry?.[0]?.items?.type,
                options: options.options,
                isEnumField: options.isOptionsField,
                default: propertySchema.default,
                required: false,
                attributes: getFieldAttributes(propertySchema),
                schemaProperty: propertySchema,
                validations: getFieldValidation(propertySchema),
                columns: 6,
            };

            propertiesObject[id] = parsedProperty;
            return propertiesObject;
        },
        {},
    );

    return parsedProperties;
};

export function usePydanticFormParser(
    rawJsonSchema?: PydanticFormSchemaRawJson,
): PydanticFormSchema | undefined {
    return useMemo(() => {
        if (!rawJsonSchema) return undefined;
        const parsedSchema = refParseSchema(rawJsonSchema);

        if (!parsedSchema) return undefined;
        const properties = parseProperties(parsedSchema);

        return {
            type: PydanticFormFieldType.OBJECT,
            title: rawJsonSchema.title,
            description: rawJsonSchema.description,
            additionalProperties: rawJsonSchema.additionalProperties,
            required: rawJsonSchema.required,
            properties,
        };
    }, [rawJsonSchema]);
}
