/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';

import Footer from '@/components/form/Footer';
import { Form } from '@/components/form/Form';
import Header from '@/components/form/Header';
import { getPydanticFormComponents } from '@/core/helper';
import type { PydanticFormComponents, PydanticFormSchema } from '@/types';

import { useGetConfig } from './hooks';
import { useGetZodSchema } from './hooks';

export interface ReactHookFormProps {
    handleSubmit: (fieldValues: FieldValues) => void;
    handleCancel: () => void;
    pydanticFormSchema?: PydanticFormSchema;
    isLoading: boolean;
    isFullFilled: boolean;
    isSending: boolean;
    apiError?: string;
    hasNext: boolean;
    hasPrevious: boolean;
    initialValues: FieldValues;
    title?: string;
}

export const ReactHookForm = ({
    handleSubmit,
    handleCancel,
    pydanticFormSchema,
    isLoading,
    isFullFilled,
    isSending,
    apiError,
    initialValues,
    title,
    hasNext,
    hasPrevious,
}: ReactHookFormProps) => {
    const config = useGetConfig();
    const t = useTranslations('renderForm');

    const LoadingComponent = config.loadingComponent ?? (
        <div>{t('loading')}</div>
    );

    const ErrorComponent = config.loadingComponent ?? <div>{t('error')}</div>;

    const zodSchema = useGetZodSchema(
        pydanticFormSchema,
        config.componentMatcherExtender,
    );

    // initialize the react-hook-form
    const reactHookForm = useForm({
        resolver: zodResolver(zodSchema),
        mode: 'all',
        values: initialValues,
    });

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

    const { formRenderer, footerRenderer, headerRenderer } = config || {};
    const pydanticFormComponents: PydanticFormComponents =
        getPydanticFormComponents(
            pydanticFormSchema?.properties || {},
            config?.componentMatcherExtender,
        );

    const FormRenderer = formRenderer ?? Form;
    const FooterRenderer = footerRenderer ?? Footer;
    const HeaderRenderer = headerRenderer ?? Header;

    const onSubmit = (data: FieldValues) => {
        handleSubmit(data);
    };

    return (
        <FormProvider {...reactHookForm}>
            <form onSubmit={reactHookForm.handleSubmit(onSubmit)}>
                <HeaderRenderer
                    title={title}
                    pydanticFormSchema={pydanticFormSchema}
                />
                <FormRenderer pydanticFormComponents={pydanticFormComponents} />
                <FooterRenderer
                    onCancel={handleCancel}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                />
            </form>
        </FormProvider>
    );
};
