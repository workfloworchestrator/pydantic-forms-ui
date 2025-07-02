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

import { ZodRawShape, ZodTypeAny, z } from 'zod';

import {
    getClientSideValidationRule,
    getPydanticFormComponents,
} from '@/core/helper';
import {
    Properties,
    PydanticFormField,
    PydanticFormFieldType,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

export const getZodRule = (
    pydanticFormField: PydanticFormField,
    rhf: ReturnType<typeof useForm>,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): ZodTypeAny => {
    if (pydanticFormField.type === PydanticFormFieldType.OBJECT) {
        const objectValidationObject = getZodValidationObject(
            pydanticFormField.properties || {},
            rhf,
            componentMatcherExtender,
        );
        return objectValidationObject;
    }
    if (pydanticFormField.type === PydanticFormFieldType.ARRAY) {
        const arrayItem = pydanticFormField.arrayItem;
        const arrayItemRule = arrayItem
            ? getZodRule(arrayItem, rhf, componentMatcherExtender)
            : z.unknown();
        const arrayRule = z
            .array(arrayItemRule)
            .superRefine((array, context) => {
                const { uniqueItems } = pydanticFormField.validations;

                if (uniqueItems) {
                    const uniqueArray = [...new Set(array)];

                    if (uniqueArray.length !== array.length) {
                        context.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'not_unique',
                            fatal: true,
                        });
                        return z.NEVER;
                    }
                }
            });

        return arrayRule;
    }

    return getClientSideValidationRule(
        pydanticFormField,
        rhf,
        componentMatcherExtender,
    );
};

/**
 * Generates a Zod validation object from an array of Pydantic form fields.
 *
 * @param pydanticFormFields - An array of Pydantic form fields.
 * @returns A ZodRawShape object representing the validation schema.
 */
export const getZodValidationObject = (
    properties: Properties,
    rhf: ReturnType<typeof useForm>,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
) => {
    const pydanticFormComponents = getPydanticFormComponents(
        properties,
        componentMatcherExtender,
    );
    if (!pydanticFormComponents) return z.unknown();

    const validationObject: ZodRawShape = {};
    pydanticFormComponents.forEach((component) => {
        const { Element, pydanticFormField } = component;

        if (!pydanticFormField || !Element.isControlledElement) return;

        const id = pydanticFormField.id;

        const zodRules = getZodRule(
            pydanticFormField,
            rhf,
            componentMatcherExtender,
        );

        validationObject[id] = zodRules;
    });

    return z.object(validationObject);
};

export const useGetZodValidator = (
    pydanticFormSchema?: PydanticFormSchema,
    rhf?: ReturnType<typeof useForm>,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
) => {
    return useMemo(() => {
        if (!pydanticFormSchema || !rhf) {
            return z.object({});
        }
        // Get all fields ids including the nested ones to generate the correct validation schema
        const validationObject = getZodValidationObject(
            pydanticFormSchema.properties,
            rhf,
            componentMatcherExtender,
        );

        return validationObject;
    }, [componentMatcherExtender, pydanticFormSchema, rhf]);
};
