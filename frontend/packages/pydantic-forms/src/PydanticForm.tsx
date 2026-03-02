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
    PydanticFormConfig,
    PydanticFormProps,
    PydanticFormValidationErrorDetails,
} from '@/types';
import { getZodCustomErrorMessages, getZodLocale } from '@/utils';

import { PydanticFormHandler } from './core';
import { PydanticFormFieldDataStorageProvider } from './core/PydanticFieldDataStorageProvider';

export const PydanticFormConfigContext =
    createContext<PydanticFormConfig | null>(null);

export const PydanticFormValidationErrorContext =
    createContext<PydanticFormValidationErrorDetails | null>(null);

export const PydanticForm = ({
    config,
    formKey,
    formId,
    onCancel,
    onSuccess,
    title,
}: PydanticFormProps) => {
    const zodCustomError = getZodCustomErrorMessages(config.locale);
    z.config({
        ...getZodLocale(config.locale),
        customError: (issue) =>
            config.zodCustomError?.(issue) ?? zodCustomError(issue),
    });

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
                        formId={formId}
                    />
                </PydanticFormFieldDataStorageProvider>
            </PydanticFormConfigContext.Provider>
        </TranslationsProvider>
    );
};

export default PydanticForm;
