/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import Footer from '@/components/form/Footer';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { getPydanticFormComponents } from '@/core/helper';
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
    const { formRenderer, footerRenderer } = config || {};

    const pydanticFormComponents: PydanticFormComponents =
        getPydanticFormComponents(
            pydanticFormSchema?.properties || {},
            config?.componentMatcher,
        );

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

    return (
        <form action={''} onSubmit={submitForm}>
            {title !== false &&
                title !== 'undefined' &&
                title !== 'unknown' && (
                    <h2 style={{ margin: '1rem 0' }}>
                        {title ?? pydanticFormSchema.title}
                    </h2>
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
