import { ZodType, z } from 'zod';

import { PydanticFormConfig, PydanticFormField } from '../types';
import { getMatcher } from './getMatcher';

export const getClientSideValidationRule = (
    pydanticFormField: PydanticFormField | undefined,
    componentMatcherExtender?: PydanticFormConfig['componentMatcherExtender'],
): ZodType => {
    if (!pydanticFormField) return z.unknown();
    const matcher = getMatcher(componentMatcherExtender);

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
