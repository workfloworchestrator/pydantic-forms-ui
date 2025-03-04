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
    PydanticFormsContextConfig,
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
                required: !!schema.required?.includes(fieldId),
                attributes: getFieldAttributes(propertySchema),
                schemaProperty: propertySchema,
                validations: getFieldValidation(propertySchema),
                columns: 6, // TODO: Is this still

                title: formLabels[fieldId]?.toString() ?? fieldProperties.title,
                description: formLabels[fieldId + '_info']?.toString() ?? '',

                ...fieldDetailProvider?.[fieldId],
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
    formLabels: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    formStructureMutator?: PydanticFormsContextConfig['formStructureMutator'],
): {
    pydanticFormSchema: PydanticFormSchema | undefined;
    isLoading: boolean;
    error: Error | undefined;
} => {
    console.log(formLabels, formStructureMutator, fieldDetailProvider);

    const {
        data: parsedSchema,
        isLoading,
        error,
    } = useRefParser('parseSchema', rawJsonSchema);
    // Add label translations to title and description
    // Use formStructure mutator

    const pydanticFormSchema = useMemo((): PydanticFormSchema | undefined => {
        if (!parsedSchema) return undefined;
        const pydanticFormSchema: PydanticFormSchema = {
            type: PydanticFormFieldType.OBJECT,
            title: parsedSchema?.title,
            description: parsedSchema?.description,
            additionalProperties: parsedSchema?.additionalProperties,
            required: parsedSchema?.required,
            properties: parseProperties(parsedSchema),
        };

        return formStructureMutator
            ? formStructureMutator(pydanticFormSchema)
            : pydanticFormSchema;
    }, [formStructureMutator, parsedSchema]);

    return {
        pydanticFormSchema,
        isLoading,
        error,
    };
};
