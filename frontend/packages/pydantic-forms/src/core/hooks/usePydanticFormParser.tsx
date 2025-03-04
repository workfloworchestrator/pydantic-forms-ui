import { useMemo } from 'react';

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
    Properties,
    PydanticFormField,
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
    PydanticFormSchemaParsed,
    PydanticFormSchemaRawJson,
    PydanticFormsContextConfig,
} from '@/types';
import { PydanticFormFieldType } from '@/types';

import { useRefParser } from './useRefParser';

const translateLabel = (
    propertyId: string,
    label?: string,
    formLabels?: Record<string, string>,
): string | undefined => {
    return formLabels && formLabels[propertyId]
        ? formLabels[propertyId].toString()
        : label;
};

const parseProperties = (
    parsedSchema: PydanticFormSchemaParsed | PydanticFormPropertySchemaParsed,
    formLabels?: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    prefix: string = '',
) => {
    if (!parsedSchema || !parsedSchema.properties) return {};

    const p = Object.entries(parsedSchema.properties);
    const parsedProperties = p.reduce(
        (propertiesObject: Properties, [propertyId, propertySchema]) => {
            const options = getFieldOptions(propertySchema);
            const fieldOptionsEntry = getFieldAllOfAnyOfEntry(propertySchema);
            const id = `${prefix && prefix + '.'}${propertyId}`;

            const parsedProperty: PydanticFormField = {
                id,
                title: translateLabel(
                    propertyId,
                    propertySchema.title,
                    formLabels,
                ),
                description: translateLabel(
                    `${propertyId}_info`,
                    propertySchema.description,
                    formLabels,
                ),

                format: propertySchema.format ?? fieldOptionsEntry?.[0]?.format,
                type:
                    propertySchema.type ??
                    fieldOptionsEntry?.[0]?.type ??
                    fieldOptionsEntry?.[0]?.items?.type,
                options: options.options,
                isEnumField: options.isOptionsField,
                default: propertySchema.default,
                required: !!parsedSchema.required?.includes(propertyId),
                attributes: getFieldAttributes(propertySchema),
                schemaProperty: propertySchema,
                validations: getFieldValidation(propertySchema),
                columns: 6, // TODO: Is this still relevant?
                properties: parseProperties(
                    propertySchema || {},
                    formLabels,
                    fieldDetailProvider,
                    id,
                ),
                ...fieldDetailProvider?.[propertyId],
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
    formLabels?: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    formStructureMutator?: PydanticFormsContextConfig['formStructureMutator'],
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
        const pydanticFormSchema: PydanticFormSchema = {
            type: PydanticFormFieldType.OBJECT,
            title: parsedSchema?.title,
            description: parsedSchema?.description,
            additionalProperties: parsedSchema?.additionalProperties,
            required: parsedSchema?.required,
            properties: parseProperties(
                parsedSchema,
                formLabels,
                fieldDetailProvider,
            ),
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
