'use client';

<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
<<<<<<< HEAD
<<<<<<< HEAD
import { useParams } from 'next/navigation';
import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
=======
>>>>>>> 6b4540b (Cleanup)
=======
import { useParams } from 'next/navigation';
>>>>>>> 305eba5 (prettier)
import type {
=======
import {
    Locale,
>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';
import {
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';

<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
<<<<<<< HEAD
<<<<<<< HEAD
import { TextArea } from '@/fields';

import NLnl from '../../../messages/nl-NL.json';
=======
import {TextArea} from '@/fields';
import {useParams} from "next/navigation";
=======
import {
    handleInvalidLocale,
    useGetTranslationMessages,
} from '@/app/[locale]/useGetTranslationMessages';
=======
>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx
import { TextArea } from '@/fields';
>>>>>>> 305eba5 (prettier)

<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
>>>>>>> 6b4540b (Cleanup)
import styles from '../page.module.css';
=======
import styles from './page.module.css';
>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx

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
<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
    const { locale } = useParams();
    const validLocale = handleInvalidLocale(locale);
>>>>>>> 6b4540b (Cleanup)

=======
>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx
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

<<<<<<< HEAD
=======
    const ResetButtonAlternative = () => (
        <button type="button">Alternative reset</button>
    );

    const CancelButtonAlternative = () => (
        <button type="button">Alternative cancel</button>
    );

>>>>>>> 305eba5 (prettier)
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

<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
<<<<<<< HEAD
    // const translations = getMessages(locale);
    // console.log('NEW translations', translations);

=======
>>>>>>> 6b4540b (Cleanup)
=======
    const customTranslations = {
        renderForm: {
            loading: 'The form is loading. Please wait.',
        },
    };

    const locale = Locale.enGB;

>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx
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
<<<<<<< HEAD:frontend/apps/example/src/app/[locale]/page.tsx
<<<<<<< HEAD
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
=======
                    translations: useGetTranslationMessages(validLocale), //Comment this line for default translations
                    locale: validLocale,
>>>>>>> 305eba5 (prettier)
=======
                    customTranslations: customTranslations,
                    locale: locale,
>>>>>>> faa8b5a (Resolved comments):frontend/apps/example/src/app/page.tsx
                }}
            />
        </div>
    );
}
