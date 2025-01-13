/**
 * Dynamic Forms
 *
 * Form footer component
 */
import React, { useCallback, useState } from 'react';

import RenderReactHookFormErrors from '@/components/render/RenderReactHookFormErrors';
import { usePydanticFormContext } from '@/core';
import { navPreventDefaultFn } from '@/utils';

const Footer = () => {
    const {
        resetForm,
        rhf,
        onCancel,
        cancelButton,
        resetButtonAlternative,
        sendLabel,
        footerComponent,
        allowUntouchedSubmit,
    } = usePydanticFormContext();

    const [showErrors, setShowErrors] = useState(false);

    const toggleErrors = useCallback(() => {
        setShowErrors((state) => !state);
        rhf.trigger();
    }, [rhf]);

    const hasErrors = !!Object.keys(rhf.formState.errors).length;

    return (
        <div css={{ height: '200px' }}>
            {(!!footerComponent || (showErrors && hasErrors)) && (
                <div>
                    {footerComponent}

                    {showErrors && <RenderReactHookFormErrors />}
                </div>
            )}
            <div css={{ display: 'flex' }}>
                {resetButtonAlternative ?? (
                    <button
                        type="button"
                        e2e-id="dynamicforms-reset-btn"
                        onClick={(e) => {
                            resetForm(e);
                        }}
                        disabled={!rhf.formState.isDirty}
                        css={{ marginRight: '10px' }}
                    >
                        Reset
                    </button>
                )}

                <span className="spacer"></span>

                <div className={`d-flex align-items-center`}>
                    <div>
                        {rhf.formState.isValid &&
                            !allowUntouchedSubmit &&
                            !rhf.formState.isDirty && (
                                <div
                                    className="d-flex mv-0 mr-3"
                                    style={{ opacity: 0.8 }}
                                >
                                    Het formulier is nog niet aangepast
                                </div>
                            )}
                    </div>

                    {!!onCancel &&
                        (cancelButton ?? (
                            <button
                                type="button"
                                onClick={onCancel}
                                e2e-id="dynamicforms-cancel-btn"
                            >
                                Annuleren
                            </button>
                        ))}

                    <button
                        e2e-id="dynamicforms-send-btn"
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
            </div>{' '}
            {!rhf.formState.isValid && rhf.formState.isDirty && (
                <div className="d-flex mv-0 mr-3" style={{ opacity: 0.8 }}>
                    Het formulier is nog niet correct ingevuld{' '}
                    {!showErrors && (
                        <>
                            -{' '}
                            <a
                                className="ml-1 font-weight-bold"
                                href="#"
                                onClick={navPreventDefaultFn(toggleErrors)}
                            >
                                Toon info
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Footer;
