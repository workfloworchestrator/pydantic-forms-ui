/**
 * Pydantic Forms
 *
 * Header component
 */
import React from 'react';

import RenderFormErrors from '@/components/render/RenderFormErrors';
import { usePydanticFormContext } from '@/core';

const Header = () => {
    const { pydanticFormSchema, title } = usePydanticFormContext();

    return (
        <>
            <h2 style={{ margin: '1rem 0' }}>
                {title ?? pydanticFormSchema?.title}
            </h2>

            <RenderFormErrors />
        </>
    );
};

export default Header;
