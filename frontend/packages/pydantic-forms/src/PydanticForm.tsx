/**
 * Pydantic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React, { createContext, useEffect, useMemo } from 'react';

import { z } from 'zod';

import { TranslationsProvider } from '../src/messages/translationsProvider';
import {
    PydanticFormContextConfig,
    PydanticFormProps,
    PydanticFormValidationErrorDetails,
} from '../src/types';
import { getZodCustomErrorMessages, getZodLocale } from '../src/utils';
import { PydanticFormHandler } from './core';
import { PydanticFormFieldDataStorageProvider } from './core/PydanticFieldDataStorageProvider';
import { getMatcher } from './core/getMatcher';

export const PydanticFormConfigContext =
    createContext<PydanticFormContextConfig | null>(null);

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
    const componentMatcher = useMemo(
        () => getMatcher(config.componentMatcherExtender),
        [config.componentMatcherExtender],
    );

    const contextConfig: PydanticFormContextConfig = useMemo(
        () => ({
            ...config,
            componentMatcher,
        }),
        [config, componentMatcher],
    );

    const { locale, zodCustomError: configZodCustomError } = contextConfig;

    useEffect(() => {
        const localeZodCustomError = getZodCustomErrorMessages(locale);
        z.config({
            ...getZodLocale(locale),
            customError: (issue) =>
                configZodCustomError?.(issue) ?? localeZodCustomError(issue),
        });
    }, [locale, configZodCustomError]);

    return (
        <TranslationsProvider
            customTranslations={contextConfig.customTranslations}
            locale={contextConfig.locale}
        >
            <PydanticFormConfigContext.Provider value={contextConfig}>
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
