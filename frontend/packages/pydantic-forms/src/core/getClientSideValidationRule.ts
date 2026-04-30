import { ZodType, z } from 'zod';

import { ComponentMatcher, PydanticFormField } from '../types';

export const getClientSideValidationRule = (
    pydanticFormField: PydanticFormField | undefined,
    matcher: ComponentMatcher,
): ZodType => {
    if (!pydanticFormField) return z.unknown();

    const componentMatch = matcher(pydanticFormField);

    let validationRule =
        componentMatch?.validator?.(pydanticFormField) ?? z.unknown();

    if (!pydanticFormField.required) {
        validationRule = validationRule.optional();
    }

    if (pydanticFormField.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};
