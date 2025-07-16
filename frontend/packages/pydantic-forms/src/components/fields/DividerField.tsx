import React from 'react';

import type { PydanticFormElementProps } from '@/types';

export const DividerField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    return <hr data-testid={pydanticFormField.id} />;
};
