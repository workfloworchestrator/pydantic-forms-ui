import type { FieldValues } from 'react-hook-form';

import type {
    PydanticFormSchema,
    PydanticFormValidationErrorDetails,
} from '@/types';
import { PydanticFormFieldType } from '@/types';

export interface UsePydanticFormReturn {
    validationErrorsDetails: PydanticFormValidationErrorDetails | undefined;
    apiError: string | undefined;
    hasNext: boolean;
    isFullFilled: boolean;
    isSending: boolean;
    isLoading: boolean;
    pydanticFormSchema: PydanticFormSchema;
    initialValues: FieldValues;
}

export function usePydanticForm(
    formStep: FieldValues,
    formSteps: FieldValues[] = [],
    formKey: string,
    updateFormStepsRef?: (steps: FieldValues[]) => void,
): UsePydanticFormReturn {
    console.log('formStep', formStep, formSteps, formKey, updateFormStepsRef);

    /*
    // fetch the labels of the form, can also contain default values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey);

    // fetch API response with form definition
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error,
    } = useApiProvider(formKey, formInputData, apiProvider);

    const emptyRawSchema: PydanticFormSchemaRawJson = useMemo(
        () => ({
            type: PydanticFormFieldType.OBJECT,
            properties: {},
        }),
        [],
    );

    const [rawSchema, setRawSchema] =
        useState<PydanticFormSchemaRawJson>(emptyRawSchema);
    const [hasNext, setHasNext] = useState<boolean>(false);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(rawSchema, formLabels?.labels);
*/
    return {
        validationErrorsDetails: undefined,
        apiError: undefined,
        hasNext: false,
        isFullFilled: true,
        isSending: false,
        isLoading: false,
        pydanticFormSchema: {
            title: 'Form',
            type: PydanticFormFieldType.OBJECT,
            properties: {},
        },
        initialValues: { ...formStep },
    };
}
