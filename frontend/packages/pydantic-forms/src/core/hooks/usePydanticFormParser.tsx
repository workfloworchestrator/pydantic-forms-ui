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
} from '@/types';
import { PydanticFormFieldFormat, PydanticFormFieldType } from '@/types';
import { toOptionalObjectProperty } from '@/utils';

import { useRefParser } from './useRefParser';

const translateLabel = (
    propertyId: string,
    label?: string,
    formLabels?: Record<string, string>,
): string | undefined => {
    const isString = typeof formLabels?.[propertyId] === 'string';
    return formLabels && formLabels[propertyId] && isString
        ? formLabels[propertyId].toString()
        : label;
};

const getPydanticFormField = (
    propertySchema: PydanticFormPropertySchemaParsed,
    propertyId: string,
    requiredFields: string[],
    formLabels?: Record<string, string>,
    isArrayItem: boolean = false, // Arrayitems should not have titles or descriptions. Their properties will have them instead
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
              true,
          )
        : undefined;

    const addConstValue =
        typeof flatSchema.const === 'undefined' ? false : true;

    // Don't add options to array items if they have an arrayItem where they live
    const addOptions = !(
        flatSchema.type === PydanticFormFieldType.ARRAY && arrayItem
    );

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
        ...toOptionalObjectProperty({ options }, addOptions),
        default: flatSchema.default,
        attributes: attributes,
        schema: propertySchema,
        required,
        validations,
        ...toOptionalObjectProperty({ const: flatSchema.const }, addConstValue),
        properties,
    };
    return pydanticFormField;
};

export const parseProperties = (
    properties: ParsedProperties,
    requiredFields: string[] = [],
    formLabels?: Record<string, string>,
): Properties => {
    if (!properties) return {};

    const schemaProperties = Object.entries(properties);

    const parsedProperties = schemaProperties.reduce(
        (propertiesObject: Properties, [propertyId, propertySchema]) => {
            const pydanticFormField = getPydanticFormField(
                propertySchema,
                propertyId,
                requiredFields,
                formLabels,
                false, // We are not dealing with array items here
            );

            propertiesObject[propertyId] = pydanticFormField;
            return propertiesObject;
        },
        {},
    );

    return parsedProperties;
};

export const usePydanticFormParser = (
    rawJsonSchema: PydanticFormSchemaRawJson,
    formLabels?: Record<string, string>,
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
            ),
        };

        return pydanticFormSchema;
    }, [parsedSchema, formLabels]);

    return {
        pydanticFormSchema,
        isLoading,
        error,
    };
};
