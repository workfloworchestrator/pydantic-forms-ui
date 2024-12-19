/**
 * Dynamic Forms
 *
 * A hook that will parse the received and parsed JSON Schema
 * to something more usable in the templates
 *
 * - Adds translations to fields
 * - Organizes the fields types and their options
 * - Marks required fields in their definition
 */
import { useMemo } from 'react';

import { mapToUsableField } from '@/core';
import { getFieldBySection } from '@/core/helper';
import {
    DfLayoutColumnProvider,
    IDynamicForm,
    IDynamicFormApiRefResolved,
    IDynamicFormState,
    IDynamicFormsLabels,
    IFieldDefinitionProvider,
} from '@/types';

export function useFormParser(
    schema?: IDynamicFormApiRefResolved,
    formLabels?: IDynamicFormsLabels,
    fieldDetailProvider?: IFieldDefinitionProvider,
    layoutColumnProvider?: DfLayoutColumnProvider,
): IDynamicForm | false {
    return useMemo(() => {
        if (!schema || !formLabels) return false;

        const fieldIds = Object.keys(schema?.properties ?? {});

        const fields = fieldIds
            .map((fieldId) =>
                mapToUsableField(
                    fieldId,
                    schema,
                    formLabels,
                    fieldDetailProvider,
                ),
            )
            .map((field) => ({
                ...field,
                columns: layoutColumnProvider?.(field.id) ?? field.columns,
            }));

        return {
            title: schema.title,
            description: schema.description,
            state: IDynamicFormState.NEW,
            fields,
            sections: getFieldBySection(fields),
        };
    }, [schema, formLabels, layoutColumnProvider, fieldDetailProvider]);
}
