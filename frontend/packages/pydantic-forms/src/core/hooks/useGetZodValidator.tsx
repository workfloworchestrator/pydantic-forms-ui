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

import { getMatcher } from '@/core/helper';
import {
    CustomValidationRule,
    PydanticFormField,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

type PropertyMap = Map<string, PydanticFormField>;

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
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    const matcher = getMatcher(customComponentMatcher);

    const componentMatch = matcher(field);

    let validationRule = componentMatch?.validator?.(field, rhf) ?? z.string();

    if (!field.required) {
        validationRule = validationRule.optional();
    }

    if (field.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};

export const useGetZodValidator = (
    pydanticFormSchema?: PydanticFormSchema,
    rhf?: ReturnType<typeof useForm>,
    customValidationRule?: CustomValidationRule,
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
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
                        getClientSideValidationRule(
                            pydanticFormField,
                            rhf,
                            customComponentMatcher,
                        );

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
