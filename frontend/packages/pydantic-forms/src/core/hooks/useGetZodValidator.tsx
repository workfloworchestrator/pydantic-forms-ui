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

import { getClientSideValidationRule } from '@/components/componentMatcher';
import { getFlatFieldMap } from '@/core/helper';
import {
    CustomValidationRule,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

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
        const flatFieldMap = getFlatFieldMap(pydanticFormSchema.properties);

        return z.object(
            [...flatFieldMap].reduce(
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
    }, [customValidationRule, rhf, pydanticFormSchema, customComponentMatcher]);
};
