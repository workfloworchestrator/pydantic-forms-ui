import { useCallback, useMemo, useState } from 'react';

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

import { useRefParser } from './useRefParser';

const parseProperties = (
    parsedSchema: PydanticFormSchemaParsed,
    prefix: string = '',
) => {
    if (!parsedSchema) return {};

    const schemaProperties = parsedSchema.properties;

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

export const usePydanticFormParser = (
    rawJsonSchema: PydanticFormSchemaRawJson | undefined,
): {
    pydanticFormSchema: PydanticFormSchema | undefined;
    isLoading: boolean;
    error: Error | undefined;
} => {
    const {
        data: parsedSchema,
        isLoading,
        error,
    } = useRefParser('parseSchema', rawJsonSchema);

    const pydanticFormSchema = useMemo((): PydanticFormSchema | undefined => {
        if (!parsedSchema) return undefined;
        return {
            type: PydanticFormFieldType.OBJECT,
            title: parsedSchema?.title,
            description: parsedSchema?.description,
            additionalProperties: parsedSchema?.additionalProperties,
            required: parsedSchema?.required,
            properties: parseProperties(parsedSchema),
        };
    }, [parsedSchema]);

    return {
        pydanticFormSchema,
        isLoading,
        error,
    };
};
