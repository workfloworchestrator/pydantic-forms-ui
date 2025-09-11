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
import { Form } from '@/components/form/Form';
import Header from '@/components/form/Header';
import { getPydanticFormComponents } from '@/core/helper';
import { PydanticFormComponents, PydanticFormContextProps } from '@/types';

const RenderForm = (contextProps: PydanticFormContextProps) => {
    const {
        handleSubmit,
        pydanticFormSchema,
        config,
        isLoading,
        isFullFilled,
        isSending,
        apiError,
    } = contextProps;

    const { formRenderer, footerRenderer, headerRenderer } = config || {};

    const pydanticFormComponents: PydanticFormComponents =
        getPydanticFormComponents(
            pydanticFormSchema?.properties || {},
            config?.componentMatcherExtender,
        );

    const t = useTranslations('renderForm');

    const LoadingComponent = config.loadingComponent ?? (
        <div>{t('loading')}</div>
    );

    const ErrorComponent = config.loadingComponent ?? <div>{t('error')}</div>;

    if (apiError) {
        return ErrorComponent;
    }

    if (isLoading && !isSending) {
        return LoadingComponent;
    }

    if (!pydanticFormSchema || isSending) {
        return LoadingComponent;
    }

    if (isFullFilled) {
        return <></>;
    }

    const FormRenderer = formRenderer ?? Form;
    const FooterRenderer = footerRenderer ?? Footer;
    const HeaderRenderer = headerRenderer ?? Header;

    return (
        <form action={''} onSubmit={handleSubmit}>
            <HeaderRenderer />
            <FormRenderer pydanticFormComponents={pydanticFormComponents} />
            <FooterRenderer />
        </form>
    );
};

export default RenderForm;
