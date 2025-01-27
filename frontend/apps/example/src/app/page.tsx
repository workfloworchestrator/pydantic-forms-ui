'use client';

import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';

import { TextArea } from '@/fields';

import styles from './page.module.css';

export default function Home() {
    const pydanticFormApiProvider: PydanticFormApiProvider = async ({
        requestBody,
    }) => {
        const fetchResult = await fetch('http://localhost:8000/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        const jsonResult = await fetchResult.json();
        return jsonResult;
    };

    const pydanticLabelProvider: PydanticFormLabelProvider = async () => {
        return new Promise((resolve) => {
            resolve({
                labels: {
                    name: 'LABEL NAME',
                    name_info: 'DESCRIPTION NAAM',
                },
                data: {
                    name: 'LABEL VALUE NAAM',
                },
            });
        });
    };

    const pydanticCustomDataProvider: PydanticFormCustomDataProvider = () => {
        return new Promise((resolve) => {
            resolve({
                name: 'CUSTOM VALUE NAAM',
            });
        });
    };

    const ResetButtonAlternative = () => (
        <button type="button">Alternative reset</button>
    );

    const CancelButtonAlternative = () => (
        <button type="button">Alternative cancel</button>
    );

    const componentMatcher = (
        currentMatchers: PydanticComponentMatcher[],
    ): PydanticComponentMatcher[] => {
        // return currentMatchers;
        return [
            {
                id: 'textarea',
                Component: TextArea,
                matcher(field) {
                    return field.type === PydanticFormFieldType.STRING;
                },
            },
            ...currentMatchers,
        ];
    };

    return (
        <div className={styles.page}>
            <h1 style={{ marginBottom: '40px' }}>Pydantic Form</h1>

            <PydanticForm
                id="theForm"
                title="Example form"
                successNotice="Custom success notice"
                onSuccess={() => {
                    console.log(fieldValues, summaryData, response);
                    // alert('Form submitted successfully');
                }}
                onCancel={() => {
                    alert('Form cancelled');
                }}
                onChange={() => {
                    // console.log('onChange', fieldValues);
                }}
                config={{
                    apiProvider: pydanticFormApiProvider,
                    labelProvider: pydanticLabelProvider,
                    customDataProvider: pydanticCustomDataProvider,
                    resetButtonAlternative: ResetButtonAlternative(),
                    cancelButton: CancelButtonAlternative(),
                    allowUntouchedSubmit: true,
                    onFieldChangeHandler: () => {
                        console.log('calling onFieldChangeHandler', field);
                    },
                    componentMatcher: componentMatcher,
                }}
            />
        </div>
    );
}
