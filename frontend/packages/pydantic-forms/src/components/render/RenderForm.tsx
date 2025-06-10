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
        submitForm,
        pydanticFormSchema,
        config,
        isLoading,
        isFullFilled,
        successNotice,
        isSending,
        skipSuccessNotice,
        loadingComponent,
    } = contextProps;
    const { formRenderer, footerRenderer, headerRenderer } = config || {};

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

    const FormRenderer = formRenderer ?? Form;
    const FooterRenderer = footerRenderer ?? Footer;
    const HeaderRenderer = headerRenderer ?? Header;

    return (
        <form action={''} onSubmit={submitForm}>
            <HeaderRenderer />
            <FormRenderer pydanticFormComponents={pydanticFormComponents} />
            <FooterRenderer />
        </form>
    );
};

export default RenderForm;
