'use client';

import PydanticForm from 'pydantic-forms';

import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.page}>
            <h1>Pydantic Form</h1>

            <PydanticForm />
        </div>
    );
}

/**
id: string
meta: PydanticFormMetaData



export type PydanticFormMetaData = {
    [key: string | number]: DfFieldValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DfFieldValue = any;
*/
