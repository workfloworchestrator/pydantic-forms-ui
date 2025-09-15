/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

interface PydanticFormFooterProps {
    hasNext: boolean;
    hasPrevious: boolean;

    onCancel?: (e?: React.BaseSyntheticEvent) => void;
    onPrevious?: () => void;
}

const Footer = ({
    onCancel,
    onPrevious,
    hasNext,
    hasPrevious,
}: PydanticFormFooterProps) => {
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
                {hasPrevious && <PreviousButton />}

                {!!onCancel && <CancelButton />}

                <SubmitButton />
            </div>
        </div>
    );
};

export default Footer;
