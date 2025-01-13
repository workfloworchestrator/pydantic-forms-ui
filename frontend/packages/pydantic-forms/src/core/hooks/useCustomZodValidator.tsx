/**
 * Dynamic Forms
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
import { CustomValidationRule } from '@/types';

const useCustomZodValidation = (
    formData: ReturnType<typeof usePydanticFormParser>,
    rhf?: ReturnType<typeof useForm>,
    customValidationRule?: CustomValidationRule,
) => {
    return useMemo(() => {
        if (!formData) {
            return z.object({});
        }

        return z.object(
            formData.fields.reduce((old, field) => {
                const fieldRules =
                    customValidationRule?.(field, rhf) ??
                    clientSideValidationRule(field, rhf);

                return {
                    ...old,
                    [field.id]: fieldRules,
                };
            }, {}),
        );
    }, [formData, customValidationRule, rhf]);
};

export default useCustomZodValidation;
