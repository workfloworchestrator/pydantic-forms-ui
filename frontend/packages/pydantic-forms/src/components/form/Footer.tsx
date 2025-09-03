/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import { usePydanticFormContext } from '@/core';

const Footer = () => {
    const { resetForm, onCancel, onPrevious, hasNext, formInputData } =
        usePydanticFormContext();

    const t = useTranslations('footer');
    const submitButtonLabel = hasNext ? t('send') : t('submit');
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
            <button
                type="button"
                onClick={(e) => {
                    resetForm(e);
                }}
                style={{ padding: '12px' }}
            >
                {t('reset')}
            </button>
        );
    };

    const CancelButton = () => {
        return (
            <button
                type="button"
                onClick={onCancel}
                style={{ padding: '12px' }}
            >
                {t('cancel')}
            </button>
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
                {formInputData && formInputData.length > 0 && (
                    <PreviousButton />
                )}

                <ResetButton />

                {!!onCancel && <CancelButton />}

                <SubmitButton />
            </div>
        </div>
    );
};

export default Footer;
