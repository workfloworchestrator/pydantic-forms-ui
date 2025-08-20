import React from 'react';

import { usePydanticFormContext } from '@/core';
import { PydanticFormElementProps } from '@/types';

export const HiddenField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { reactHookForm } = usePydanticFormContext();
    return (
        <input
            type="hidden"
            data-testid={pydanticFormField.id}
            {...reactHookForm.register(pydanticFormField.id)}
        />
    );
};
