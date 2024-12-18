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
import { useFormParser } from '@/core/hooks/useFormParser';
import { CustomValidationRuleFn } from '@/types';

const useCustomZodValidation = (
    formData: ReturnType<typeof useFormParser>,
    rhf?: ReturnType<typeof useForm>,
    customValidationRulesFn?: CustomValidationRuleFn,
) => {
    return useMemo(() => {
        if (!formData) {
            return z.object({});
        }

        return z.object(
            formData.fields.reduce((old, field) => {
                const fieldRules =
                    customValidationRulesFn?.(field, rhf) ??
                    clientSideValidationRule(field, rhf);

                return {
                    ...old,
                    [field.id]: fieldRules,
                };
            }, {}),
        );
    }, [formData, customValidationRulesFn, rhf]);
};

export default useCustomZodValidation;
