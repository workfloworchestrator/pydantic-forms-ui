'use client';

import PydanticForm from 'pydantic-forms';
import type { PydanticFormProvider } from 'pydantic-forms';

import styles from './page.module.css';

export default function Home() {
    const pydanticFormProvider: PydanticFormProvider = async () => {
        const fetchResult = await fetch('http://localhost:8000/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const jsonResult = await fetchResult.json();
        return jsonResult;
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
                    formProvider: pydanticFormProvider,
                }}
            />
        </div>
    );
}
