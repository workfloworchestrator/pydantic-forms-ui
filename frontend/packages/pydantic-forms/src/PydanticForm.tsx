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
import { TranslationsProvider } from '@/messages/translationsProvider';
import type {
    PydanticFormInitialContextProps,
    PydanticFormMetaData,
} from '@/types';

export interface PydanticFormProps
    extends Omit<PydanticFormInitialContextProps, 'formKey' | 'children'> {
    id: string;
    metaData?: PydanticFormMetaData;
}

export const PydanticForm = ({
    id,
    metaData,
    ...contextProps
}: PydanticFormProps) => (
    <TranslationsProvider
        customTranslations={contextProps.config.customTranslations}
        locale={contextProps.config.locale}
    >
        <PydanticFormContextProvider
            {...contextProps}
            formKey={id}
            metaData={metaData}
        >
            {RenderForm}
        </PydanticFormContextProvider>
    </TranslationsProvider>
);

export default PydanticForm;
