import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PydanticFormElementProps } from '@/types';

export const HiddenField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { register } = useFormContext();
    return (
        <input
            type="hidden"
            data-testid={pydanticFormField.id}
            {...register(pydanticFormField.id)}
        />
    );
};
