import _ from 'lodash';
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets,
} from 'pydantic-forms';
import type { PydanticComponentMatcher } from 'pydantic-forms';

import { DividerField } from '@/components/fields/shadcn/DividerField';
import { DropdownField } from '@/components/fields/shadcn/DropdownField';
import { IntegerField } from '@/components/fields/shadcn/IntegerField';
import { LabelField } from '@/components/fields/shadcn/LabelField';
import { TextAreaField } from '@/components/fields/shadcn/TextAreaField';
import { TextField } from '@/components/fields/shadcn/TextField';

/**
 * Shared component matcher configuration for ShadCN examples.
 * This maps form field types to custom ShadCN components.
 */
export const createComponentMatcherShadcn = (
    currentMatchers: PydanticComponentMatcher[],
): PydanticComponentMatcher[] => {
    return [
        {
            id: 'divider',
            ElementMatch: {
                Element: DividerField,
                isControlledElement: false,
            },
            matcher(field) {
                return field.format === PydanticFormFieldFormat.DIVIDER;
            },
        },
        {
            id: 'label',
            ElementMatch: {
                Element: LabelField,
                isControlledElement: false,
            },
            matcher(field) {
                return field.format === PydanticFormFieldFormat.LABEL;
            },
        },
        {
            id: 'textarea',
            ElementMatch: {
                Element: TextAreaField,
                isControlledElement: true,
            },
            matcher(field) {
                return (
                    field.type === PydanticFormFieldType.STRING &&
                    field.format === PydanticFormFieldFormat.LONG
                );
            },
            validator: zodValidationPresets.string,
        },
        {
            id: 'integer',
            ElementMatch: {
                Element: IntegerField,
                isControlledElement: true,
            },
            matcher(field) {
                return field.type === PydanticFormFieldType.INTEGER;
            },
            validator: zodValidationPresets.integer,
        },
        {
            id: 'select',
            ElementMatch: {
                Element: DropdownField,
                isControlledElement: true,
            },
            matcher(field) {
                return (
                    // @ts-expect-error options can exist depending on backend schema
                    field.options?.length > 0 &&
                    field.type === PydanticFormFieldType.STRING
                );
            },
        },
        {
            id: 'string',
            ElementMatch: { Element: TextField, isControlledElement: true },
            matcher(field) {
                return field.type === PydanticFormFieldType.STRING;
            },
            validator: zodValidationPresets.string,
        },
        ...currentMatchers,
    ];
};
