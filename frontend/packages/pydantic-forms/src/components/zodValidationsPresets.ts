/**
 * Pydantic Forms
 *
 * Here we can define some validation presets we can reuse in components.
 * String for example, can have a min & max length and pattern validation rules.
 *
 * With these presets you can use this for both the textfield, as the list text field.
 * Numbers might have a max&min num, etc.
 */
import { z } from 'zod';

import { PydanticFormZodValidationPresets } from '../types';

// to prevent duplicate code in components that have (almost)the same validation
export const zodValidationPresets: PydanticFormZodValidationPresets = {
    string: (field) => {
        const { maxLength, minLength, pattern } = field?.validations ?? {};

        let validationRule = z.string().trim();
        if (minLength) {
            validationRule = validationRule?.min(minLength, {
                error: `Too small: expected string to have >= ${minLength} characters`,
            });
        }

        if (maxLength) {
            validationRule = validationRule?.max(maxLength, {
                error: `Too big: expected string to have <= ${maxLength} characters`,
            });
        }

        if (pattern) {
            try {
                validationRule = validationRule?.regex(
                    new RegExp(pattern),
                    `Invalid pattern: ${pattern}`,
                );
            } catch (error) {
                console.error(
                    'Could not parse validation rule regex',
                    field,
                    pattern,
                    error,
                );
            }
        }

        if (!field.required) {
            validationRule = validationRule.or(
                z.literal(''),
            ) as unknown as z.ZodString;
        }

        return validationRule;
    },
    integer: (field) => {
        const {
            minimum,
            maximum,
            exclusiveMaximum,
            exclusiveMinimum,
            multipleOf,
        } = field?.validations ?? {};

        let validationRule = z.number().int();

        if (minimum) {
            validationRule = validationRule.gte(minimum, {
                error: `Too small: expected number to be >= ${minimum}`,
            });
        }

        if (exclusiveMinimum) {
            validationRule = validationRule.gt(exclusiveMinimum, {
                error: `Too small: expected number to be > ${exclusiveMinimum}`,
            });
        }

        if (maximum) {
            validationRule = validationRule.lte(maximum, {
                error: `Too big: expected number to be <= ${maximum}`,
            });
        }

        if (exclusiveMaximum) {
            validationRule = validationRule.lt(exclusiveMaximum, {
                error: `Too big: expected number to be < ${exclusiveMaximum}`,
            });
        }

        if (multipleOf) {
            validationRule = validationRule.multipleOf(multipleOf, {
                error: `Invalid number: must be a multiple of ${multipleOf}`,
            });
        }

        return validationRule;
    },
    multiSelect: (field) => {
        const { minimum, maximum } = field?.validations ?? {};

        let validationRule = z.array(z.boolean());

        if (minimum) {
            validationRule = validationRule.min(minimum);
        }

        if (maximum) {
            validationRule = validationRule.max(maximum);
        }

        return validationRule;
    },
};
