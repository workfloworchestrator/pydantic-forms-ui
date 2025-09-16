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
    apiError?: string;
    handleCancel: () => void;
    handleSubmit: (fieldValues: FieldValues) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    initialValues: FieldValues;
    isFullFilled: boolean;
    isLoading: boolean;
    isSending: boolean;
    pydanticFormSchema?: PydanticFormSchema;
    title?: string;
}

export const ReactHookForm = ({
    apiError,
    handleCancel,
    handleSubmit,
    hasNext,
    hasPrevious,
    initialValues,
    isFullFilled,
    isLoading,
    isSending,
    pydanticFormSchema,
    title,
}: ReactHookFormProps) => {
    const config = useGetConfig();
    const t = useTranslations('renderForm');

    const LoadingComponent = config.loadingComponent ?? (
        <div>{t('loading')}</div>
    );

    const ErrorComponent = config.errorComponent ?? <div>{t('error')}</div>;

    const zodSchema = useGetZodSchema(
        pydanticFormSchema,
        config.componentMatcherExtender,
    );

    const reactHookForm = useForm({
        resolver: zodResolver(zodSchema),
        mode: 'all',
        values: initialValues,
    });

    if (apiError) {
        console.error('API Error:', apiError);
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
