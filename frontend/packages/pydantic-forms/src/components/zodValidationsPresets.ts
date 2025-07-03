/**
 * Pydantic Forms
 *
 * Here we can define some validation presets we can reuse in components.
 * String for example, can have a min & max length and pattern validation rules.
 *
 * With these presets you can use this for both the textfield, as the list text field.
 * Numbers might have a max&min num, etc.
 */
import { z } from 'zod/v4';

import { PydanticFormZodValidationPresets } from '@/types';

// to prevent duplicate code in components that have (almost)the same validation
export const zodValidationPresets: PydanticFormZodValidationPresets = {
    string: (field) => {
        const { maxLength, minLength, pattern } = field?.validations ?? {};

        let validationRule = z.string().trim();
        if (minLength) {
            validationRule = validationRule?.min(
                minLength,
                minLength === 1
                    ? 'Moet ingevuld zijn'
                    : `Dit veld heeft een minimum lengte van ${minLength} karakters`,
            );
        }

        if (maxLength) {
            validationRule = validationRule?.max(
                maxLength,
                `Dit veld heeft een maximum lengte van ${maxLength} karakters`,
            );
        }

        if (pattern) {
            try {
                validationRule = validationRule?.regex(
                    new RegExp(pattern),
                    `De invoer is niet volgens het juiste formaat: ${pattern}`,
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
            validationRule = validationRule.gte(
                minimum,
                `Dit veld heeft een minimum waarde van ${minimum}`,
            );
        }

        if (exclusiveMinimum) {
            validationRule = validationRule.gt(
                exclusiveMinimum,
                `Dit veld heeft een minimum waarde van meer dan ${exclusiveMinimum}`,
            );
        }

        if (maximum) {
            validationRule = validationRule.lte(
                maximum,
                `Dit veld heeft een maximum waarde van${maximum}`,
            );
        }

        if (exclusiveMaximum) {
            validationRule = validationRule.lt(
                exclusiveMaximum,
                `Dit veld heeft een maximum waarde van minder dan ${exclusiveMaximum}`,
            );
        }

        if (multipleOf) {
            validationRule = validationRule.multipleOf(
                multipleOf,
                `De waarde van dit veld moet een veelvoud zijn van ${multipleOf}`,
            );
        }

        return validationRule;
    },
    multiSelect: (field) => {
        const { minimum, maximum } = field?.validations ?? {};

        let validationRule = z.array(z.boolean());

        if (minimum) {
            validationRule = validationRule.min(
                minimum,
                `Dit veld heeft een minimum waarde van ${minimum}`,
            );
        }

        if (maximum) {
            validationRule = validationRule.max(
                maximum,
                `Dit veld heeft een maximum waarde van ${maximum}`,
            );
        }

        return validationRule;
    },
};
