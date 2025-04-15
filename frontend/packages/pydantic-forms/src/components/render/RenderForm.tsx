/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import { componentsMatcher } from '@/components/componentMatcher';
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
    const {
        formRenderer,
        footerRenderer,
        componentMatcher: customComponentMatcher,
    } = config || {};

    const t = useTranslations('renderForm');

    const LoadingComponent = loadingComponent ?? <div>{t('loading')}</div>;

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

        return <div>{successNotice ?? t('successfullySent')}</div>;
    }

    const Renderer = formRenderer ?? FormRenderer;
    const FooterRenderer = footerRenderer ?? Footer;

    const pydanticFormComponents: PydanticFormComponents = componentsMatcher(
        pydanticFormSchema.properties,
        customComponentMatcher,
    );

    return (
        <form action={''} onSubmit={submitForm} style={{ width: '500px' }}>
            {title !== false &&
                title !== 'undefined' &&
                title !== 'unknown' && (
                    <h2 style={{ margin: '1rem 0' }}>
                        {title ?? pydanticFormSchema.title}
                    </h2>
                )}

            {headerComponent}

            <RenderFormErrors />

            <div style={{ marginBottom: '24px' }}>
                <Renderer pydanticFormComponents={pydanticFormComponents} />
            </div>
            <FooterRenderer />
        </form>
    );
};

export default RenderForm;
