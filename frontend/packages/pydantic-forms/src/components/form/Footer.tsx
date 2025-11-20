/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import { PydanticFormFooterProps } from '@/types';

const Footer = ({
    onCancel,
    onPrevious,
    hasNext,
    hasPrevious,
    buttons,
}: PydanticFormFooterProps) => {
    const t = useTranslations('footer');
    const submitButtonLabel = hasNext ? t('send') : t('submit');
    const { next, previous } = buttons || {};

    const PreviousButton = () => (
        <button
            type="button"
            onClick={() => onPrevious?.()}
            style={{
                padding: '12px',
                backgroundColor: previous?.color,
            }}
        >
            {previous?.text ?? t('previous')}
        </button>
    );

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
        <button
            type="submit"
            style={{ padding: '12px', backgroundColor: next?.color }}
        >
            {next?.text ?? submitButtonLabel}
        </button>
    );

    return (
        <div style={{ height: '200px', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                {hasPrevious && <PreviousButton />}

                {!!onCancel && <CancelButton />}

                <SubmitButton />
            </div>
        </div>
    );
};

export default Footer;
