/**
 * Pydantic Forms
 *
 * A custom form to ZOD schema validation generator.
 * Here we can implement client side rules based on the received JSON Schema
 *
 * ZOD: https://zod.dev/
 * ZOD react-hook-form: https://github.com/react-hook-form/resolvers?tab=readme-ov-file#zod
 */
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

import {
    CustomValidationRule,
    PydanticFormField,
    PydanticFormSchema,
} from '@/types';

type PropertyMap = Map<string, PydanticFormField>;

/*
const addSubFieldIds = (
    schema: PydanticFormPropertySchema,
    fieldMap: FieldMap,
    prefix: string
) => {
    Object.values(schema.properties ?? {}).forEach((property) => {
        
        if (property.type === PydanticFormFieldType.OBJECT) {
            addSubFieldIds(property.schemaProperty, fieldMap);
        
        fieldMap.set(`${prefix}.${property.id}`, property);
    });
};
*/
const getFlatPropertyMap = (schema: PydanticFormSchema): PropertyMap => {
    const propertyMap: PropertyMap = new Map();

    if (schema) {
        Object.entries(schema.properties ?? {}).forEach(
            ([id, pydanticFormPropertySchema]) => {
                propertyMap.set(id, pydanticFormPropertySchema);
            },
        );
    }

    return propertyMap;
};

const getClientSideValidationRule = (
    field: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => {
    console.log('getting clientside validation', field, rhf);
    return false;
};

export const useGetZodValidator = (
    pydanticFormSchema?: PydanticFormSchema,
    rhf?: ReturnType<typeof useForm>,
    customValidationRule?: CustomValidationRule,
) => {
    return useMemo(() => {
        if (!pydanticFormSchema) {
            return z.object({});
        }
        // Get all fields ids including the nested ones to generate the correct validation schema
        const flatPropertyMap = getFlatPropertyMap(pydanticFormSchema);

        return z.object(
            [...flatPropertyMap].reduce(
                (validationObject, [propertyId, pydanticFormField]) => {
                    const fieldRules =
                        customValidationRule?.(pydanticFormField, rhf) ??
                        getClientSideValidationRule(pydanticFormField, rhf);

                    return {
                        ...validationObject,
                        [propertyId]: fieldRules,
                    };
                },
                {},
            ),
        );
    }, [customValidationRule, rhf, pydanticFormSchema]);
};
