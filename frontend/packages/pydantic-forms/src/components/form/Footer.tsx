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
        reactHookForm,
        onCancel,
        onPrevious,
        cancelButton,
        resetButtonAlternative,
        sendLabel,
        allowUntouchedSubmit,
        hasNext,
        formInputData,
    } = usePydanticFormContext();

    const t = useTranslations('footer');
    const submitButtonLabel = sendLabel ?? hasNext ? t('send') : t('submit');
    const PreviousButton = () => (
        <button
            type="button"
            onClick={() => onPrevious?.()}
            style={{ padding: '12px' }}
        >
            {t('previous')}
        </button>
    );

    const ResetButton = () => {
        return (
            resetButtonAlternative ?? (
                <button
                    type="button"
                    onClick={(e) => {
                        resetForm(e);
                    }}
                    style={{ padding: '12px' }}
                >
                    {t('reset')}
                </button>
            )
        );
    };

    const CancelButton = () => {
        return (
            cancelButton ?? (
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '12px' }}
                >
                    {t('cancel')}
                </button>
            )
        );
    };

    const SubmitButton = () => (
        <button type="submit" style={{ padding: '12px' }}>
            {submitButtonLabel}
        </button>
    );

    return (
        <div style={{ height: '200px', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                {reactHookForm.formState.isValid &&
                    !allowUntouchedSubmit &&
                    !reactHookForm.formState.isDirty && (
                        <div>Het formulier is nog niet aangepast</div>
                    )}
                {formInputData && formInputData.length > 0 && (
                    <PreviousButton />
                )}

                <ResetButton />

                {!!onCancel && <CancelButton />}

                <SubmitButton />
            </div>
            <div
                style={{
                    margin: '8px 0',
                    color: 'red',
                    fontWeight: '600',
                    fontSize: '24px',
                }}
            >
                {!reactHookForm.formState.isValid &&
                    reactHookForm.formState.isDirty && (
                        <div>{t('notFilledYet')}</div>
                    )}
            </div>
        </div>
    );
};

export default Footer;
