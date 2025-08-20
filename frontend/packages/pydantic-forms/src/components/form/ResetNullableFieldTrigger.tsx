import React, { useCallback } from 'react';

import { usePydanticFormContext } from '@/core';
import { isNullableField } from '@/core/helper';
import { PydanticFormField } from '@/types';
import { preventDefault } from '@/utils';

const ResetNullableFieldTrigger = ({ field }: { field: PydanticFormField }) => {
    const { reactHookForm } = usePydanticFormContext();

    const setNullValue = useCallback(() => {
        reactHookForm.setValue(field.id, null);
        reactHookForm.trigger(field.id);
    }, [reactHookForm, field]);

    if (
        !isNullableField(field) ||
        reactHookForm.getValues()?.[field.id] === null
    ) {
        return null;
    }

    return (
        <a
            href="#reset"
            className="ml-2"
            style={{ fontSize: '14px' }}
            onClick={preventDefault(setNullValue)}
        >
            Reset
        </a>
    );
};

export default ResetNullableFieldTrigger;
