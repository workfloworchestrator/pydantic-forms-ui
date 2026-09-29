import { ZodType, z } from 'zod';

import { ComponentMatcher, PydanticFormField } from '../types';

export const getClientSideValidationRule = (
    pydanticFormField: PydanticFormField | undefined,
    matcher: ComponentMatcher,
): ZodType => {
    if (!pydanticFormField) return z.unknown();

    if (typeof pydanticFormField.const !== 'undefined') {
        // A const field has exactly one valid value. The component validator is based on the
        // declared type, which can contradict the const value (eg. `type: string` with `const: null`)
        // and would reject a value the user can't change because const fields are disabled.
        const constRule = z.literal(pydanticFormField.const);
        return pydanticFormField.required ? constRule : constRule.optional();
    }

    const componentMatch = matcher(pydanticFormField);

    let validationRule =
        componentMatch?.validator?.(pydanticFormField) ?? z.unknown();

    if (!pydanticFormField.required) {
        validationRule = validationRule.optional();
    } else {
        validationRule = validationRule.refine((value) => value !== undefined, {
            error: 'Field is required',
        });
    }

    if (pydanticFormField.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};
