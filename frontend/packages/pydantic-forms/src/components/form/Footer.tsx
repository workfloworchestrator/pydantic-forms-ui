/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React from 'react';

import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('footer');
    const submitButtonLabel = t('submit');

    const SubmitButton = () => (
        <button type="submit" style={{ padding: '12px' }}>
            {submitButtonLabel}
        </button>
    );

    return (
        <div style={{ height: '200px', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <SubmitButton />
            </div>
        </div>
    );
};

export default Footer;
