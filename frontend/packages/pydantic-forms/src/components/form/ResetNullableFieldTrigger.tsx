import React, { useCallback } from 'react';

import { usePydanticFormContext } from '@/core';
import { isNullableField } from '@/core/helper';
import { PydanticFormField } from '@/types';
import { navPreventDefaultFn } from '@/utils';

const ResetNullableFieldTrigger = ({ field }: { field: PydanticFormField }) => {
    const { rhf } = usePydanticFormContext();

    const setNullValue = useCallback(() => {
        rhf.setValue(field.id, null);
        rhf.trigger(field.id);
    }, [rhf, field]);

    if (!isNullableField(field) || rhf.getValues()?.[field.id] === null) {
        return null;
    }

    return (
        <a
            href="#reset"
            className="ml-2"
            style={{ fontSize: '14px' }}
            onClick={navPreventDefaultFn(setNullValue)}
        >
            Reset
        </a>
    );
};

export default ResetNullableFieldTrigger;
