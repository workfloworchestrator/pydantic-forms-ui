import { useCallback, useMemo } from 'react';

import { useLabelProvider } from '@/core/hooks/useLabelProvider';
import type {
    PydanticFormContextProps,
    PydanticFormField,
    PydanticFormPropertySchema,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

import { mapFieldToComponent } from '../mapFieldToComponent';

/**
 * Maps schema properties to usable fields
 * - Adds translations to fields
 * - Organizes the fields types and their options
 * - Marks required fields in their definition
 *
 * Note: We pass in these values instead of using the usePydanticFormContext hook to be able
 * to call this hook from within the contextProvider where the context is not yet available
 *
 * @param schema
 * @returns
 */
export const useFieldMapper = (
    schema: PydanticFormSchema | PydanticFormPropertySchema,
    config: PydanticFormsContextConfig,
    formKey: PydanticFormContextProps['formKey'],
    formIdKey: PydanticFormContextProps['formIdKey'],
): PydanticFormField[] => {
    const { data: formLabels } = useLabelProvider(
        config?.labelProvider,
        formKey,
        formIdKey,
    );

    const mapper = useCallback(
        (fieldId: string) => {
            const fieldProperties = schema.properties?.[fieldId];
            if (fieldProperties) {
                return mapFieldToComponent(
                    fieldId,
                    fieldProperties,
                    formLabels,
                    schema.required || [],
                    config?.fieldDetailProvider,
                    config?.componentMatcher,
                );
            }
        },
        [
            config?.componentMatcher,
            config?.fieldDetailProvider,
            formLabels,
            schema.properties,
            schema.required,
        ],
    );

    const fields = useMemo(() => {
        const fieldIds = Object.keys(schema.properties ?? {});
        return fieldIds
            .map((fieldId) => mapper(fieldId))
            .filter((field) => field !== undefined)
            .map((field) => ({
                ...field,
                columns:
                    config?.layoutColumnProvider?.(field?.id) ?? field?.columns,
            }));
    }, [config, mapper, schema.properties]);

    return fields;
};
