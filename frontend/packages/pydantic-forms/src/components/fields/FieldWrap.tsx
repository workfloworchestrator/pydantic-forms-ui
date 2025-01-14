/**
 * Pydantic Forms
 *
 * Main input wrap component
 *
 * This handles the validated / error state of the element as well as the label
 * This component should wrap every field, at the field component level
 *
 */
import React, { useCallback } from 'react';

import ResetNullableFieldTrigger from '@/components/form/ResetNullableFieldTrigger';
import { usePydanticFormContext } from '@/core';
import { PydanticFormField } from '@/types';

import { FormRow } from './FormRow';

interface FieldWrapProps {
    field: PydanticFormField;
    children: React.ReactNode;
}

function FieldWrap({ field, children }: FieldWrapProps) {
    const { rhf, errorDetails, debugMode } = usePydanticFormContext();

    const fieldState = rhf.getFieldState(field.id);

    const errorMsg =
        errorDetails?.mapped?.[field.id]?.msg ?? fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    const debugTrigger = useCallback(() => {
        // eslint-disable-next-line no-console
        console.log(field);
    }, [field]);

    return (
        <FormRow
            label={
                <>
                    {field.title}
                    <ResetNullableFieldTrigger field={field} />
                </>
            }
            description={field.description}
            required={field.required}
            isInvalid={!!isInvalid}
            error={errorMsg as string}
            className="mt-0 mb-0"
        >
            <div>
                <div className="w-100">{children}</div>

                {debugMode && (
                    <button
                        aria-label="glasses"
                        className="ml-3"
                        onClick={debugTrigger}
                    />
                )}
            </div>
        </FormRow>
    );
}

export default FieldWrap;
