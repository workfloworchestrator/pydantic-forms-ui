import React from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

type FormRowProps = {
    children: ReactElement;
    label?: ReactNode;
    isInvalid?: boolean;
    error?: ReactNode | ReactNode[];
    description?: string;
    required: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const FormRow = ({
    children,
    label,
    isInvalid,
    error,
    ...rest
}: FormRowProps) => {
    // TODO: readd required, description, classname
    return (
        <div {...(rest as HTMLAttributes<HTMLElement>)}>
            {label && (
                <label>
                    {label} {isInvalid && '!!!'}
                </label>
            )}
            {children}
            {error}
        </div>
    );
};
