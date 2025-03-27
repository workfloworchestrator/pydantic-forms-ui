/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';
import {useTranslations} from "next-intl";

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

    const t = useTranslations('footer');

    return (
        <div style={{ height: '200px' }}>
            {footerComponent && <div>{footerComponent}</div>}{' '}
            <div>
                {resetButtonAlternative ?? (
                    <button
                        type="button"
                        onClick={(e) => {
                            resetForm(e);
                        }}
                        disabled={!rhf.formState.isDirty}
                        style={{ padding: '4px' }}
                    >
                        {t('reset')}
                    </button>
                )}

                {rhf.formState.isValid &&
                    !allowUntouchedSubmit &&
                    !rhf.formState.isDirty && (
                        <div>{t('notModifiedYet')}</div>
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
