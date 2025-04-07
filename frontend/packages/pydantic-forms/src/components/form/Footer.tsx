/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

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

    const t = useTranslations('footer');

    return (
        <div style={{ height: '200px' }}>
            {footerComponent && <div>{footerComponent}</div>}{' '}
            <div>
                {rhf.formState.isValid &&
                    !allowUntouchedSubmit &&
                    !rhf.formState.isDirty && (
                        <div>Het formulier is nog niet aangepast</div>
                    )}

                <button
                    type="button"
                    onClick={() => onPrevious?.()}
                    style={{ padding: '4px' }}
                >
                    Back
                </button>
                {resetButtonAlternative ?? (
                    <button
                        type="button"
                        onClick={(e) => {
                            resetForm(e);
                        }}
                        style={{ padding: '4px' }}
                    >
                        {t('reset')}
                    </button>
                )}
                {!!onCancel &&
                    (cancelButton ?? (
                        <button type="button" onClick={onCancel}>
                            {t('cancel')}
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
                    {sendLabel ?? t('send')}
                </button>
            </div>
            {!rhf.formState.isValid && rhf.formState.isDirty && (
                <div>{t('notFilledYet')}</div>
            )}
        </div>
    );
};

export default Footer;
