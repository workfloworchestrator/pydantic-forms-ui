/**
 * Pydantic Forms
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
                        e2e-id="pydanticforms-reset-btn"
                        onClick={(e) => {
                            resetForm(e);
                        }}
                        disabled={!rhf.formState.isDirty}
                        css={{ padding: '4px' }}
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
                                e2e-id="pydanticforms-cancel-btn"
                                style={{
                                    marginLeft: '8px',
                                    height: '28px',
                                    padding: '4px',
                                }}
                            >
                                Annuleren
                            </button>
                        ))}

                    <button
                        e2e-id="pydanticforms-send-btn"
                        type="submit"
                        style={{
                            marginLeft: '8px',
                            height: '28px',
                            padding: '4px',
                        }}
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
