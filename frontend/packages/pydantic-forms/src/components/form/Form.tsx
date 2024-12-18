/**
 * Dynamic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import LoadingNotice from '~/components/generic/LoadingNotice/LoadingNotice';

import React from 'react';

import { Card, IconKlaarzetten, PageTitle, Row } from '@lib/rijkshuisstijl';

import DynamicFormFooter from '@/components/form/Footer';
import { RenderFields } from '@/components/render/Fields';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { RenderSections } from '@/components/render/Sections';
import { DynamicFormsFormLayout, IDynamicFormsContextProps } from '@/types';

import styles from './Form.module.scss';

const CardAsFragment = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    title,
    children,
}: {
    title?: string;
    children?: React.ReactNode | undefined;
}) => <React.Fragment>{children}</React.Fragment>;

const RenderMainForm = ({
    submitForm,
    formData,
    isLoading,
    isFullFilled,
    successNotice,
    isSending,
    formLayout,
    title,
    headerComponent,
    skipSuccessNotice,
    hasCardWrapper = true,
}: IDynamicFormsContextProps) => {
    if (isLoading && !isSending) {
        return <LoadingNotice>Formulier aan het ophalen...</LoadingNotice>;
    }

    if (!formData) {
        return <LoadingNotice>Formulier aan het ophalen...</LoadingNotice>;
    }

    if (isSending) {
        return <LoadingNotice>Formulier aan het verzenden...</LoadingNotice>;
    }

    if (isFullFilled) {
        if (skipSuccessNotice) {
            return <></>;
        }

        return (
            <div className="info-box d-flex align-items-center">
                <IconKlaarzetten className="mr-3" />{' '}
                {successNotice ?? 'Je inzending is succesvol ontvangen'}
            </div>
        );
    }

    const Wrapper = hasCardWrapper ? Card : CardAsFragment;
    return (
        <form
            action={''}
            onSubmit={submitForm}
            className={`${styles.form} ${styles[formLayout]}`}
        >
            {title !== false && (
                <PageTitle>{title ?? formData.title}</PageTitle>
            )}

            {headerComponent}

            <RenderFormErrors />

            <div className="form-content-wrapper">
                {formData.sections.map((section) => (
                    <RenderSections section={section} key={section.id}>
                        {({ fields }) => (
                            <Wrapper title={section.title} spacious>
                                {formLayout ===
                                DynamicFormsFormLayout.ONE_COL ? (
                                    <div className="row-with-child-rows">
                                        <RenderFields fields={fields} />
                                    </div>
                                ) : (
                                    <Row className="row-with-child-rows">
                                        <RenderFields fields={fields} />
                                    </Row>
                                )}
                            </Wrapper>
                        )}
                    </RenderSections>
                ))}
            </div>

            <DynamicFormFooter />
        </form>
    );
};

export default RenderMainForm;
