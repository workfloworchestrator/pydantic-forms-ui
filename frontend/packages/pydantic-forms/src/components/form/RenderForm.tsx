/**
 * Pydantic Forms
 *
 * Main form component
 *
 * Here we define the outline of the form
 */
import React from 'react';

import Footer from '@/components/form/Footer';
import { RenderFields } from '@/components/render/Fields';
import RenderFormErrors from '@/components/render/RenderFormErrors';
import { RenderSections } from '@/components/render/Sections';
import { PydanticFormContextProps, PydanticFormLayout } from '@/types';

/**
 * TODO: Implement CardAsFragment and see what the use case is

const CardAsFragment = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    title,
    children,
}: {
    title?: string;
    children?: React.ReactNode | undefined;
}) => <React.Fragment>{children}</React.Fragment>;
*/
const RenderForm = ({
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

    return (
        <form
            action={''}
            onSubmit={submitForm}
            css={{
                border: 'thin solid lightgrey',
                width: '500px',
                height: '250px',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
            }}
        >
            {title !== false && <h2>{title ?? formData.title}</h2>}

            {headerComponent}

            <RenderFormErrors />

            <div css={{ padding: '12px', height: '250px' }}>
                {formData.sections.map((section) => (
                    <RenderSections section={section} key={section.id}>
                        {({ fields }) => (
                            <div>
                                {formLayout === PydanticFormLayout.ONE_COL ? (
                                    <div className="row-with-child-rows">
                                        <RenderFields fields={fields} />
                                    </div>
                                ) : (
                                    <div className="row-with-child-rows">
                                        <RenderFields fields={fields} />
                                    </div>
                                )}
                            </div>
                        )}
                    </RenderSections>
                ))}
            </div>

            <Footer />
        </form>
    );
};

export default RenderForm;
