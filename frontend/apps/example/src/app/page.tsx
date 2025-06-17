'use client';

import {
    Locale,
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
        const portsUrl =
            'https://orchestrator.dev.automation.surf.net/api/processes/create_sn8_service_port?productId=9a8bd1ea-6650-4900-b820-3c7f0f16ef1d';
        const localUrl = 'http://localhost:8000/form';
        const fetchResult = await fetch(localUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer INSERT_YOUR_JWT_TOKEN_HERE', // Replace with your JWT token
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

    const componentMatcher = (
        currentMatchers: PydanticComponentMatcher[],
    ): PydanticComponentMatcher[] => {
        return [
            {
                id: 'textarea',
                ElementMatch: {
                    Element: TextArea,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.LONG
                    );
                },
            },
            ...currentMatchers,
        ];
    };

    const customTranslations = {
        renderForm: {
            loading: 'The form is loading. Please wait.',
        },
    };
    const locale = Locale.enGB;

    return (
        <div className={styles.page}>
            <h1 style={{ marginBottom: '20px' }}>Pydantic Form </h1>

            <PydanticForm
                id="theForm"
                title="Example form"
                successNotice="Custom success notice"
                onCancel={() => {
                    alert('Form cancelled');
                }}
                config={{
                    allowUntouchedSubmit: true,
                    apiProvider: pydanticFormApiProvider,
                    labelProvider: pydanticLabelProvider,
                    customDataProvider: pydanticCustomDataProvider,
                    componentMatcher: componentMatcher,
                    customTranslations: customTranslations,
                    locale: locale,
                }}
            />
        </div>
    );
}
