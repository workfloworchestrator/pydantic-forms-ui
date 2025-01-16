/**
 * Pydantic Forms
 *
 * Client side validation rules
 *
 * ZOD: https://zod.dev/
 * ZOD react-hook-form: https://github.com/react-hook-form/resolvers?tab=readme-ov-file#zod
 */
import { useForm } from 'react-hook-form';

import { z } from 'zod';

import { PydanticFormField } from '@/types';

const clientSideValidationRule = (
    field: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => {
    let validationRule = field?.validator?.(field, rhf) ?? z.string();

    if (!field.required) {
        validationRule = validationRule.optional();
    }

    if (field.validation.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};

export default clientSideValidationRule;
