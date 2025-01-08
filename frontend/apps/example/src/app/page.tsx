'use client';

import PydanticForm from 'pydantic-forms';

import styles from './page.module.css';

type ReturnValue = string | number | object;

export default function Home() {
    const formSchemaProvider = ({
        formKey,
        requestBody,
    }: {
        formKey: string;
        requestBody: object;
    }) => {
        // eslint-disable-next-line no-console
        console.log(formKey, requestBody);
        return new Promise<Record<string, ReturnValue>>((resolve) => {
            resolve({
                title: 'Example Form',
                sections: [
                    {
                        id: 'section1',
                        title: 'Section 1',
                        fields: [
                            {
                                id: 'field1',
                                type: 'text',
                                label: 'Field 1',
                                required: true,
                            },
                            {
                                id: 'field2',
                                type: 'text',
                                label: 'Field 2',
                                required: true,
                            },
                        ],
                    },
                    {
                        id: 'section2',
                        title: 'Section 2',
                        fields: [
                            {
                                id: 'field3',
                                type: 'text',
                                label: 'Field 3',
                                required: true,
                            },
                            {
                                id: 'field4',
                                type: 'text',
                                label: 'Field 4',
                                required: true,
                            },
                        ],
                    },
                ],
            });
        });
    };

    const labelProvider = ({
        formKey,
        id,
    }: {
        formKey: string;
        id?: string | null;
    }) => {
        // eslint-disable-next-line no-console
        console.log(formKey, id);
        return new Promise<Record<string, ReturnValue>>((resolve) => {
            resolve({
                field1: {
                    label: 'Field 1',
                },
                field2: {
                    label: 'Field 2',
                },
                field3: {
                    label: 'Field 3',
                },
                field4: {
                    label: 'Field 4',
                },
            });
        });
    };

    return (
        <div className={styles.page}>
            <h1>Pydantic Form</h1>

            <PydanticForm
                id="theForm"
                onSuccess={() => {
                    alert('Form submitted successfully');
                }}
                config={{
                    formProvider: formSchemaProvider,
                    labelProvider: labelProvider,
                }}
            />
        </div>
    );
}

/**
 *
PydanticFormProps:
id: string
meta: PydanticFormMetaData

From PydanticFormInitialContextProps:
formIdKey?: string;
title?: string | boolean;
sendLabel?: string;
metaData?: PydanticFormMetaData;
formLayout: PydanticFormLayout;
successNotice?: React.ReactNode;
onSuccess?: (fieldValues: FieldValues, summaryData: object) => void;
onCancel?: () => void;
onChange?: (fieldValues: FieldValues) => void;

headerComponent?: React.ReactNode;
footerComponent?: React.ReactNode;
hasCardWrapper?: boolean;
config: PydanticFormsContextConfig;

PydanticFormsContextConfig:
    labelProvider: PydanticFormLabelProvider;
    formProvider: PydanticFormProvider;

    customDataProvider?: PydanticFormDataProvider;


    layoutColumnProvider?: PydanticFormLayoutColumnProvider;
    formStructureMutator?: PydanticFormStructureMutator;
    fieldDetailProvider?: PydanticFormFieldDetailProvider;
    dataProviderCacheKey?: number;
    onFieldChangeHandler?: onPydanticFormFieldChangeHandlerFn;
    customValidationRules?: CustomValidationRule;
    skipSuccessNotice?: boolean;
    allowUntouchedSubmit?: boolean;
    cancelButton?: React.ReactNode;
    resetButtonAlternative?: React.ReactNode;
    disableSaveProgress?: boolean;
    footerCtaPrimaryVariant?: string;



export type PydanticFormProvider = ({
    formKey,
    requestBody,
}: {
    formKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestBody: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;
 

export type PydanticFormLabelProvider = ({
    formKey,
    id,
}: {
    formKey: string;
    id?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;
*/
