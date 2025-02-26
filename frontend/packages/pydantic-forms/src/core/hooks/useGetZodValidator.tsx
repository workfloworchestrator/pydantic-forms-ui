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

import clientSideValidationRule from '@/core/clientSideValidationRules';
import { usePydanticFormParser } from '@/core/hooks';
import {
    CustomValidationRule,
    PydanticFormData,
    PydanticFormField,
    PydanticFormFieldType,
    PydanticFormPropertySchema,
} from '@/types';

type FieldMap = Map<string, PydanticFormField>;

const addSubFieldIds = (
    schema: PydanticFormPropertySchema,
    fieldMap: FieldMap,
) => {};

const getFieldMap = (
    formData: PydanticFormData,
): Map<string, PydanticFormField> => {
    const fieldMap = new Map<string, PydanticFormField>();

    if (formData) {
        formData.fields.forEach((field) => {
            if (field.type === PydanticFormFieldType.OBJECT) {
                addSubFieldIds(field.schemaProperty, fieldMap);
            }
            fieldMap.set(field.id, field);
        });
    }

    return fieldMap;
};

const useGetZodValidator = (
    formData: ReturnType<typeof usePydanticFormParser>,
    rhf?: ReturnType<typeof useForm>,
    customValidationRule?: CustomValidationRule,
) => {
    return useMemo(() => {
        if (!formData) {
            return z.object({});
        }
        // Get all fields ids including the nested ones to generate the correct validation schema
        const fieldMap = getFieldMap(formData);
        console.log('fieldMap', fieldMap);
        return z.object(
            [...fieldMap].reduce((validationObject, [fieldId, field]) => {
                const fieldRules =
                    customValidationRule?.(field, rhf) ??
                    clientSideValidationRule(field, rhf);

                return {
                    ...validationObject,
                    [fieldId]: fieldRules,
                };
            }, {}),
        );
    }, [formData, customValidationRule, rhf]);
};

export default useGetZodValidator;
