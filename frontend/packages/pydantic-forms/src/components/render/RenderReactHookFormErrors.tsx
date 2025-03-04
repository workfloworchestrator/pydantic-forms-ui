/**
 * Pydantic Forms
 *
 * Renders errors received from the backend after submitting the form
 */
import React, { useCallback, useState } from 'react';

import { usePydanticFormContext } from '@/core';
import { getFieldLabelById } from '@/core/helper';

export default function RenderReactHookFormErrors() {
    const { rhf } = usePydanticFormContext();
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = useCallback(() => {
        setShowDetails((state) => !state);
    }, []);

    if (rhf.formState.isValid) {
        return <></>;
    }

    const numErrors = Object.keys(rhf.formState.errors).length;
    const multiMistakes = numErrors > 1;

    return (
        <div
        // Help Text Container
        //  variant={HelpContainerVariant.ERROR}
        //  title="Het formulier bevat tenminste één niet correct ingevulde rubriek, waardoor het niet opgeslagen kan worden."
        >
            {!!Object.keys(rhf.formState.errors).length && (
                <>
                    <div className="d-flex align-items-center">
                        Er {multiMistakes ? 'zijn' : 'is'} {numErrors} rubriek
                        {multiMistakes && 'en'} nog niet correct ingevuld.
                        <button
                            onClick={toggleDetails}
                            className="ml-2"
                            // IconButton
                        >
                            ICON INFO Size 18
                        </button>
                    </div>
                    {showDetails && (
                        <ul className="error-list mb-2">
                            {Object.keys(rhf.formState.errors).map(
                                (fieldKey) => {
                                    const field =
                                        rhf.formState?.errors[fieldKey];

                                    const fieldName =
                                        'TO: Get field name by id function';
                                    return (
                                        <li key={fieldKey}>
                                            <strong className="mr-2">
                                                {fieldName}:{' '}
                                            </strong>
                                            {(field?.message as string) ?? ''}
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
