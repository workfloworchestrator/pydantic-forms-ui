/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';

const Footer = () => {
    const {
        resetForm,
        rhf,
        onCancel,
        onPrevious,
        cancelButton,
        resetButtonAlternative,
        sendLabel,
        footerComponent,
        allowUntouchedSubmit,
    } = usePydanticFormContext();

    return (
        <div style={{ height: '200px' }}>
            {footerComponent && <div>{footerComponent}</div>}{' '}
            <div>
                {rhf.formState.isValid &&
                    !allowUntouchedSubmit &&
                    !rhf.formState.isDirty && (
                        <div>Het formulier is nog niet aangepast</div>
                    )}

                <button type="button" onClick={() => onPrevious?.()} style={{ padding: '4px' }}>
                    Back
                </button>
                {resetButtonAlternative ?? (
                    <button
                        type="button"
                        onClick={(e) => {
                            resetForm(e);
                        }}
                        disabled={!rhf.formState.isDirty}
                        style={{ padding: '4px' }}
                    >
                        Reset
                    </button>
                )}

                {!!onCancel &&
                    (cancelButton ?? (
                        <button type="button" onClick={onCancel}>
                            Annuleren
                        </button>
                    ))}

                <button
                    type="submit"
                    disabled={
                        !rhf.formState.isValid ||
                        (!allowUntouchedSubmit &&
                            !rhf.formState.isDirty &&
                            !rhf.formState.isSubmitting)
                    }
                >
                    {sendLabel ?? 'Verzenden'}
                </button>
            </div>
            {!rhf.formState.isValid && rhf.formState.isDirty && (
                <div>Het formulier is nog niet correct ingevuld</div>
            )}
        </div>
    );
};

export default Footer;
