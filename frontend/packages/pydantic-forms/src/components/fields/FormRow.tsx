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
        <div className="pf-field-row">
            {title && (
                <label
                    className="pf-field-label"
                    style={{
                        margin: '8px 0',
                        display: 'block',
                        fontWeight: '600',
                    }}
                >
                    {title}{' '}
                    {required && (
                        <span
                            className="pf-field-required"
                            style={{ color: 'red' }}
                        >
                            *
                        </span>
                    )}
                </label>
            )}
            {description && (
                <div
                    className="pf-field-description"
                    style={{ margin: '4px 0' }}
                >
                    {description}
                </div>
            )}
            {children}
            {error && (
                <div className="pf-field-error" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};
