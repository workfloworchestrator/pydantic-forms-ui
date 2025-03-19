/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import { componentMatcher } from '@/components/componentMatcher';
import Footer from '@/components/form/Footer';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { PydanticFormComponents, PydanticFormContextProps } from '@/types';

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
        loadingComponent,
    } = contextProps;

    const LoadingComponent = loadingComponent ?? (
        <div>Formulier aan het ophalen...</div>
    );

    if (isLoading && !isSending) {
        return LoadingComponent;
    }

    if (!pydanticFormSchema || isSending) {
        return LoadingComponent;
    }

    if (isFullFilled) {
        if (skipSuccessNotice) {
            return <></>;
        }

        return (
            <div>{successNotice ?? 'Je inzending is succesvol ontvangen'}</div>
        );
    }

    const {
        formRenderer,
        footerRenderer,
        componentMatcher: customComponentMatcher,
    } = config || {};
    const Renderer = formRenderer ?? FormRenderer;
    const FooterRenderer = footerRenderer ?? Footer;

    // Map schema to get fields

    const pydanticFormComponents: PydanticFormComponents = componentMatcher(
        pydanticFormSchema.properties,
        customComponentMatcher,
    );

    return (
        <form action={''} onSubmit={submitForm}>
            {title !== false &&
                title !== 'undefined' &&
                title !== 'unknown' && (
                    <h2>{title ?? pydanticFormSchema.title}</h2>
                )}

            {headerComponent}

            <RenderFormErrors />

            <div>
                <Renderer pydanticFormComponents={pydanticFormComponents} />
            </div>

            <FooterRenderer />
        </form>
    );
};

export default RenderForm;
