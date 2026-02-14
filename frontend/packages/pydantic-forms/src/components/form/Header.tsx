/**
 * Pydantic Forms
 *
 * Header component
 */
import React from 'react';

import { PydanticFormHeaderProps } from '../../types';
import { RenderValidationErrors } from '../render/RenderValidationErrors';

const Header = ({ title, pydanticFormSchema }: PydanticFormHeaderProps) => {
    return (
        <>
            <h2 style={{ margin: '1rem 0' }}>
                {title ?? pydanticFormSchema?.title}
            </h2>

            <RenderValidationErrors pydanticFormSchema={pydanticFormSchema} />
        </>
    );
};

export default Header;
