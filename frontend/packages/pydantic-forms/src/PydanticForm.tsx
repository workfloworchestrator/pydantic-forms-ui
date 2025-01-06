/**
 * Dynamic Forms
 *
 * Main form wrap component
 *
 * This is the component that will be included when we want to use a form.
 * It initializes the context and calls the mainForm
 */
import React from 'react';

import RenderMainForm from '@/components/form/Form';
import PydanticFormContextProvider from '@/core/PydanticFormContextProvider';
import type {
    PydanticFormInitialContextProps,
    PydanticFormMetaData,
} from '@/types';

export interface PydanticFormProps
    extends Omit<PydanticFormInitialContextProps, 'formKey' | 'children'> {
    id: string;
    metaData?: PydanticFormMetaData;
}

const PydanticForm = ({ id, metaData, ...contextProps }: PydanticFormProps) => (
    <div e2e-id={`dynamicforms-${id}`}>
        <PydanticFormContextProvider
            {...contextProps}
            formKey={id}
            metaData={metaData}
        >
            {RenderMainForm}
        </PydanticFormContextProvider>
    </div>
);

export default PydanticForm;
