/**
 * Dynamic Forms
 *
 * Main input wrap component
 *
 * This handles the validated / error state of the element as well as the label
 * This component should wrap every field, at the field component level
 *
 * @Uses FormField - Rijkshuisstijl
 */
import { useCallback } from 'react';

import ResetNullableFieldTrigger from '@/components/form/ResetNullableFieldTrigger';
import { useDynamicFormsContext } from '@/core';
import { IDynamicFormField } from '@/types';

interface FormFieldProps {
    label: React.ReactNode;
    description: string;
    required: boolean;
    isValid: boolean;
    error: string;
    dense: boolean;
    className: string;
    children: React.ReactNode;
}

const FormField = ({}: FormFieldProps) => {
    return <div>FormField</div>;
};

interface IconButtonProps {
    className: string;
    onClick: () => void;
    children: React.ReactNode;
}

const IconButton = ({}: IconButtonProps) => {
    return <button>IconButton</button>;
};

const IconInfo = () => {
    return <div>IconInfo</div>;
};

interface IDfFieldWrapProps {
    field: IDynamicFormField;
    children: React.ReactNode;
}

function DfFieldWrap({ field, children }: IDfFieldWrapProps) {
    const { rhf, errorDetails, debugMode } = useDynamicFormsContext();

    const fieldState = rhf.getFieldState(field.id);

    const errorMsg =
        errorDetails?.mapped?.[field.id]?.msg ?? fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    const debugTrigger = useCallback(() => {
        // eslint-disable-next-line no-console
        console.log(field);
    }, [field]);

    return (
        <FormField
            label={
                <>
                    {field.title}
                    <ResetNullableFieldTrigger field={field} />
                </>
            }
            description={field.description}
            required={field.required}
            isValid={!isInvalid}
            error={errorMsg as string}
            dense
            className="mt-0 mb-0"
        >
            <div className="d-flex">
                <div className="w-100">{children}</div>

                {debugMode && (
                    <IconButton className="ml-3" onClick={debugTrigger}>
                        <IconInfo />
                    </IconButton>
                )}
            </div>
        </FormField>
    );
}

export default DfFieldWrap;
