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

import { z } from 'zod/v4';
import { ZodAny, ZodArray, ZodObject, ZodType } from 'zod/v4';

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
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): ZodType | ZodObject | ZodArray => {
    if (pydanticFormField.type === PydanticFormFieldType.OBJECT) {
        const objectValidationObject = getZodValidationObject(
            pydanticFormField.properties || {},
            componentMatcherExtender,
        );
        return objectValidationObject;
    }
    if (pydanticFormField.type === PydanticFormFieldType.ARRAY) {
        const arrayItem = pydanticFormField.arrayItem;

        const arrayItemRule = arrayItem
            ? getZodRule(arrayItem, componentMatcherExtender)
            : z.any();
        const arrayRule = z
            .array(arrayItemRule || z.unknown())
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
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): ZodObject | ZodAny => {
    const pydanticFormComponents = getPydanticFormComponents(
        properties,
        componentMatcherExtender,
    );
    if (!pydanticFormComponents || pydanticFormComponents.length === 0)
        return z.any();

    const validationObject: { [k: string]: z.ZodTypeAny } = {};
    pydanticFormComponents.forEach((component) => {
        const { Element, pydanticFormField } = component;
        // The field is not added to the schema if it's not controlled unless it has properties or an arrayItem
        // that we need to iterate over further
        if (
            !pydanticFormField ||
            (!Element.isControlledElement &&
                (!pydanticFormField.properties ||
                    Object.keys(pydanticFormField.properties).length === 0) &&
                !pydanticFormField.arrayItem)
        )
            return;

        const id = pydanticFormField.id;
        const zodRule = getZodRule(pydanticFormField, componentMatcherExtender);

        validationObject[id] = zodRule ?? z.any();
    });
    return validationObject ? z.object(validationObject) : z.any();
};

export const useGetZodValidator = (
    pydanticFormSchema?: PydanticFormSchema,
    componentMatcherExtender?: PydanticFormsContextConfig['componentMatcherExtender'],
): ZodObject | ZodAny => {
    return useMemo(() => {
        if (!pydanticFormSchema) {
            return z.any();
        }
        // Get all fields ids including the nested ones to generate the correct validation schema
        const validationObject = getZodValidationObject(
            pydanticFormSchema.properties,
            componentMatcherExtender,
        );

        return validationObject;
    }, [componentMatcherExtender, pydanticFormSchema]);
};
