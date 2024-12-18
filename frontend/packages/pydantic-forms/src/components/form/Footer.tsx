/**
 * Dynamic Forms
 *
 * Form footer component
 */
import ChevronButton from '~/components/generic/ChevronButton/ChevronButton';
import { navPreventDefaultFn } from '~/utils';

import { useCallback, useState } from 'react';

import { Card, IconWaarschuwing, OutlineButton } from '@lib/rijkshuisstijl';

import RenderReactHookFormErrors from '@/components/render/RenderReactHookFormErrors';
import {
    CsFlags,
    IsCsFlagEnabled,
} from '@/components/utility/ClientSideFF/ClientSideFF';
import { useDynamicFormsContext } from '@/core';

import styles from './Form.module.scss';

const DynamicFormFooter = () => {
    const {
        resetForm,
        rhf,
        onCancel,
        cancelButton,
        resetButtonAlternative,
        sendLabel,
        footerCtaPrimaryVariant,
        footerComponent,
        allowUntouchedSubmit,
    } = useDynamicFormsContext();

    const [showErrors, setShowErrors] = useState(false);

    const toggleErrors = useCallback(() => {
        setShowErrors((state) => !state);
        rhf.trigger();
    }, [rhf]);

    const enableInvalidFormSubmission = IsCsFlagEnabled(
        CsFlags.ALLOW_INVALID_FORMS,
    );

    const hasErrors = !!Object.keys(rhf.formState.errors).length;

    return (
        <div className={`${styles.formFooter} form-footer`}>
            {(!!footerComponent || (showErrors && hasErrors)) && (
                <Card>
                    {footerComponent}

                    {showErrors && <RenderReactHookFormErrors />}
                </Card>
            )}

            <div className="d-flex">
                {resetButtonAlternative ?? (
                    <OutlineButton
                        variant={footerCtaPrimaryVariant}
                        type="button"
                        e2e-id="dynamicforms-reset-btn"
                        onClick={resetForm}
                        disabled={!rhf.formState.isDirty}
                    >
                        Rubriekinhoud herstellen
                    </OutlineButton>
                )}

                <span className="spacer"></span>

                <div
                    className={`${styles.rightSide} d-flex align-items-center`}
                >
                    <div className={styles.formStateNotices}>
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
                                <IconWaarschuwing
                                    style={{ opacity: 0.4 }}
                                    className="mr-2"
                                    size={18}
                                />{' '}
                                Het formulier is nog niet correct ingevuld{' '}
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
                            <OutlineButton
                                variant={footerCtaPrimaryVariant}
                                type="button"
                                onClick={onCancel}
                                e2e-id="dynamicforms-cancel-btn"
                            >
                                Annuleren
                            </OutlineButton>
                        ))}

                    <ChevronButton
                        variant={
                            !rhf.formState.isValid &&
                            enableInvalidFormSubmission
                                ? 'red'
                                : footerCtaPrimaryVariant
                        }
                        e2e-id="dynamicforms-send-btn"
                        type="submit"
                        onClick={() => ''}
                        disabled={
                            !enableInvalidFormSubmission &&
                            (!rhf.formState.isValid ||
                                (!allowUntouchedSubmit &&
                                    !rhf.formState.isDirty &&
                                    !rhf.formState.isSubmitting))
                        }
                    >
                        {sendLabel ?? 'Verzenden'}
                    </ChevronButton>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormFooter;
