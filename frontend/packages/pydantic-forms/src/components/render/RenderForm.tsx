/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import Footer from '@/components/form/Footer';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { PydanticFormContextProps } from '@/types';

import { FormRenderer } from './FormRenderer';

const RenderForm = (contextProps: PydanticFormContextProps) => {
    const {
        submitForm,
        pydanticFormSchema,
        config,
        isLoading,
        isFullFilled,
        successNotice,
        isSending,
        title,
        headerComponent,
        skipSuccessNotice,
    } = contextProps;

    console.log('contextprops', contextProps);

    if (isLoading && !isSending) {
        return <div>Formulier aan het ophalen... A</div>;
    }

    if (!pydanticFormSchema) {
        return <div>Formulier aan het ophalen... B</div>;
    }

    if (isSending) {
        return <div>Formulier aan het verzenden...</div>;
    }

    if (isFullFilled) {
        if (skipSuccessNotice) {
            return <></>;
        }

        return (
            <div>{successNotice ?? 'Je inzending is succesvol ontvangen'}</div>
        );
    }

    const { formRenderer } = config || {};
    const Renderer = formRenderer ?? FormRenderer;

    return (
        <form action={''} onSubmit={submitForm}>
            {title !== false && <h2>{title ?? pydanticFormSchema.title}</h2>}

            {headerComponent}

            <RenderFormErrors />

            <div>
                <Renderer pydanticFormData={pydanticFormSchema} />
            </div>

            <Footer />
        </form>
    );
};

export default RenderForm;
