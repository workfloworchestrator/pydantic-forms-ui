'use client';

import {
    PydanticForm, // PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormField,
    PydanticFormLabelProvider,
    PydanticFormZodValidationFn,
} from 'pydantic-forms';
import { z } from 'zod';

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

    const validatorTest: PydanticFormZodValidationFn = (
        field: PydanticFormField,
    ) => {
        const { maxLength, minLength, pattern } = {
            maxLength: 10,
            minLength: 3,
            pattern: 'hallo',
        };

        let validationRule = z.string().trim();
        if (minLength) {
            validationRule = validationRule?.min(
                minLength,
                minLength === 1
                    ? 'Moet ingevuld zijn'
                    : `Dit veld heeft een minimum lengte van ${minLength} karakters`,
            );
        }

        if (maxLength) {
            validationRule = validationRule?.max(
                maxLength,
                `Dit veld heeft een maximum lengte van ${maxLength} karakters`,
            );
        }

        if (pattern) {
            try {
                validationRule = validationRule?.regex(
                    new RegExp(pattern),
                    'De invoer is niet volgens het juiste formaat',
                );
            } catch (error) {
                console.error(
                    'Could not parse validation rule regex',
                    field,
                    pattern,
                    error,
                );
            }
        }

        if (!field.required) {
            validationRule = validationRule.or(
                z.literal(''),
            ) as unknown as z.ZodString;
        }

        return validationRule;
    };

    const componentMatcher = (
        currentMatchers: PydanticComponentMatcher[],
    ): PydanticComponentMatcher[] => {
        // return currentMatchers;
        return [
            {
                id: 'textarea',
                Element: TextArea,
                matcher(field) {
                    return field.type === PydanticFormFieldType.STRING;
                },
                validator: validatorTest,
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
                onCancel={() => {
                    alert('Form cancelled');
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
                    componentMatcher: componentMatcher,
                }}
            />
        </div>
    );
}
