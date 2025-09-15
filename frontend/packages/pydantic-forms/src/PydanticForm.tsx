/**
 * Pydantic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React from 'react';

import { TranslationsProvider } from '@/messages/translationsProvider';

import { PydanticFormHandler } from './core';
import type { PydanticFormHandlerProps } from './core/PydanticFormHandler';

export const PydanticForm = ({
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormHandlerProps) => {
    console.log(config, formKey, onCancel, onSuccess, title);
    return (
        <TranslationsProvider
            customTranslations={config.customTranslations}
            locale={config.locale}
        >
            <PydanticFormHandler
                config={config}
                onCancel={onCancel}
                onSuccess={onSuccess}
                title={title}
                formKey={formKey}
            />
        </TranslationsProvider>
    );
};

export default PydanticForm;
