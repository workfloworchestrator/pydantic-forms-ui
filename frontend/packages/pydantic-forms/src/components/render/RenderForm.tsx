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

const RenderForm = ({
    submitForm,
    formData,
    config,
    isLoading,
    isFullFilled,
    successNotice,
    isSending,
    title,
    headerComponent,
    skipSuccessNotice,
}: PydanticFormContextProps) => {
    if (isLoading && !isSending) {
        return <div>Formulier aan het ophalen...</div>;
    }

    if (!formData) {
        return <div>Formulier aan het ophalen...</div>;
    }

    if (isSending) {
        return <div>Formulier aan het verzenden...</div>;
    }

    if (isFullFilled) {
        if (skipSuccessNotice) {
            return <></>;
        }

        return (
            <div className="info-box d-flex align-items-center">
                {successNotice ?? 'Je inzending is succesvol ontvangen'}
            </div>
        );
    }
    const { formRenderer } = config || {};
    const Renderer = formRenderer ?? FormRenderer;

    return (
        <form
            action={''}
            onSubmit={submitForm}
            style={{
                border: 'thin solid lightgrey',
                width: '500px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
            }}
        >
            {title !== false && <h2>{title ?? formData.title}</h2>}

            {headerComponent}

            <RenderFormErrors />

            <div>
                <Renderer pydanticFormData={formData} />
            </div>

            <Footer />
        </form>
    );
};

export default RenderForm;
