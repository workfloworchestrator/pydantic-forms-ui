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

import { ZodRawShape, z } from 'zod';

import { getClientSideValidationRule } from '@/components/componentMatcher';
import {
    CustomValidationRule,
    Properties,
    PydanticFormFieldType,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

/**
 * Generates a Zod validation object from an array of Pydantic form fields.
 *
 * @param pydanticFormFields - An array of Pydantic form fields.
 * @returns A ZodRawShape object representing the validation schema.
 */
const getZodValidationObject = (
    properties: Properties,
    rhf?: ReturnType<typeof useForm>,
    customValidationRule?: CustomValidationRule,
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    const pydanticFormFields = Object.values(properties);

    if (!pydanticFormFields) return {};

    const validationObject: ZodRawShape = {};

    pydanticFormFields.forEach((pydanticFormField) => {
        const id =
            pydanticFormField.id.split('.').pop() || pydanticFormField.id;

        if (pydanticFormField.type === PydanticFormFieldType.OBJECT) {
            validationObject[id] = z.object(
                getZodValidationObject(
                    pydanticFormField.properties || {},
                    rhf,
                    customValidationRule,
                    customComponentMatcher,
                ),
            );
        } else if (pydanticFormField.type === PydanticFormFieldType.ARRAY) {
            const arrayItem = pydanticFormField.arrayItem;
            const customRule = customValidationRule?.(pydanticFormField, rhf);
            const itemSchema =
                customRule ??
                getClientSideValidationRule(
                    arrayItem,
                    rhf,
                    customComponentMatcher,
                );

            validationObject[id] = z
                .array(itemSchema)
                .superRefine((array, context) => {
                    const { uniqueItems } = pydanticFormField.validations;
                    if (uniqueItems) {
                        const uniqueArray = [...new Set(array)];

                        if (uniqueArray.length !== array.length) {
                            context.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: 'Array items must be unique',
                                fatal: true,
                            });
                            return z.NEVER;
                        }
                    }
                });
        } else {
            const fieldRules =
                customValidationRule?.(pydanticFormField, rhf) ??
                getClientSideValidationRule(
                    pydanticFormField,
                    rhf,
                    customComponentMatcher,
                );

            validationObject[id] = fieldRules;
        }
    });

    return validationObject;
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
        const validationObject = getZodValidationObject(
            pydanticFormSchema.properties,
            rhf,
            customValidationRule,
            customComponentMatcher,
        );
        return z.object(validationObject);
    }, [customComponentMatcher, customValidationRule, pydanticFormSchema, rhf]);
};
