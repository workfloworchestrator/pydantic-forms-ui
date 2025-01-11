/**
 * Dynamic Forms
 *
 * Form footer component
 */
import React, { useCallback, useState } from 'react';

import RenderReactHookFormErrors from '@/components/render/RenderReactHookFormErrors';
import { usePydanticFormContext } from '@/core';
import { navPreventDefaultFn } from '@/utils';

const DynamicFormFooter = () => {
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
        <div className={`form-footer`}>
            {(!!footerComponent || (showErrors && hasErrors)) && (
                <div>
                    {footerComponent}

                    {showErrors && <RenderReactHookFormErrors />}
                </div>
            )}

            <div className="d-flex">
                {resetButtonAlternative ?? (
                    <button
                        type="button"
                        e2e-id="dynamicforms-reset-btn"
                        onClick={() => resetForm}
                        disabled={!rhf.formState.isDirty}
                    >
                        Reset
                    </button>
                )}

                <span className="spacer"></span>

                <div className={`d-flex align-items-center`}>
                    <div
                        className={
                            "width: 100% margin: '10px 0' order: '3 !important' text-align: center"
                        }
                    >
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

                        {!rhf.formState.isValid && rhf.formState.isDirty && (
                            <div
                                className="d-flex mv-0 mr-3"
                                style={{ opacity: 0.8 }}
                            >
                                WARNING ICON Het formulier is nog niet correct
                                ingevuld{' '}
                                {!showErrors && (
                                    <>
                                        -{' '}
                                        <a
                                            className="ml-1 font-weight-bold"
                                            href="#"
                                            onClick={navPreventDefaultFn(
                                                toggleErrors,
                                            )}
                                        >
                                            Toon info
                                        </a>
                                    </>
                                )}
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
            </div>
        </div>
    );
};

export default DynamicFormFooter;
