/**
 * Pydantic Forms
 *
 * Renders errors that are generated client-side
 */
import React from 'react';

// import { getFieldLabelById } from '@/core/helper';

export function RenderValidationErrors() {
    const validationErrorDetails = undefined;

    if (!validationErrorDetails) {
        return <></>;
    }
    /*
    const errors = validationErrorDetails.source;
    const rootError = errors
        .filter((err) => err.loc.includes('__root__'))
        .shift();
    const otherErrors = errors.filter((err) => !err.loc.includes('__root__'));

    return (
        <div>
            {!!rootError && <div>{rootError.msg}</div>}

            {!!otherErrors.length && (
                <ul>
                    {otherErrors.map((error) => (
                        <li key={JSON.stringify(error)}>
                            {error.loc
                                .map((value) =>
                                    getFieldLabelById(
                                        value,
                                        pydanticFormSchema,
                                    ),
                                )
                                .join(', ')}
                            : {error.msg}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
*/
    return <div>TOODO: RenderValidationErrors</div>;
}
