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
    ParsedProperties,
    Properties,
    PydanticFormField,
    PydanticFormFieldAnyOfItemParsed,
    PydanticFormSchema,
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
    properties: ParsedProperties | PydanticFormFieldAnyOfItemParsed,
    requiredFields: string[] = [],
    formLabels?: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    prefix: string = '',
) => {
    if (!properties) return {};

    const schemaProperties = Object.entries(properties);
    const parsedProperties = schemaProperties.reduce(
        (propertiesObject: Properties, [propertyId, propertySchema]) => {
            const options = getFieldOptions(propertySchema);
            const fieldOptionsEntry = getFieldAllOfAnyOfEntry(propertySchema);
            const id = `${prefix && prefix + '.'}${propertyId}`;

            const parsedProperty: PydanticFormField = {
                id,
                title:
                    translateLabel(
                        propertyId,
                        propertySchema.title,
                        formLabels,
                    ) || propertyId,
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
                // TODO: I think object properties should never be required only their properties are or aren't. Should we fix this in the backend?
                required:
                    propertySchema.type === PydanticFormFieldType.OBJECT
                        ? false
                        : !!requiredFields?.includes(propertyId),
                attributes: getFieldAttributes(propertySchema),
                schema: propertySchema,
                validations: getFieldValidation(propertySchema),
                columns: 6, // TODO: Is this still relevant?
                properties: parseProperties(
                    propertySchema.properties || {},
                    propertySchema.required || [],
                    formLabels,
                    fieldDetailProvider,
                    id,
                ),
                ...fieldDetailProvider?.[propertyId],
            };

            if (propertySchema.type === PydanticFormFieldType.ARRAY) {
                // When the property is an array, we need to parse the item that is an array element
                // Currently we only support arrays of single field types so items can never be multiple items
                // TODO: Only in the case of an optional property do we have a an array of null |  Item so we should add a case for that
                const itemProperties =
                    propertySchema.items as PydanticFormFieldAnyOfItemParsed;
                const itemOptions = getFieldOptions(itemProperties);
                parsedProperty.arrayItem = {
                    id: id,
                    title: itemProperties.title,
                    type: itemProperties.type,
                    format: itemProperties.format,
                    options: itemOptions.options || [],
                    isEnumField: itemOptions.isOptionsField,
                    default: itemProperties.default,
                    // TODO: I think object properties should never be required only their properties are or aren't. Should we fix this in the backend?
                    required:
                        propertySchema.type === PydanticFormFieldType.OBJECT
                            ? false
                            : !!itemProperties.required?.includes(propertyId),
                    attributes: getFieldAttributes(itemProperties),
                    schema: itemProperties,
                    validations: getFieldValidation(itemProperties),
                    columns: 6, // TODO: Is this still relevant?
                    properties: parseProperties(
                        itemProperties.properties || {},
                        itemProperties.required || [],
                        formLabels,
                        fieldDetailProvider,
                        id,
                    ),
                    ...fieldDetailProvider?.[propertyId],
                };
            }

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
                parsedSchema.properties || {},
                parsedSchema.required || [],
                formLabels,
                fieldDetailProvider,
            ),
        };

        return formStructureMutator
            ? formStructureMutator(pydanticFormSchema)
            : pydanticFormSchema;
    }, [formStructureMutator, parsedSchema, formLabels, fieldDetailProvider]);

    return {
        pydanticFormSchema,
        isLoading,
        error,
    };
};
