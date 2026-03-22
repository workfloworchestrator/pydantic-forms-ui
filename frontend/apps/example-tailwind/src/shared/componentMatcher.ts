import _ from 'lodash';
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets,
} from 'pydantic-forms';
import type { PydanticComponentMatcher } from 'pydantic-forms';

import { CheckboxField } from '@/components/fields/tailwind/CheckboxField';
import { DateField } from '@/components/fields/tailwind/DateField';
import { DateTimeField } from '@/components/fields/tailwind/DateTimeField';
import { DropdownField } from '@/components/fields/tailwind/DropdownField';
import { IntegerField } from '@/components/fields/tailwind/IntegerField';
import { RadioField } from '@/components/fields/tailwind/RadioField';
import { TextAreaField } from '@/components/fields/tailwind/TextAreaField';
import { TextField } from '@/components/fields/tailwind/TextField';

/**
 * Shared component matcher configuration for all examples.
 * This maps form field types to custom Tailwind components.
 */
export const createComponentMatcher = (
    currentMatchers: PydanticComponentMatcher[],
): PydanticComponentMatcher[] => {
    return [
        {
            id: 'date',
            ElementMatch: {
                Element: DateField,
                isControlledElement: true,
            },
            matcher(field) {
                return (
                    field.type === PydanticFormFieldType.STRING &&
                    field.format === PydanticFormFieldFormat.DATE
                );
            },
        },
        {
            id: 'datetime',
            ElementMatch: {
                Element: DateTimeField,
                isControlledElement: true,
            },
            matcher(field) {
                return (
                    field.type === PydanticFormFieldType.STRING &&
                    field.format === PydanticFormFieldFormat.DATETIME
                );
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
            id: 'radio',
            ElementMatch: {
                Element: RadioField,
                isControlledElement: true,
            },
            matcher(field) {
                return (
                    field.type === PydanticFormFieldType.STRING &&
                    _.isArray(field.options) &&
                    field.options?.length > 0 &&
                    field.options?.length <= 3
                );
            },
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
            id: 'checkbox',
            ElementMatch: {
                Element: CheckboxField,
                isControlledElement: true,
            },
            matcher(field) {
                return field.type === PydanticFormFieldType.BOOLEAN;
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
