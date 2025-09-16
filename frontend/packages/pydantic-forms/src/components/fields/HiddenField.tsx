import React from 'react';

import { useGetForm } from '@/core';
import { PydanticFormElementProps } from '@/types';

export const HiddenField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { register } = useGetForm();
    return (
        <input
            type="hidden"
            data-testid={pydanticFormField.id}
            {...register(pydanticFormField.id)}
        />
    );
};
