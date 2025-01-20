'use client';

import { PydanticForm } from 'pydantic-forms';
import type {
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';

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
                    name: 'LABEL NAAM',
                    name_info: 'DESCRIPTION NAAM',
                },
                data: {
                    name: 'VALUE NAAM',
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

    return (
        <div className={styles.page}>
            <h1>Pydantic Form</h1>

            <PydanticForm
                id="theForm"
                title="The form title"
                sendLabel="Send label"
                successNotice="Custom success notice"
                onSuccess={() => {
                    // console.log(fieldValues, summaryData, response);
                    alert('Form submitted successfully');
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
                        // console.log('calling onFieldChangeHandler', field);
                    },
                }}
                headerComponent={<div>HEADER COMPONENT</div>}
                footerComponent={<div>FOOTER COMPONENT</div>}
            />
        </div>
    );
}
