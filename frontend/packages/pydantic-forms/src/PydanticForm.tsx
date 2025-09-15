/**
 * Pydantic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React, { createContext } from 'react';

import { TranslationsProvider } from '@/messages/translationsProvider';
import { PydanticFormConfig } from '@/types';

import { PydanticFormHandler } from './core';
import type { PydanticFormHandlerProps } from './core/PydanticFormHandler';

export const PydanticFormConfigContext =
    createContext<PydanticFormConfig | null>(null);

type PydanticFormProps = PydanticFormHandlerProps & {
    config: PydanticFormConfig;
};

export const PydanticForm = ({
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormProps) => {
    return (
        <TranslationsProvider
            customTranslations={config.customTranslations}
            locale={config.locale}
        >
            <PydanticFormConfigContext.Provider value={config}>
                <PydanticFormHandler
                    onCancel={onCancel}
                    onSuccess={onSuccess}
                    title={title}
                    formKey={formKey}
                />
            </PydanticFormConfigContext.Provider>
        </TranslationsProvider>
    );
};

export default PydanticForm;
