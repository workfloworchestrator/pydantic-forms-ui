/**
 * Pydantic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React from 'react';

import RenderForm from '@/components/render/RenderForm';
import PydanticFormContextProvider from '@/core/PydanticFormContextProvider';
import type { PydanticFormContextProviderProps } from '@/core/PydanticFormContextProvider';
import { TranslationsProvider } from '@/messages/translationsProvider';

export const PydanticForm = ({
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: Omit<PydanticFormContextProviderProps, 'children'>) => (
    <TranslationsProvider
        customTranslations={config.customTranslations}
        locale={config.locale}
    >
        <PydanticFormContextProvider
            config={config}
            onCancel={onCancel}
            onSuccess={onSuccess}
            title={title}
            formKey={formKey}
        >
            {RenderForm}
        </PydanticFormContextProvider>
    </TranslationsProvider>
);

export default PydanticForm;
