/**
 * Pydantic Forms
 *
 * Renders errors that are generated client-side
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';

export default function RenderFormErrors() {
    const { errorDetails, formData } = usePydanticFormContext();

    if (!errorDetails) {
        return <></>;
    }

    const errors = errorDetails.source;
    const rootError = errors
        .filter((err) => err.loc.includes('__root__'))
        .shift();
    const otherErrors = errors.filter((err) => !err.loc.includes('__root__'));

    const getFieldLabel = (fieldId: string) => {
        const field = formData?.fields
            .filter((field) => field.id === fieldId)
            .shift();

        if (!field) {
            return fieldId;
        }

        return field.title;
    };

    return (
        <div>
            {!!rootError && <div>{rootError.msg}</div>}

            {!!otherErrors.length && (
                <ul>
                    {otherErrors.map((error) => (
                        <li key={JSON.stringify(error)}>
                            {error.loc.map(getFieldLabel).join(', ')}:{' '}
                            {error.msg}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
