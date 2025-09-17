import React, { createContext, useMemo, useRef } from 'react';

import { PydanticFormFieldDataStorage } from '@/types';

export const PydanticFormFieldDataStorageContext =
    createContext<PydanticFormFieldDataStorage | null>(null);

interface PydanticFormFieldDataStorageContextProviderProps {
    children: React.ReactNode;
}

export const PydanticFormFieldDataStorageProvider = ({
    children,
}: PydanticFormFieldDataStorageContextProviderProps) => {
    const fieldDataStorageRef = useRef<Map<string, Map<string, unknown>>>(
        new Map<string, Map<string, unknown>>(),
    );

    const fieldDataStorage = useMemo(
        () => ({
            has: (fieldId: string, key: string | number) => {
                if (
                    fieldDataStorageRef.current &&
                    fieldDataStorageRef.current.has(fieldId)
                ) {
                    const fieldStorage =
                        fieldDataStorageRef.current.get(fieldId);
                    return fieldStorage?.has(key.toString()) ?? false;
                }
                return false;
            },
            get: (fieldId: string, key: string | number) => {
                const fieldData = fieldDataStorageRef?.current?.get(fieldId);
                return fieldData?.get(key.toString());
            },
            set: (fieldId: string, key: string | number, value: unknown) => {
                fieldDataStorageRef.current.set(
                    fieldId,
                    new Map([[key.toString(), value]]),
                );
            },
            delete: (fieldId: string) => {
                if (fieldDataStorageRef.current?.has(fieldId)) {
                    fieldDataStorageRef.current.delete(fieldId);
                }
            },
        }),
        [],
    );

    return (
        <PydanticFormFieldDataStorageContext.Provider value={fieldDataStorage}>
            {children}
        </PydanticFormFieldDataStorageContext.Provider>
    );
};
