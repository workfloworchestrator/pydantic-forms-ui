import React from 'react';

import { usePydanticFormContext } from '@/core';
import { PydanticFormElementProps } from '@/types';

export const HiddenField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { rhf } = usePydanticFormContext();
    return <input type="hidden" {...rhf.register(pydanticFormField.id)} />;
};
