import React from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

type FormRowProps = {
    children: ReactElement;
    title: string;
    isInvalid?: boolean;
    error?: ReactNode | ReactNode[];
    description?: string;
    required: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const FormRow = ({
    children,
    title,
    error,
    description,
    required,
}: FormRowProps) => {
    return (
        <div>
            {title && (
                <label
                    style={{
                        margin: '8px 0',
                        display: 'block',
                        fontWeight: '600',
                    }}
                >
                    {title}{' '}
                    {required && <span style={{ color: 'red' }}>*</span>}
                </label>
            )}
            {description && (
                <div style={{ margin: '4px 0' }}>{description}</div>
            )}
            {children}
            {error}
        </div>
    );
};
