/**
 * Pydantic Forms
 *
 * Header component
 */
import React from 'react';

import { RenderValidationErrors } from '@/components/render/RenderValidationErrors';
import { usePydanticFormContext } from '@/core';

const Header = () => {
    const { pydanticFormSchema, title } = usePydanticFormContext();

    return (
        <>
            <h2 style={{ margin: '1rem 0' }}>
                {title ?? pydanticFormSchema?.title}
            </h2>

            <RenderValidationErrors />
        </>
    );
};

export default Header;
