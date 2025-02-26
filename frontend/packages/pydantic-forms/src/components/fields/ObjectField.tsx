import React from 'react';

import { usePydanticFormContext } from '@/core';
import { useFieldMapper } from '@/core/hooks/useFieldMapper';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { formKey, formIdKey, config } = usePydanticFormContext();
    const fields = useFieldMapper(
        pydanticFormField.schemaProperty,
        formKey,
        formIdKey,
        config,
    );
    const subFields = fields.map((field) => ({
        ...field,
        id: `${pydanticFormField.id}.${field.id}`,
    }));

    return (
        <div>
            <h1>{pydanticFormField.title}</h1>
            <RenderFields fields={subFields} />
        </div>
    );
};
