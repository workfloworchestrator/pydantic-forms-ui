import { useMemo } from 'react';

import {
    flattenSchemaCombinators,
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
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
    PydanticFormSchemaRawJson,
    PydanticFormsContextConfig,
} from '@/types';
import { PydanticFormFieldFormat, PydanticFormFieldType } from '@/types';

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

const getPydanticFormField = (
    propertySchema: PydanticFormPropertySchemaParsed,
    propertyId: string,
    requiredFields: string[],
    formLabels?: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    isArrayItem: boolean = false, // Arrayitems should not have titles or descriptions. Their properties will have them instead
    prefix: string = '',
) => {
    const flatSchema = flattenSchemaCombinators(propertySchema);
    const propertyName = propertyId.split('.').pop() || propertyId;

    // If there is a fieldOptionsEntry - meaning values in anyOf, allOf or oneOf
    // they will be merged into the toplevel propertySchema where the toplevel wins over the fieldOptionsEntry
    // This solves the case where the propertySchema only contains an anyOf, allOf or oneOf entry and no other properties
    // TODO: Possibly add a case for when there are multiple fieldOptionsEntries
    const options = getFieldOptions(flatSchema);

    const validations = getFieldValidation(flatSchema);
    const attributes = getFieldAttributes(flatSchema);
    const properties = parseProperties(
        flatSchema.properties || {},
        flatSchema.required || [],
        formLabels,
        fieldDetailProvider,
        prefix,
    );
    const title = !isArrayItem
        ? translateLabel(propertyName, flatSchema.title, formLabels) ||
          propertyName
        : '';

    const description = !isArrayItem
        ? translateLabel(
              `${propertyName}_info`,
              flatSchema.description,
              formLabels,
          )
        : '';
    const arrayItem = flatSchema.items
        ? getPydanticFormField(
              flatSchema.items,
              propertyId,
              requiredFields,
              formLabels,
              fieldDetailProvider,
              true,
          )
        : undefined;

    //TODO: I think object properties should never be required only their properties are or aren't. Should we fix this in the backend?
    const required =
        flatSchema.type === PydanticFormFieldType.OBJECT
            ? false
            : !!requiredFields?.includes(propertyId);

    const pydanticFormField: PydanticFormField = {
        id: propertyId,
        title,
        description,
        arrayItem,
        format: flatSchema.format || PydanticFormFieldFormat.DEFAULT,
        type: flatSchema.type || PydanticFormFieldType.STRING,
        options: options,
        default: flatSchema.default,
        attributes: attributes,
        schema: propertySchema,
        required,
        validations,
        columns: 6, // TODO: Is this still relevant? https://github.com/workfloworchestrator/orchestrator-ui-library/issues/1891
        properties,
        ...fieldDetailProvider?.[propertyId],
    };
    return pydanticFormField;
};

export const parseProperties = (
    properties: ParsedProperties,
    requiredFields: string[] = [],
    formLabels?: Record<string, string>,
    fieldDetailProvider?: PydanticFormsContextConfig['fieldDetailProvider'],
    prefix: string = '',
): Properties => {
    if (!properties) return {};

    const schemaProperties = Object.entries(properties);

    const parsedProperties = schemaProperties.reduce(
        (propertiesObject: Properties, [propertyId, propertySchema]) => {
            const propertyKey = `${prefix ? prefix + '.' : ''}${propertyId}`;

            const pydanticFormField = getPydanticFormField(
                propertySchema,
                propertyKey,
                requiredFields,
                formLabels,
                fieldDetailProvider,
                false, // We are not dealing with array items here
                propertyKey,
            );

            propertiesObject[propertyKey] = pydanticFormField;
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
