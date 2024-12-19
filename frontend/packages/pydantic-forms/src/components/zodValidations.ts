/**
 * Dynamic Forms
 *
 * Here we can define some validation presets we can reuse in components.
 * String for example, can have a min & max length and pattern validation rules.
 *
 * With these presets you can use this for both the textfield, as the list text field.
 * Numbers might have a max&min num, etc.
 */
import { z } from 'zod';

import { IDFZodValidationPresets } from '@/types';

// to prevent duplicate code in components that have (almost)the same validation
export const zodValidationPresets: IDFZodValidationPresets = {
    string: (field) => {
        const { maxLength, minLength, pattern } = field?.validation ?? {};

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
                    'De invoer is niet volgens het juiste formaat',
                );
            } catch (error) {
                console.error(
                    'Could not parse validation rule regex',
                    field,
                    pattern,
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
};
