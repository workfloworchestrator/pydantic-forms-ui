'use client';

<<<<<<< HEAD
import { useParams } from 'next/navigation';
import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
=======
>>>>>>> 6b4540b (Cleanup)
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';
import {PydanticForm, PydanticFormFieldFormat, PydanticFormFieldType,} from 'pydantic-forms';

<<<<<<< HEAD
import { TextArea } from '@/fields';

import NLnl from '../../../messages/nl-NL.json';
=======
import {TextArea} from '@/fields';
import {useParams} from "next/navigation";

>>>>>>> 6b4540b (Cleanup)
import styles from '../page.module.css';
import {handleInvalidLocale, useGetTranslationMessages} from "@/app/[locale]/useGetTranslationMessages";

<<<<<<< HEAD
export default function Home({
    messages,
}: {
    messages: Record<string, string>;
}) {
    const params = useParams();
    const locale = params?.locale as string; // Get locale from URL params
=======
export default function Home() {
    const {locale} = useParams();
    const validLocale = handleInvalidLocale(locale);
>>>>>>> 6b4540b (Cleanup)

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

<<<<<<< HEAD
    // const translations = getMessages(locale);
    // console.log('NEW translations', translations);

=======
>>>>>>> 6b4540b (Cleanup)
    return (
        <div className={styles.page}>
            <h1 style={{ marginBottom: '20px' }}>Pydantic Form ({locale})</h1>

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
<<<<<<< HEAD
<<<<<<< HEAD
                    translations: NLnl,
=======
                    translations : useGetTranslationMessages(validLocale)
>>>>>>> 6b4540b (Cleanup)
=======
                    translations : useGetTranslationMessages(validLocale), //Comment this line for default translations
                    locale: validLocale
>>>>>>> 07848e9 (Some refactor)
                }}
            />
        </div>
    );
}
