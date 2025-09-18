/**
 * Pydantic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React, { createContext } from 'react';

import { z } from 'zod/v4';

import { TranslationsProvider } from '@/messages/translationsProvider';
import {
    Locale,
    PydanticFormConfig,
    PydanticFormProps,
    PydanticFormValidationErrorDetails,
} from '@/types';

import { PydanticFormHandler } from './core';
import { PydanticFormFieldDataStorageProvider } from './core/PydanticFieldDataStorageProvider';

export const PydanticFormConfigContext =
    createContext<PydanticFormConfig | null>(null);

export const PydanticFormValidationErrorContext =
    createContext<PydanticFormValidationErrorDetails | null>(null);

export const PydanticForm = ({
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormProps) => {
    const getLocale = () => {
        switch (config.locale) {
            case Locale.enGB:
                return z.locales.en();
            case Locale.nlNL:
                return z.locales.nl();
            default:
                return z.locales.en();
        }
    };

    z.config(getLocale());

    return (
        <TranslationsProvider
            customTranslations={config.customTranslations}
            locale={config.locale}
        >
            <PydanticFormConfigContext.Provider value={config}>
                <PydanticFormFieldDataStorageProvider>
                    <PydanticFormHandler
                        onCancel={onCancel}
                        onSuccess={onSuccess}
                        title={title}
                        formKey={formKey}
                    />
                </PydanticFormFieldDataStorageProvider>
            </PydanticFormConfigContext.Provider>
        </TranslationsProvider>
    );
};

export default PydanticForm;
