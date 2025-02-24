/**
 * Pydantic Forms
 *
 * A hook that will parse the received and parsed JSON Schema
 * to something more usable in the templates
 *
 * - Adds translations to fields
 * - Organizes the fields types and their options
 * - Marks required fields in their definition
 */
import { useMemo } from 'react';

import type {
    PydanticFormData,
    PydanticFormFieldDetailProvider,
    PydanticFormLabels,
    PydanticFormLayoutColumnProvider,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    PydanticFormState,
} from '@/types';

import { mapFieldToComponent } from '../mapFieldToComponent';

const emptySchema: PydanticFormSchema = {
    title: '',
    description: '',
    additionalProperties: false,
    type: PydanticFormFieldType.OBJECT,
    properties: {
        property: {
            type: PydanticFormFieldType.STRING,
            title: '',
            format: PydanticFormFieldFormat.DEFAULT,
        },
    },
};

export function usePydanticFormParser(
    schema: PydanticFormSchema = emptySchema,
    formLabels?: PydanticFormLabels,
    fieldDetailProvider?: PydanticFormFieldDetailProvider,
    layoutColumnProvider?: PydanticFormLayoutColumnProvider,
    componentMatcher?: PydanticFormsContextConfig['componentMatcher'],
): PydanticFormData | false {
    return useMemo(() => {
        if (!schema) return false;

        const mapper = (fieldId: string) => {
            return mapFieldToComponent(
                fieldId,
                schema,
                formLabels,
                fieldDetailProvider,
                componentMatcher,
            );
        };

        const fieldIds = Object.keys(schema.properties ?? {});

        const fields = fieldIds
            .map((fieldId) => mapper(fieldId))
            .map((field) => ({
                ...field,
                columns: layoutColumnProvider?.(field.id) ?? field.columns,
            }));

        return {
            title: schema.title,
            description: schema.description,
            state: PydanticFormState.NEW,
            fields,
        };
    }, [
        schema,
        formLabels,
        fieldDetailProvider,
        componentMatcher,
        layoutColumnProvider,
    ]);
}
