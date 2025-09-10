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
        const url = 'http://localhost:8000/form';

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (fetchResult) => {
                // Note: https://chatgpt.com/share/68c16538-5544-800c-9684-1e641168dbff
                if (
                    fetchResult.status === 400 ||
                    fetchResult.status === 510 ||
                    fetchResult.status === 200
                ) {
                    const data = await fetchResult.json();

                    return new Promise<Record<string, unknown>>((resolve) => {
                        if (fetchResult.status === 510) {
                            resolve({ ...data, status: 510 });
                        }
                        if (fetchResult.status === 400) {
                            resolve({ ...data, status: 400 });
                        }
                        if (fetchResult.status === 200) {
                            resolve({ ...data, status: 200 });
                        }
                    });
                }
                throw new Error(
                    `Status not 400, 510 or 200: ${fetchResult.statusText}`,
                );
            }) //
            .catch((error) => {
                // Note: https://chatgpt.com/share/68c16538-5544-800c-9684-1e641168dbff
                throw new Error(`Fetch error: ${error}`);
            });
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
                formKey="theForm"
                title="Example form"
                onCancel={() => {
                    alert('Form cancelled');
                }}
                onSuccess={() => {
                    alert('Form submitted successfully');
                }}
                config={{
                    apiProvider: pydanticFormApiProvider,
                    labelProvider: pydanticLabelProvider,
                    customDataProvider: pydanticCustomDataProvider,
                    componentMatcherExtender: componentMatcher,
                    customTranslations: customTranslations,
                    locale: locale,
                    loadingComponent: <div>Custom loading component</div>,
                }}
            />
        </div>
    );
}
