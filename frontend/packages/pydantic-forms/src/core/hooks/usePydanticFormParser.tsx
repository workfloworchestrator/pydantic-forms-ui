/**
 * Pydantic Forms
 *
 * A hook that will parse the received and parsed JSON Schema
 * to something more usable in the templates
 *
 */
import type {
    PydanticFormContextProps,
    PydanticFormData,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    PydanticFormState,
} from '@/types';

import { useFieldMapper } from './useFieldMapper';

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
    config: PydanticFormsContextConfig,
    formKey: PydanticFormContextProps['formKey'],
    formIdKey: PydanticFormContextProps['formIdKey'],
): PydanticFormData | false {
    const fields = useFieldMapper(schema, config, formKey, formIdKey);

    return {
        title: schema.title,
        description: schema.description,
        state: PydanticFormState.NEW,
        fields,
    };
}
