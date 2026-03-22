import type { FieldValues } from 'react-hook-form';
import type { PydanticFormSuccessResponse } from 'pydantic-forms';

/**
 * Default success handler for form submissions
 */
export const defaultOnSuccess = (
    _: FieldValues[],
    apiResponse: PydanticFormSuccessResponse,
) => {
    alert(`Form submitted successfully: ${JSON.stringify(apiResponse.data)}`);
};

/**
 * Default cancel handler for forms
 */
export const defaultOnCancel = () => {
    alert('Form cancelled');
};
